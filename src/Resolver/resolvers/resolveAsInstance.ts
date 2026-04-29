import type { ResolveOptions, StoreEntry } from '../../types';

/**
 * クラスからインスタンスを生成して返す
 * @param entry
 * @param options
 * @returns
 */
export default function resolveAsInstance<T>(
  entry: StoreEntry,
  options: ResolveOptions,
): T {
  const args = options.args || [];
  return new (entry.raw as any)(...args);
}
