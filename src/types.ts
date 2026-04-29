/**
 * リゾルバー種別
 */
export type ResolverType = 'instance' | 'factory' | 'reference' | 'clone';

/**
 * 登録可能なもの
 */
export type Registrable<T> =
  | (new (...args: any[]) => T) // クラス
  | ((...args: any[]) => T) // ファクトリー関数
  | T; // 値そのもの

/**
 * 登録する情報
 */
export type RegistrationEntry<T = any> = RegisterOptions & {
  /**
   * キー
   */
  key: string;

  /**
   * 登録した要素
   */
  raw: Registrable<T>;
};

/**
 * 登録処理のオプション
 */
export type RegisterOptions = {
  /**
   * 種別
   * resolve 時に使用する処理を決定する
   *
   * - instance: クラスからインスタンスを生成し返す
   * - factory: 関数の戻り値を返す
   * - reference: 値をそのまま返す
   * - clone: 値のコピーを返す
   *
   * 未指定の場合は raw の型からinstance,cloneを自動判別する
   * factoryとreferenceは自動判別されないので明示的に指定する必要がある
   */
  type?: ResolverType;

  /**
   * タグ
   */
  tags?: string[];

  /**
   * シングルトン
   * 初回に返したものと同じインスタンスを返し続ける
   */
  singleton?: boolean;
};

/**
 * 取得処理のオプション
 */
export type ResolveOptions<Args extends unknown[] = unknown[]> = {
  /**
   * コンストラクターまたは関数の引数
   */
  args?: Args;
};
