import { clone } from 'remeda';
import type { StoreEntry } from '../../types';

/**
 * 値をディープコピーして返す
 * @param entry
 * @returns
 */
export default function resolveAsClone<T>(entry: StoreEntry): T {
  return clone(entry.raw);
}
