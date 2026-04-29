import type { StoreEntry } from '../_types';

/**
 * エントリーを保持するためのクラス
 */
export default class Store<CategoryType extends unknown = unknown> {
  /**
   * カテゴリー
   */
  readonly category: PropertyKey;

  /**
   * エントリー
   */
  private _entries = new Map<string, StoreEntry<CategoryType>>();

  /**
   * コンストラクター
   * @param category カテゴリー
   */
  constructor(category: PropertyKey) {
    this.category = category;
  }

  /**
   * 要素の登録
   * @param entry 登録する要素
   */
  set(entry: StoreEntry<CategoryType>) {
    const { tags = [], ...rest } = entry;
    this._entries.set(entry.key, { tags, ...rest });
  }

  /**
   * 要素の取得
   * @param key キー
   */
  get(key: string): StoreEntry<CategoryType> | undefined {
    const entry = this._entries.get(key);
    if (entry) {
      return entry;
    }
  }

  /**
   * 要素の有無を確認
   * @param key キー
   */
  has(key: string): boolean {
    return this._entries.has(key);
  }

  /**
   * 登録されている全ての要素を取得
   */
  getEntries(): StoreEntry<CategoryType>[] {
    return Array.from(this._entries.values());
  }

  /**
   * タグで要素を取得
   * @param tag タグ
   */
  getByTag(tag: string): StoreEntry<CategoryType>[] {
    return this.getEntries().filter((entry) =>
      entry.tags.includes(tag),
    ) satisfies StoreEntry<CategoryType>[];
  }
}
