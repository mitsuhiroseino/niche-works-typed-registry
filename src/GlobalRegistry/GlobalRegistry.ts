import type {
  RegistryCategory,
  RegistryTypeMap,
  RegistryValue,
  ResolverFunction,
} from '../_types';
import TypedRegistry from '../TypedRegistry';
import type {
  RegisterOptions,
  Registrable,
  RegistrationEntry,
  ResolveOptions,
  ResolverType,
} from '../types';

/**
 * レジストリ管理クラス
 */
export default class GlobalRegistry<
  Registries extends RegistryTypeMap = RegistryTypeMap,
> {
  /**
   * 登録されているRegistry
   */
  private _registrys = new Map<
    string,
    TypedRegistry<RegistryValue<Registries>>
  >();

  /**
   * レジストリを登録する
   * @param registry
   */
  registerRegistry(registry: TypedRegistry<RegistryValue<Registries>>): void {
    this._registrys.set(registry.category, registry);
  }

  /**
   * レジストリを作成する
   * @param category
   * @returns
   */
  createRegistry<C extends RegistryCategory<Registries>>(category: C) {
    const registry = new TypedRegistry<RegistryValue<Registries>>(
      category as string,
    );
    this._registrys.set(category as string, registry);
    return registry;
  }

  /**
   * レジストリが無い場合は作成して返す
   * @param category
   * @returns
   */
  ensureRegistry<C extends RegistryCategory<Registries>>(category: C) {
    let registry = this._registrys.get(category as string);
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
  getRegistry<C extends RegistryCategory<Registries>>(category: C) {
    return this._registrys.get(category as string);
  }

  /**
   * 複数のエントリーを登録する
   * @param category
   * @param entries
   */
  registerAll<C extends RegistryCategory<Registries>>(
    category: C,
    entries: RegistrationEntry<Registries[C]>[],
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
  register<C extends RegistryCategory<Registries>>(
    category: C,
    key: string,
    raw: Registrable<Registries[C]>,
    options?: RegisterOptions,
  ) {
    this.ensureRegistry(category).register(key, raw, options);
  }

  /**
   * エントリーを取得する
   * @param key
   * @returns
   */
  getRaw<C extends RegistryCategory<Registries>>(
    category: C,
    key: string,
  ): Registrable<Registries[C]> | undefined {
    return this.getRegistry(category).getRaw(key) as Registrable<Registries[C]>;
  }

  /**
   * タグでエントリーを取得する
   * @param category
   * @param tag
   * @returns
   */
  getRawByTag<C extends RegistryCategory<Registries>>(
    category: C,
    tag: string,
  ): Registrable<Registries[C]>[] {
    return this.getRegistry(category).getRawByTag(tag) as Registrable<
      Registries[C]
    >[];
  }

  /**
   * レジストリにリゾルバーを設定する
   * @param category
   * @param type
   * @param resolver
   * @returns
   */
  setResolver<C extends RegistryCategory<Registries>>(
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
  resolve<C extends RegistryCategory<Registries>>(
    category: C,
    key: string,
    options?: ResolveOptions,
  ): Registries[C] | undefined {
    return this.getRegistry(category).resolve(key, options) as Registries[C];
  }

  /**
   * タグでエントリーを解決する
   * @param category
   * @param tag
   * @param options
   * @returns
   */
  resolveByTag<C extends RegistryCategory<Registries>>(
    category: C,
    tag: string,
    options?: ResolveOptions,
  ): Registries[C][] {
    return this.getRegistry(category).resolveByTag(
      tag,
      options,
    ) as Registries[C][];
  }
}
