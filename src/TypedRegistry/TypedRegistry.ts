import type { ResolverFunction } from '../_types';
import Resolver from '../Resolver';
import Store from '../Store';
import type {
  RegisterOptions,
  Registrable,
  RegistrationEntry,
  ResolveOptions,
  ResolverType,
} from '../types';

/**
 * エントリーを登録するためのクラス
 */
export default class TypedRegistry<CategoryType extends unknown = unknown> {
  /**
   * カテゴリー
   */
  readonly category: string;

  /**
   * Store
   */
  private _store: Store<CategoryType>;

  /**
   * Resolver
   */
  private _resolver: Resolver<CategoryType>;

  constructor(
    category: string,
    store: Store<CategoryType> = new Store(category),
  ) {
    this.category = category;
    this._store = store;
    this._resolver = new Resolver(category, store);
  }

  /**
   * エントリーを纏めて登録する
   * @param entries
   */
  registerAll(entries: RegistrationEntry<CategoryType>[]) {
    for (const entry of entries) {
      this._register(entry);
    }
  }

  /**
   * エントリーを登録する
   * @param key キー
   * @param raw 登録する要素
   * @param options 登録オプション
   */
  register(
    key: string,
    raw: Registrable<CategoryType>,
    options: RegisterOptions = {},
  ) {
    this._register({ key, raw, ...options });
  }

  /**
   * エントリーを登録する
   * @param entry
   */
  private _register(entry: RegistrationEntry<CategoryType>) {
    let { type, ...rest } = entry;
    if (type == null) {
      type = _detectType(entry.raw);
    }
    this._store.set({
      ...rest,
      type,
    });
  }

  /**
   * エントリーを取得する
   * @param key
   * @returns
   */
  getRaw(key: string): Registrable<CategoryType> | undefined {
    return this._store.get(key)?.raw;
  }

  /**
   * タグでエントリーを取得する
   * @param tag
   * @returns
   */
  getRawByTag(tag: string): Registrable<CategoryType>[] {
    return this._store.getByTag(tag).map((entry) => entry.raw);
  }

  /**
   * リゾルバーを設定する
   * @param type
   * @param resolver
   */
  setResolver(type: ResolverType, resolver: ResolverFunction) {
    this._resolver.setResolver(type, resolver);
  }

  /**
   * エントリーを解決する
   * @param key
   * @param options
   * @returns
   */
  resolve(key: string, options: ResolveOptions = {}): CategoryType | undefined {
    return this._resolver.resolve(key, options);
  }

  /**
   * タグでエントリーを解決する
   * @param tag
   * @param options
   * @returns
   */
  resolveByTag(tag: string, options: ResolveOptions = {}): CategoryType[] {
    return this._resolver.resolveByTag(tag, options);
  }
}

/**
 * 型を自動判別する
 * @param raw
 * @returns
 */
function _detectType(raw: unknown): ResolverType {
  if (raw == null) {
    return 'reference';
  }
  const type = typeof raw;
  if (type === 'function') {
    // クラス判定: toString の先頭が 'class'
    const str = raw.toString();
    if (IS_CLASS.test(str)) {
      return 'instance';
    }
  }
  return 'clone';
}
const IS_CLASS = /^\s*class\s+/;
