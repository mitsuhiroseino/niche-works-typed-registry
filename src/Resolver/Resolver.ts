import type { ResolverFunction } from '../_types';
import Store from '../Store';
import type { ResolveOptions, ResolverType } from '../types';
import resolvers from './resolvers';

/**
 * 戻り値を解決するためのクラス
 */
export default class Resolver<CategoryType extends unknown = unknown> {
  /**
   * カテゴリー
   */
  readonly category: string;

  /**
   * Store
   */
  private _store: Store<CategoryType>;

  /**
   * 登録情報の解決関数
   */
  private _resolvers = new Map<ResolverType, ResolverFunction>(resolvers);

  constructor(category: string, store: Store<CategoryType>) {
    this.category = category;
    this._store = store;
  }

  setResolver(type: ResolverType, resolver: ResolverFunction) {
    this._resolvers.set(type, resolver);
  }

  /**
   * エントリーを解決する
   * @param key
   * @param options
   * @returns
   */
  resolve(key: string, options: ResolveOptions = {}): CategoryType | undefined {
    const entry = this._store.get(key);
    if (!entry) {
      return;
    }
    if (entry.singleton && entry.value !== undefined) {
      return entry.value;
    }

    const resolver = this._resolvers.get(entry.type);
    if (resolver) {
      const value = resolver(entry, options);
      if (entry.singleton) {
        entry.value = value;
      }
      return value;
    } else {
      throw new Error(`No resolver found for type "${entry.type}"`);
    }
  }

  resolveByTag(tag: string, options: ResolveOptions = {}): CategoryType[] {
    return this._store
      .getByTag(tag)
      .map((entry) => this.resolve(entry.key, options));
  }
}
