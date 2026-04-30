import type { SetRequired } from 'type-fest';
import type { RegistrationEntry, ResolveOptions } from './types';

/**
 * レジストリー毎の型定義
 */
export type RegistryTypeMap = Record<string, unknown>;

/**
 * レジストリー毎の型定義から取得可能なレジストリーのカテゴリー
 */
export type RegistryCategory<Registries extends RegistryTypeMap> =
  keyof Registries;

/**
 * レジストリー毎の型定義から取得可能なレジストリーの値
 */
export type RegistryValue<
  Registries extends RegistryTypeMap = RegistryTypeMap,
> = Registries[keyof Registries];

/**
 * 保存されたエントリー
 */
export type StoreEntry<T = any> = SetRequired<RegistrationEntry<T>, 'type'> & {
  /**
   * シングルトン用の値
   */
  value?: T;
};

/**
 * 値の解決関数
 */
export type ResolverFunction<T = any> = (
  entry: StoreEntry<T>,
  options: ResolveOptions,
) => T;
