import type { SetRequired } from 'type-fest';
import type { RegistrationEntry, ResolveOptions } from './types';

/**
 * カテゴリー毎の型定義
 */
export type CategoryTypeMap = Record<string, unknown>;

/**
 * カテゴリー毎の型定義から取得可能なカテゴリーのキー
 */
export type CategoryKey<Categories extends CategoryTypeMap> = keyof Categories;

/**
 * カテゴリー毎の型定義から取得可能なカテゴリーの値
 */
export type CategoryValue<
  Categories extends CategoryTypeMap = CategoryTypeMap,
> = Categories[keyof Categories];

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
