import TypedRegistry from '../TypedRegistry';
import type {
  CategoryKey,
  CategoryTypeMap,
  CategoryValue,
  RegisterOptions,
  Registrable,
  RegistrationEntry,
  ResolveOptions,
  ResolverFunction,
  ResolverType,
} from '../types';

/**
 * レジストリ管理クラス
 */
export default class GlobalRegistry<
  Categories extends CategoryTypeMap = CategoryTypeMap,
> {
  /**
   * 登録されているRegistry
   */
  private _registrys = new Map<
    PropertyKey,
    TypedRegistry<CategoryValue<Categories>>
  >();

  /**
   * レジストリを登録する
   * @param registry
   */
  registerRegistry(registry: TypedRegistry<CategoryValue<Categories>>): void {
    this._registrys.set(registry.category, registry);
  }

  /**
   * レジストリを作成する
   * @param category
   * @returns
   */
  createRegistry<C extends CategoryKey<Categories>>(category: C) {
    const registry = new TypedRegistry<CategoryValue<Categories>>(category);
    this._registrys.set(category, registry);
    return registry;
  }

  /**
   * レジストリが無い場合は作成して返す
   * @param category
   * @returns
   */
  ensureRegistry<C extends CategoryKey<Categories>>(category: C) {
    let registry = this._registrys.get(category);
    if (!registry) {
      registry = this.createRegistry(category);
    }
    return registry;
  }

  /**
   * レジストリを取得する
   * @param category
   * @returns
   */
  getRegistry<C extends CategoryKey<Categories>>(category: C) {
    return this._registrys.get(category);
  }

  /**
   * 複数のエントリーを登録する
   * @param category
   * @param entries
   */
  registerAll<C extends CategoryKey<Categories>>(
    category: C,
    entries: RegistrationEntry<Categories[C]>[],
  ) {
    this.ensureRegistry(category).registerAll(entries);
  }

  /**
   * エントリーを登録する
   * @param category
   * @param key
   * @param raw
   * @param options
   */
  register<C extends CategoryKey<Categories>>(
    category: C,
    key: string,
    raw: Registrable<Categories[C]>,
    options?: RegisterOptions,
  ) {
    this.ensureRegistry(category).register(key, raw, options);
  }

  /**
   * エントリーを取得する
   * @param key
   * @returns
   */
  getRaw<C extends CategoryKey<Categories>>(
    category: C,
    key: string,
  ): Registrable<Categories[C]> | undefined {
    return this.getRegistry(category).getRaw(key) as Registrable<Categories[C]>;
  }

  /**
   * タグでエントリーを取得する
   * @param category
   * @param tag
   * @returns
   */
  getRawByTag<C extends CategoryKey<Categories>>(
    category: C,
    tag: string,
  ): Registrable<Categories[C]>[] {
    return this.getRegistry(category).getRawByTag(tag) as Registrable<
      Categories[C]
    >[];
  }

  /**
   * レジストリにリゾルバーを設定する
   * @param category
   * @param type
   * @param resolver
   * @returns
   */
  setResolver<C extends CategoryKey<Categories>>(
    category: C,
    type: ResolverType,
    resolver: ResolverFunction,
  ) {
    return this.getRegistry(category).setResolver(type, resolver);
  }

  /**
   * エントリーを解決する
   * @param key
   * @param options
   * @returns
   */
  resolve<C extends CategoryKey<Categories>>(
    category: C,
    key: string,
    options?: ResolveOptions,
  ): Categories[C] | undefined {
    return this.getRegistry(category).resolve(key, options) as Categories[C];
  }

  /**
   * タグでエントリーを解決する
   * @param category
   * @param tag
   * @param options
   * @returns
   */
  resolveByTag<C extends CategoryKey<Categories>>(
    category: C,
    tag: string,
    options?: ResolveOptions,
  ): Categories[C][] {
    return this.getRegistry(category).resolveByTag(
      tag,
      options,
    ) as Categories[C][];
  }
}
