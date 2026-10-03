import type { ResolverFunction, ResolverType, StoreEntry } from '../_types';
import type { ResolveOptions } from '../types';
import resolvers from './resolvers';

/**
 * エントリーから戻り値を解決するためのクラス
 */
export default class Resolver {
  /**
   * 登録情報の解決関数
   */
  private _resolvers: ReadonlyMap<ResolverType, ResolverFunction> = new Map(
    resolvers,
  );

  /**
   * エントリーを解決する
   * @param entry
   * @param options
   * @returns
   */
  resolve(entry: StoreEntry, options: ResolveOptions = {}): unknown {
    if (entry.singleton && 'value' in entry) {
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
}
