import type { StoreEntry } from '../../_types';
import type { ResolveOptions } from '../../types';

/**
 * 関数の戻り値を返す
 * @param entry
 * @param options
 * @returns
 */
export default function resolveAsFactory<T>(
  entry: StoreEntry,
  options: ResolveOptions,
): T {
  const args = options.args || [];
  return (entry.raw as Function)(...args);
}
