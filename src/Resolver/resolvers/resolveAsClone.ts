import { klona } from 'klona/full';
import type { StoreEntry } from '../../_types';

/**
 * 値をディープコピーして返す
 * @param entry
 * @returns
 */
export default function resolveAsClone<T>(entry: StoreEntry): T {
  return klona(entry.raw);
}
