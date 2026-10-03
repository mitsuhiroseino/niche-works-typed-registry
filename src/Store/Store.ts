import type { SetOptional } from 'type-fest';
import type { StoreEntry } from '../_types';

/**
 * エントリーを保持するためのクラス
 *
 * 親の Store を指定した場合、自身に無いエントリーは親から取得する
 */
export default class Store {
  /**
   * エントリー
   */
  private _entries = new Map<string, StoreEntry>();

  /**
   * 親の Store
   */
  private _parent: Store | undefined;

  /**
   * コンストラクター
   * @param parent 親の Store
   */
  constructor(parent?: Store) {
    this._parent = parent;
  }

  /**
   * 要素の登録
   * @param entry 登録する要素
   */
  set(entry: SetOptional<StoreEntry, 'tags'>) {
    const { tags = [], ...rest } = entry;
    this._entries.set(entry.key, { tags, ...rest });
  }

  /**
   * 要素の取得
   * @param key キー
   */
  get(key: string): StoreEntry | undefined {
    return this._entries.get(key) ?? this._parent?.get(key);
  }

  /**
   * 要素の有無を確認
   * @param key キー
   */
  has(key: string): boolean {
    return this._entries.has(key) || !!this._parent?.has(key);
  }

  /**
   * 登録されている全ての要素を取得
   * 親と同じキーの要素は自身のもので置き換える
   */
  getEntries(): StoreEntry[] {
    if (!this._parent) {
      return Array.from(this._entries.values());
    }
    const entries = new Map(
      this._parent.getEntries().map((entry) => [entry.key, entry]),
    );
    for (const [key, entry] of this._entries) {
      entries.set(key, entry);
    }
    return Array.from(entries.values());
  }

  /**
   * タグで要素を取得
   * @param tag タグ
   */
  getByTag(tag: string): StoreEntry[] {
    return this.getEntries().filter((entry) => entry.tags.includes(tag));
  }
}
