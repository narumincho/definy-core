import * as a from "util";
/**
 * Maybe
 */
export type Maybe<T> = { _: "Just"; value: T } | { _: "Nothing" };

/**
 * Result
 */
export type Result<ok, error> =
  | { _: "Ok"; ok: ok }
  | { _: "Error"; error: error };

/**
 * 日時. 0001-01-01T00:00:00.000Z to 9999-12-31T23:59:59.999Z 最小単位はミリ秒. ミリ秒の求め方は day*1000*60*60*24 + millisecond
 */
export type Time = {
  /**
   * 1970-01-01からの経過日数. マイナスになることもある
   */
  day: number;
  /**
   * 日にちの中のミリ秒. 0 to 86399999 (=1000*60*60*24-1)
   */
  millisecond: number;
};

/**
 * デバッグの状態と, デバッグ時ならアクセスしているポート番号
 */
export type ClientMode = { _: "DebugMode"; int32: number } | { _: "Release" };

/**
 * ログインのURLを発行するために必要なデータ
 */
export type RequestLogInUrlRequestData = {
  /**
   * ログインに使用するプロバイダー
   */
  openIdConnectProvider: OpenIdConnectProvider;
  /**
   * ログインした後に返ってくるURLに必要なデータ
   */
  urlData: UrlData;
};

/**
 * プロバイダー (例: LINE, Google, GitHub)
 */
export type OpenIdConnectProvider = "Google" | "GitHub";

/**
 * デバッグモードかどうか,言語とページの場所. URLとして表現されるデータ. Googleなどの検索エンジンの都合( https://support.google.com/webmasters/answer/182192?hl=ja )で,URLにページの言語のを入れて,言語ごとに別のURLである必要がある. デバッグ時のホスト名は http://[::1] になる
 */
export type UrlData = {
  /**
   * クライアントモード
   */
  clientMode: ClientMode;
  /**
   * 場所
   */
  location: Location;
  /**
   * 言語
   */
  language: Language;
  /**
   * アクセストークン. ログインした後のリダイレクト先としてサーバーから渡される
   */
  accessToken: Maybe<AccessToken>;
};

/**
 * 英語,日本語,エスペラント語などの言語
 */
export type Language = "Japanese" | "English" | "Esperanto";

/**
 * DefinyWebアプリ内での場所を示すもの. URLから求められる. URLに変換できる
 */
export type Location =
  | { _: "Home" }
  | { _: "CreateProject" }
  | { _: "User"; userId: UserId }
  | { _: "Project"; projectId: ProjectId };

/**
 * ユーザーが公開している情報
 */
export type User = {
  /**
   * ユーザー名. 表示される名前。他のユーザーとかぶっても良い. 絵文字も使える. 全角英数は半角英数,半角カタカナは全角カタカナ, (株)の合字を分解するなどのNFKCの正規化がされる. U+0000-U+0019 と U+007F-U+00A0 の範囲の文字は入らない. 前後に空白を含められない. 間の空白は2文字以上連続しない. 文字数のカウント方法は正規化されたあとのCodePoint単位. Twitterと同じ、1文字以上50文字以下
   */
  name: string;
  /**
   * プロフィール画像
   */
  imageHash: FileHash;
  /**
   * 自己紹介文. 改行文字を含めることができる. Twitterと同じ 0～160文字
   */
  introduction: string;
  /**
   * ユーザーが作成された日時
   */
  createdAt: Time;
  /**
   * プロジェクトに対する いいね
   */
  likedProjectIdList: ReadonlyArray<ProjectId>;
  /**
   * 開発に参加した (書いたコードが使われた) プロジェクト
   */
  developedProjectIdList: ReadonlyArray<ProjectId>;
  /**
   * コメントをしたアイデア
   */
  commentedIdeaIdList: ReadonlyArray<IdeaId>;
};

/**
 * 最初に自分の情報を得るときに返ってくるデータ
 */
export type UserAndUserId = {
  /**
   * ユーザーID
   */
  userId: UserId;
  /**
   * ユーザーのデータ
   */
  user: User;
};

/**
 * プロジェクト
 */
export type Project = {
  /**
   * プロジェクト名
   */
  name: string;
  /**
   * プロジェクトのアイコン画像
   */
  icon: FileHash;
  /**
   * プロジェクトのカバー画像
   */
  image: FileHash;
  /**
   * 作成日時
   */
  createdAt: Time;
  /**
   * 作成アカウント
   */
  createdBy: UserId;
};

/**
 * プロジェクトを作成したときに返ってくるデータ
 */
export type ProjectAndProjectId = {
  /**
   * プロジェクトID
   */
  projectId: ProjectId;
  /**
   * プロジェクトのデータ
   */
  project: Project;
};

/**
 * アイデア
 */
export type Idea = {
  /**
   * アイデア名
   */
  name: string;
  /**
   * 言い出しっぺ
   */
  createdBy: UserId;
  /**
   * 作成日時
   */
  createdAt: Time;
  /**
   * 対象のプロジェクト
   */
  projectId: ProjectId;
  /**
   * アイデアの要素
   */
  itemList: ReadonlyArray<IdeaItem>;
};

/**
 * アイデアのコメント
 */
export type IdeaItem =
  | { _: "Comment"; comment: Comment }
  | { _: "Suggestion"; suggestion: Suggestion };

/**
 * 文章でのコメント
 */
export type Comment = {
  /**
   * 本文
   */
  body: string;
  /**
   * 作成者
   */
  createdBy: UserId;
  /**
   * 作成日時
   */
  createdAt: Time;
};

/**
 * 編集提案
 */
export type Suggestion = {
  /**
   * アイデアに投稿した日時
   */
  createdAt: Time;
  /**
   * なぜ,どんな変更をしたのかの説明
   */
  description: string;
  /**
   * 変更点
   */
  change: Change;
};

/**
 * 変更点
 */
export type Change = { _: "ProjectName"; string_: string };

/**
 * モジュール
 */
export type Module = {
  /**
   * モジュール名.階層構造を表現することができる
   */
  name: ReadonlyArray<string>;
  /**
   * モジュールの説明
   */
  description: string;
  /**
   * 外部のプロジェクトに公開するかどうか
   */
  export: boolean;
};

/**
 * 型の定義
 */
export type TypeDefinition = {
  /**
   * 型の名前
   */
  name: string;
  /**
   * この型の元
   */
  parentList: ReadonlyArray<PartId>;
  /**
   * 型の説明
   */
  description: string;
};

/**
 * 型の定義本体
 */
export type TypeBody =
  | {
      _: "Product";
      typeBodyProductMemberList: ReadonlyArray<TypeBodyProductMember>;
    }
  | { _: "Sum"; typeBodySumPatternList: ReadonlyArray<TypeBodySumPattern> }
  | { _: "Kernel"; typeBodyKernel: TypeBodyKernel };

/**
 * 直積型のメンバー
 */
export type TypeBodyProductMember = {
  /**
   * メンバー名
   */
  name: string;
  /**
   * 説明文
   */
  description: string;
  /**
   * メンバー値の型
   */
  memberType: TypeId;
};

/**
 * 直積型のパターン
 */
export type TypeBodySumPattern = {
  /**
   * タグ名
   */
  name: string;
  /**
   * 説明文
   */
  description: string;
  /**
   * パラメーター
   */
  parameter: Maybe<TypeId>;
};

/**
 * Definyだけでは表現できないデータ型
 */
export type TypeBodyKernel = "Function" | "Int32" | "List";

/**
 * パーツの定義
 */
export type PartDefinition = {
  /**
   * パーツの名前
   */
  name: string;
  /**
   * このパーツの元
   */
  parentList: ReadonlyArray<PartId>;
  /**
   * パーツの説明
   */
  description: string;
  /**
   * パーツの型
   */
  type: Type;
  /**
   * パーツの式
   */
  expr: Maybe<Expr>;
  /**
   * 所属しているモジュール
   */
  moduleId: ModuleId;
};

/**
 * 型
 */
export type Type = {
  /**
   * 型の参照
   */
  reference: TypeId;
  /**
   * 型のパラメーター
   */
  parameter: ReadonlyArray<Type>;
};

/**
 * 式
 */
export type Expr =
  | { _: "Kernel"; kernelExpr: KernelExpr }
  | { _: "Int32Literal"; int32: number }
  | { _: "PartReference"; partId: PartId }
  | { _: "LocalPartReference"; localPartReference: LocalPartReference }
  | { _: "TagReference"; tagReferenceIndex: TagReferenceIndex }
  | { _: "FunctionCall"; functionCall: FunctionCall }
  | { _: "Lambda"; lambdaBranchList: ReadonlyArray<LambdaBranch> };

/**
 * 評価しきった式
 */
export type EvaluatedExpr =
  | { _: "Kernel"; kernelExpr: KernelExpr }
  | { _: "Int32"; int32: number }
  | { _: "TagReference"; tagReferenceIndex: TagReferenceIndex }
  | { _: "Lambda"; lambdaBranchList: ReadonlyArray<LambdaBranch> }
  | { _: "KernelCall"; kernelCall: KernelCall };

/**
 * 複数の引数が必要な内部関数の部分呼び出し
 */
export type KernelCall = {
  /**
   * 関数
   */
  kernel: KernelExpr;
  /**
   * 呼び出すパラメーター
   */
  expr: EvaluatedExpr;
};

/**
 * Definyだけでは表現できない式
 */
export type KernelExpr = "Int32Add" | "Int32Sub" | "Int32Mul";

/**
 * ローカルパスの参照を表す
 */
export type LocalPartReference = {
  /**
   * ローカルパスが定義されているパーツのID
   */
  partId: PartId;
  /**
   * ローカルパーツID
   */
  localPartId: LocalPartId;
};

/**
 * タグの参照を表す
 */
export type TagReferenceIndex = {
  /**
   * 型ID
   */
  typeId: TypeId;
  /**
   * タグIndex
   */
  tagIndex: number;
};

/**
 * 関数呼び出し
 */
export type FunctionCall = {
  /**
   * 関数
   */
  function: Expr;
  /**
   * パラメーター
   */
  parameter: Expr;
};

/**
 * ラムダのブランチ. Just x -> data x のようなところ
 */
export type LambdaBranch = {
  /**
   * 入力値の条件を書くところ. Just x
   */
  condition: Condition;
  /**
   * ブランチの説明
   */
  description: string;
  localPartList: ReadonlyArray<BranchPartDefinition>;
  /**
   * 式
   */
  expr: Maybe<Expr>;
};

/**
 * ブランチの式を使う条件
 */
export type Condition =
  | { _: "ByTag"; conditionTag: ConditionTag }
  | { _: "ByCapture"; conditionCapture: ConditionCapture }
  | { _: "Any" }
  | { _: "Int32"; int32: number };

/**
 * タグによる条件
 */
export type ConditionTag = {
  /**
   * タグ
   */
  tag: TagId;
  /**
   * パラメーター
   */
  parameter: Maybe<Condition>;
};

/**
 * キャプチャパーツへのキャプチャ
 */
export type ConditionCapture = {
  /**
   * キャプチャパーツの名前
   */
  name: string;
  /**
   * ローカルパーツId
   */
  localPartId: LocalPartId;
};

/**
 * ラムダのブランチで使えるパーツを定義する部分
 */
export type BranchPartDefinition = {
  /**
   * ローカルパーツID
   */
  localPartId: LocalPartId;
  /**
   * ブランチパーツの名前
   */
  name: string;
  /**
   * ブランチパーツの説明
   */
  description: string;
  /**
   * ローカルパーツの型
   */
  type: Type;
  /**
   * ローカルパーツの式
   */
  expr: Expr;
};

export type EvaluateExprError =
  | { _: "NeedPartDefinition"; partId: PartId }
  | { _: "PartExprIsNothing"; partId: PartId }
  | {
      _: "CannotFindLocalPartDefinition";
      localPartReference: LocalPartReference;
    }
  | { _: "TypeError"; typeError: TypeError }
  | { _: "NotSupported" };

/**
 * 型エラー
 */
export type TypeError = {
  /**
   * 型エラーの説明
   */
  message: string;
};

/**
 * プロジェクト作成時に必要なパラメーター
 */
export type CreateProjectParameter = {
  /**
   * プロジェクトを作るときのアカウント
   */
  accessToken: AccessToken;
  /**
   * プロジェクト名
   */
  projectName: string;
};

/**
 * アクセストークンに関するエラー
 */
export type AccessTokenError =
  | "AccessTokenExpiredOrInvalid"
  | "ProjectNameIsInvalid";

/**
 * indexDBに格納したりする取得日時も含めたProject
 */
export type ProjectCache = {
  /**
   * プロジェクト
   */
  project: Project;
  /**
   * 取得日時
   */
  respondTime: Time;
};

/**
 * indexDBに格納したりする取得日も含めたUser
 */
export type UserCache = {
  /**
   * ユーザーのデータ
   */
  user: User;
  /**
   * 取得日時
   */
  respondTime: Time;
};

/**
 * プロジェクトのキャッシュデータとID. indexedDBからElmに渡す用
 */
export type ProjectCacheWithId = {
  /**
   * プロジェクトのデータ
   */
  projectCache: Maybe<ProjectCache>;
  /**
   * プロジェクトのID
   */
  projectId: ProjectId;
};

/**
 * ユーザーのキャッシュデータとID. indexedDBからElmに渡す用
 */
export type UserCacheWithId = {
  /**
   * ユーザーのデータ
   */
  userCache: Maybe<UserCache>;
  /**
   * ユーザーID
   */
  userId: UserId;
};

export type AccessToken = string & { _accessToken: never };

export type UserId = string & { _userId: never };

export type ProjectId = string & { _projectId: never };

export type FileHash = string & { _fileHash: never };

export type IdeaId = string & { _ideaId: never };

export type PartId = string & { _partId: never };

export type TypeId = string & { _typeId: never };

export type ModuleId = string & { _moduleId: never };

export type LocalPartId = string & { _localPartId: never };

export type TagId = string & { _tagId: never };

export const maybeJust = <T>(value: T): Maybe<T> => ({
  _: "Just",
  value: value,
});

export const maybeNothing = <T>(): Maybe<T> => ({ _: "Nothing" });

export const resultOk = <ok, error>(ok: ok): Result<ok, error> => ({
  _: "Ok",
  ok: ok,
});

export const resultError = <ok, error>(error: error): Result<ok, error> => ({
  _: "Error",
  error: error,
});

/**
 * デバッグモード. ポート番号を保持する. オリジンは http://[::1]:2520 のようなもの
 */
export const clientModeDebugMode = (int32: number): ClientMode => ({
  _: "DebugMode",
  int32: int32,
});

/**
 * リリースモード. https://definy.app
 */
export const clientModeRelease: ClientMode = { _: "Release" };

/**
 * 最初のページ
 */
export const locationHome: Location = { _: "Home" };

/**
 * プロジェクト作成画面
 */
export const locationCreateProject: Location = { _: "CreateProject" };

/**
 * ユーザーの詳細ページ
 */
export const locationUser = (userId: UserId): Location => ({
  _: "User",
  userId: userId,
});

/**
 * プロジェクトの詳細ページ
 */
export const locationProject = (projectId: ProjectId): Location => ({
  _: "Project",
  projectId: projectId,
});

/**
 * 文章でのコメント
 */
export const ideaItemComment = (comment: Comment): IdeaItem => ({
  _: "Comment",
  comment: comment,
});

/**
 * 編集提案をする
 */
export const ideaItemSuggestion = (suggestion: Suggestion): IdeaItem => ({
  _: "Suggestion",
  suggestion: suggestion,
});

/**
 * プロジェクト名の変更
 */
export const changeProjectName = (string_: string): Change => ({
  _: "ProjectName",
  string_: string_,
});

/**
 * 直積型
 */
export const typeBodyProduct = (
  typeBodyProductMemberList: ReadonlyArray<TypeBodyProductMember>
): TypeBody => ({
  _: "Product",
  typeBodyProductMemberList: typeBodyProductMemberList,
});

/**
 * 直和型
 */
export const typeBodySum = (
  typeBodySumPatternList: ReadonlyArray<TypeBodySumPattern>
): TypeBody => ({ _: "Sum", typeBodySumPatternList: typeBodySumPatternList });

/**
 * Definyだけでは表現できないデータ型
 */
export const typeBodyKernel = (typeBodyKernel: TypeBodyKernel): TypeBody => ({
  _: "Kernel",
  typeBodyKernel: typeBodyKernel,
});

/**
 * Definyだけでは表現できない式
 */
export const exprKernel = (kernelExpr: KernelExpr): Expr => ({
  _: "Kernel",
  kernelExpr: kernelExpr,
});

/**
 * 32bit整数
 */
export const exprInt32Literal = (int32: number): Expr => ({
  _: "Int32Literal",
  int32: int32,
});

/**
 * パーツの値を参照
 */
export const exprPartReference = (partId: PartId): Expr => ({
  _: "PartReference",
  partId: partId,
});

/**
 * ローカルパーツの参照
 */
export const exprLocalPartReference = (
  localPartReference: LocalPartReference
): Expr => ({
  _: "LocalPartReference",
  localPartReference: localPartReference,
});

/**
 * タグを参照
 */
export const exprTagReference = (
  tagReferenceIndex: TagReferenceIndex
): Expr => ({ _: "TagReference", tagReferenceIndex: tagReferenceIndex });

/**
 * 関数呼び出し
 */
export const exprFunctionCall = (functionCall: FunctionCall): Expr => ({
  _: "FunctionCall",
  functionCall: functionCall,
});

/**
 * ラムダ
 */
export const exprLambda = (
  lambdaBranchList: ReadonlyArray<LambdaBranch>
): Expr => ({ _: "Lambda", lambdaBranchList: lambdaBranchList });

/**
 * Definyだけでは表現できない式
 */
export const evaluatedExprKernel = (kernelExpr: KernelExpr): EvaluatedExpr => ({
  _: "Kernel",
  kernelExpr: kernelExpr,
});

/**
 * 32bit整数
 */
export const evaluatedExprInt32 = (int32: number): EvaluatedExpr => ({
  _: "Int32",
  int32: int32,
});

/**
 * タグを参照
 */
export const evaluatedExprTagReference = (
  tagReferenceIndex: TagReferenceIndex
): EvaluatedExpr => ({
  _: "TagReference",
  tagReferenceIndex: tagReferenceIndex,
});

/**
 * ラムダ
 */
export const evaluatedExprLambda = (
  lambdaBranchList: ReadonlyArray<LambdaBranch>
): EvaluatedExpr => ({ _: "Lambda", lambdaBranchList: lambdaBranchList });

/**
 * 内部関数呼び出し
 */
export const evaluatedExprKernelCall = (
  kernelCall: KernelCall
): EvaluatedExpr => ({ _: "KernelCall", kernelCall: kernelCall });

/**
 * タグ
 */
export const conditionByTag = (conditionTag: ConditionTag): Condition => ({
  _: "ByTag",
  conditionTag: conditionTag,
});

/**
 * キャプチャパーツへのキャプチャ
 */
export const conditionByCapture = (
  conditionCapture: ConditionCapture
): Condition => ({ _: "ByCapture", conditionCapture: conditionCapture });

/**
 * _ すべてのパターンを通すもの
 */
export const conditionAny: Condition = { _: "Any" };

/**
 * 32bit整数の完全一致
 */
export const conditionInt32 = (int32: number): Condition => ({
  _: "Int32",
  int32: int32,
});

/**
 * 式を評価するには,このパーツの定義が必要だと言っている
 */
export const evaluateExprErrorNeedPartDefinition = (
  partId: PartId
): EvaluateExprError => ({ _: "NeedPartDefinition", partId: partId });

/**
 * パーツの式が空だと言っている
 */
export const evaluateExprErrorPartExprIsNothing = (
  partId: PartId
): EvaluateExprError => ({ _: "PartExprIsNothing", partId: partId });

/**
 * ローカルパーツの定義を見つけることができなかった
 */
export const evaluateExprErrorCannotFindLocalPartDefinition = (
  localPartReference: LocalPartReference
): EvaluateExprError => ({
  _: "CannotFindLocalPartDefinition",
  localPartReference: localPartReference,
});

/**
 * 型が合わない
 */
export const evaluateExprErrorTypeError = (
  typeError: TypeError
): EvaluateExprError => ({ _: "TypeError", typeError: typeError });

/**
 * まだサポートしていないものが含まれている
 */
export const evaluateExprErrorNotSupported: EvaluateExprError = {
  _: "NotSupported",
};

/**
 * numberの32bit符号あり整数をSigned Leb128のバイナリに変換する
 */
export const encodeInt32 = (value: number): ReadonlyArray<number> => {
  value |= 0;
  const result: Array<number> = [];
  while (true) {
    const byte: number = value & 127;
    value >>= 7;
    if (
      (value === 0 && (byte & 64) === 0) ||
      (value === -1 && (byte & 64) !== 0)
    ) {
      result.push(byte);
      return result;
    }
    result.push(byte | 128);
  }
};

/**
 * stringからバイナリに変換する.
 */
export const encodeString = (text: string): ReadonlyArray<number> => {
  const result: ReadonlyArray<number> = [
    ...new (process === undefined || process.title === "browser"
      ? TextEncoder
      : a.TextEncoder)().encode(text),
  ];
  return encodeInt32(result.length).concat(result);
};

/**
 * boolからバイナリに変換する
 */
export const encodeBool = (value: boolean): ReadonlyArray<number> => [
  value ? 1 : 0,
];

export const encodeBinary = (value: Uint8Array): ReadonlyArray<number> =>
  encodeInt32(value.length).concat([...value]);

export const encodeList = <T>(
  encodeFunction: (a: T) => ReadonlyArray<number>
): ((a: ReadonlyArray<T>) => ReadonlyArray<number>) => (
  list: ReadonlyArray<T>
): ReadonlyArray<number> => {
  let result: Array<number> = encodeInt32(list.length) as Array<number>;
  for (const element of list) {
    result = result.concat(encodeFunction(element));
  }
  return result;
};

export const encodeMaybe = <T>(
  encodeFunction: (a: T) => ReadonlyArray<number>
): ((a: Maybe<T>) => ReadonlyArray<number>) => (
  maybe: Maybe<T>
): ReadonlyArray<number> => {
  switch (maybe._) {
    case "Just": {
      return [0].concat(encodeFunction(maybe.value));
    }
    case "Nothing": {
      return [1];
    }
  }
};

export const encodeResult = <ok, error>(
  okEncodeFunction: (a: ok) => ReadonlyArray<number>,
  errorEncodeFunction: (a: error) => ReadonlyArray<number>
): ((a: Result<ok, error>) => ReadonlyArray<number>) => (
  result: Result<ok, error>
): ReadonlyArray<number> => {
  switch (result._) {
    case "Ok": {
      return [0].concat(okEncodeFunction(result.ok));
    }
    case "Error": {
      return [1].concat(errorEncodeFunction(result.error));
    }
  }
};

export const encodeId = (id: string): ReadonlyArray<number> => {
  const result: Array<number> = [];
  for (let i = 0; i < 16; i += 1) {
    result[i] = Number.parseInt(id.slice(i * 2, i * 2 + 2), 16);
  }
  return result;
};

export const encodeToken = (id: string): ReadonlyArray<number> => {
  const result: Array<number> = [];
  for (let i = 0; i < 32; i += 1) {
    result[i] = Number.parseInt(id.slice(i * 2, i * 2 + 2), 16);
  }
  return result;
};

export const encodeTime = (time: Time): ReadonlyArray<number> =>
  encodeInt32(time.day).concat(encodeInt32(time.millisecond));

export const encodeClientMode = (
  clientMode: ClientMode
): ReadonlyArray<number> => {
  switch (clientMode._) {
    case "DebugMode": {
      return [0].concat(encodeInt32(clientMode.int32));
    }
    case "Release": {
      return [1];
    }
  }
};

export const encodeRequestLogInUrlRequestData = (
  requestLogInUrlRequestData: RequestLogInUrlRequestData
): ReadonlyArray<number> =>
  encodeOpenIdConnectProvider(
    requestLogInUrlRequestData.openIdConnectProvider
  ).concat(encodeUrlData(requestLogInUrlRequestData.urlData));

export const encodeOpenIdConnectProvider = (
  openIdConnectProvider: OpenIdConnectProvider
): ReadonlyArray<number> => {
  switch (openIdConnectProvider) {
    case "Google": {
      return [0];
    }
    case "GitHub": {
      return [1];
    }
  }
};

export const encodeUrlData = (urlData: UrlData): ReadonlyArray<number> =>
  encodeClientMode(urlData.clientMode)
    .concat(encodeLocation(urlData.location))
    .concat(encodeLanguage(urlData.language))
    .concat(encodeMaybe(encodeToken)(urlData.accessToken));

export const encodeLanguage = (language: Language): ReadonlyArray<number> => {
  switch (language) {
    case "Japanese": {
      return [0];
    }
    case "English": {
      return [1];
    }
    case "Esperanto": {
      return [2];
    }
  }
};

export const encodeLocation = (location: Location): ReadonlyArray<number> => {
  switch (location._) {
    case "Home": {
      return [0];
    }
    case "CreateProject": {
      return [1];
    }
    case "User": {
      return [2].concat(encodeId(location.userId));
    }
    case "Project": {
      return [3].concat(encodeId(location.projectId));
    }
  }
};

export const encodeUser = (user: User): ReadonlyArray<number> =>
  encodeString(user.name)
    .concat(encodeToken(user.imageHash))
    .concat(encodeString(user.introduction))
    .concat(encodeTime(user.createdAt))
    .concat(encodeList(encodeId)(user.likedProjectIdList))
    .concat(encodeList(encodeId)(user.developedProjectIdList))
    .concat(encodeList(encodeId)(user.commentedIdeaIdList));

export const encodeUserAndUserId = (
  userAndUserId: UserAndUserId
): ReadonlyArray<number> =>
  encodeId(userAndUserId.userId).concat(encodeUser(userAndUserId.user));

export const encodeProject = (project: Project): ReadonlyArray<number> =>
  encodeString(project.name)
    .concat(encodeToken(project.icon))
    .concat(encodeToken(project.image))
    .concat(encodeTime(project.createdAt))
    .concat(encodeId(project.createdBy));

export const encodeProjectAndProjectId = (
  projectAndProjectId: ProjectAndProjectId
): ReadonlyArray<number> =>
  encodeId(projectAndProjectId.projectId).concat(
    encodeProject(projectAndProjectId.project)
  );

export const encodeIdea = (idea: Idea): ReadonlyArray<number> =>
  encodeString(idea.name)
    .concat(encodeId(idea.createdBy))
    .concat(encodeTime(idea.createdAt))
    .concat(encodeId(idea.projectId))
    .concat(encodeList(encodeIdeaItem)(idea.itemList));

export const encodeIdeaItem = (ideaItem: IdeaItem): ReadonlyArray<number> => {
  switch (ideaItem._) {
    case "Comment": {
      return [0].concat(encodeComment(ideaItem.comment));
    }
    case "Suggestion": {
      return [1].concat(encodeSuggestion(ideaItem.suggestion));
    }
  }
};

export const encodeComment = (comment: Comment): ReadonlyArray<number> =>
  encodeString(comment.body)
    .concat(encodeId(comment.createdBy))
    .concat(encodeTime(comment.createdAt));

export const encodeSuggestion = (
  suggestion: Suggestion
): ReadonlyArray<number> =>
  encodeTime(suggestion.createdAt)
    .concat(encodeString(suggestion.description))
    .concat(encodeChange(suggestion.change));

export const encodeChange = (change: Change): ReadonlyArray<number> => {
  switch (change._) {
    case "ProjectName": {
      return [0].concat(encodeString(change.string_));
    }
  }
};

export const encodeModule = (module_: Module): ReadonlyArray<number> =>
  encodeList(encodeString)(module_.name)
    .concat(encodeString(module_.description))
    .concat(encodeBool(module_["export"]));

export const encodeTypeDefinition = (
  typeDefinition: TypeDefinition
): ReadonlyArray<number> =>
  encodeString(typeDefinition.name)
    .concat(encodeList(encodeId)(typeDefinition.parentList))
    .concat(encodeString(typeDefinition.description));

export const encodeTypeBody = (typeBody: TypeBody): ReadonlyArray<number> => {
  switch (typeBody._) {
    case "Product": {
      return [0].concat(
        encodeList(encodeTypeBodyProductMember)(
          typeBody.typeBodyProductMemberList
        )
      );
    }
    case "Sum": {
      return [1].concat(
        encodeList(encodeTypeBodySumPattern)(typeBody.typeBodySumPatternList)
      );
    }
    case "Kernel": {
      return [2].concat(encodeTypeBodyKernel(typeBody.typeBodyKernel));
    }
  }
};

export const encodeTypeBodyProductMember = (
  typeBodyProductMember: TypeBodyProductMember
): ReadonlyArray<number> =>
  encodeString(typeBodyProductMember.name)
    .concat(encodeString(typeBodyProductMember.description))
    .concat(encodeId(typeBodyProductMember.memberType));

export const encodeTypeBodySumPattern = (
  typeBodySumPattern: TypeBodySumPattern
): ReadonlyArray<number> =>
  encodeString(typeBodySumPattern.name)
    .concat(encodeString(typeBodySumPattern.description))
    .concat(encodeMaybe(encodeId)(typeBodySumPattern.parameter));

export const encodeTypeBodyKernel = (
  typeBodyKernel: TypeBodyKernel
): ReadonlyArray<number> => {
  switch (typeBodyKernel) {
    case "Function": {
      return [0];
    }
    case "Int32": {
      return [1];
    }
    case "List": {
      return [2];
    }
  }
};

export const encodePartDefinition = (
  partDefinition: PartDefinition
): ReadonlyArray<number> =>
  encodeString(partDefinition.name)
    .concat(encodeList(encodeId)(partDefinition.parentList))
    .concat(encodeString(partDefinition.description))
    .concat(encodeType(partDefinition["type"]))
    .concat(encodeMaybe(encodeExpr)(partDefinition.expr))
    .concat(encodeId(partDefinition.moduleId));

export const encodeType = (type_: Type): ReadonlyArray<number> =>
  encodeId(type_.reference).concat(encodeList(encodeType)(type_.parameter));

export const encodeExpr = (expr: Expr): ReadonlyArray<number> => {
  switch (expr._) {
    case "Kernel": {
      return [0].concat(encodeKernelExpr(expr.kernelExpr));
    }
    case "Int32Literal": {
      return [1].concat(encodeInt32(expr.int32));
    }
    case "PartReference": {
      return [2].concat(encodeId(expr.partId));
    }
    case "LocalPartReference": {
      return [3].concat(encodeLocalPartReference(expr.localPartReference));
    }
    case "TagReference": {
      return [4].concat(encodeTagReferenceIndex(expr.tagReferenceIndex));
    }
    case "FunctionCall": {
      return [5].concat(encodeFunctionCall(expr.functionCall));
    }
    case "Lambda": {
      return [6].concat(encodeList(encodeLambdaBranch)(expr.lambdaBranchList));
    }
  }
};

export const encodeEvaluatedExpr = (
  evaluatedExpr: EvaluatedExpr
): ReadonlyArray<number> => {
  switch (evaluatedExpr._) {
    case "Kernel": {
      return [0].concat(encodeKernelExpr(evaluatedExpr.kernelExpr));
    }
    case "Int32": {
      return [1].concat(encodeInt32(evaluatedExpr.int32));
    }
    case "TagReference": {
      return [2].concat(
        encodeTagReferenceIndex(evaluatedExpr.tagReferenceIndex)
      );
    }
    case "Lambda": {
      return [3].concat(
        encodeList(encodeLambdaBranch)(evaluatedExpr.lambdaBranchList)
      );
    }
    case "KernelCall": {
      return [4].concat(encodeKernelCall(evaluatedExpr.kernelCall));
    }
  }
};

export const encodeKernelCall = (
  kernelCall: KernelCall
): ReadonlyArray<number> =>
  encodeKernelExpr(kernelCall.kernel).concat(
    encodeEvaluatedExpr(kernelCall.expr)
  );

export const encodeKernelExpr = (
  kernelExpr: KernelExpr
): ReadonlyArray<number> => {
  switch (kernelExpr) {
    case "Int32Add": {
      return [0];
    }
    case "Int32Sub": {
      return [1];
    }
    case "Int32Mul": {
      return [2];
    }
  }
};

export const encodeLocalPartReference = (
  localPartReference: LocalPartReference
): ReadonlyArray<number> =>
  encodeId(localPartReference.partId).concat(
    encodeId(localPartReference.localPartId)
  );

export const encodeTagReferenceIndex = (
  tagReferenceIndex: TagReferenceIndex
): ReadonlyArray<number> =>
  encodeId(tagReferenceIndex.typeId).concat(
    encodeInt32(tagReferenceIndex.tagIndex)
  );

export const encodeFunctionCall = (
  functionCall: FunctionCall
): ReadonlyArray<number> =>
  encodeExpr(functionCall["function"]).concat(
    encodeExpr(functionCall.parameter)
  );

export const encodeLambdaBranch = (
  lambdaBranch: LambdaBranch
): ReadonlyArray<number> =>
  encodeCondition(lambdaBranch.condition)
    .concat(encodeString(lambdaBranch.description))
    .concat(encodeList(encodeBranchPartDefinition)(lambdaBranch.localPartList))
    .concat(encodeMaybe(encodeExpr)(lambdaBranch.expr));

export const encodeCondition = (
  condition: Condition
): ReadonlyArray<number> => {
  switch (condition._) {
    case "ByTag": {
      return [0].concat(encodeConditionTag(condition.conditionTag));
    }
    case "ByCapture": {
      return [1].concat(encodeConditionCapture(condition.conditionCapture));
    }
    case "Any": {
      return [2];
    }
    case "Int32": {
      return [3].concat(encodeInt32(condition.int32));
    }
  }
};

export const encodeConditionTag = (
  conditionTag: ConditionTag
): ReadonlyArray<number> =>
  encodeId(conditionTag.tag).concat(
    encodeMaybe(encodeCondition)(conditionTag.parameter)
  );

export const encodeConditionCapture = (
  conditionCapture: ConditionCapture
): ReadonlyArray<number> =>
  encodeString(conditionCapture.name).concat(
    encodeId(conditionCapture.localPartId)
  );

export const encodeBranchPartDefinition = (
  branchPartDefinition: BranchPartDefinition
): ReadonlyArray<number> =>
  encodeId(branchPartDefinition.localPartId)
    .concat(encodeString(branchPartDefinition.name))
    .concat(encodeString(branchPartDefinition.description))
    .concat(encodeType(branchPartDefinition["type"]))
    .concat(encodeExpr(branchPartDefinition.expr));

export const encodeEvaluateExprError = (
  evaluateExprError: EvaluateExprError
): ReadonlyArray<number> => {
  switch (evaluateExprError._) {
    case "NeedPartDefinition": {
      return [0].concat(encodeId(evaluateExprError.partId));
    }
    case "PartExprIsNothing": {
      return [1].concat(encodeId(evaluateExprError.partId));
    }
    case "CannotFindLocalPartDefinition": {
      return [2].concat(
        encodeLocalPartReference(evaluateExprError.localPartReference)
      );
    }
    case "TypeError": {
      return [3].concat(encodeTypeError(evaluateExprError.typeError));
    }
    case "NotSupported": {
      return [4];
    }
  }
};

export const encodeTypeError = (typeError: TypeError): ReadonlyArray<number> =>
  encodeString(typeError.message);

export const encodeCreateProjectParameter = (
  createProjectParameter: CreateProjectParameter
): ReadonlyArray<number> =>
  encodeToken(createProjectParameter.accessToken).concat(
    encodeString(createProjectParameter.projectName)
  );

export const encodeAccessTokenError = (
  accessTokenError: AccessTokenError
): ReadonlyArray<number> => {
  switch (accessTokenError) {
    case "AccessTokenExpiredOrInvalid": {
      return [0];
    }
    case "ProjectNameIsInvalid": {
      return [1];
    }
  }
};

export const encodeProjectCache = (
  projectCache: ProjectCache
): ReadonlyArray<number> =>
  encodeProject(projectCache.project).concat(
    encodeTime(projectCache.respondTime)
  );

export const encodeUserCache = (userCache: UserCache): ReadonlyArray<number> =>
  encodeUser(userCache.user).concat(encodeTime(userCache.respondTime));

export const encodeProjectCacheWithId = (
  projectCacheWithId: ProjectCacheWithId
): ReadonlyArray<number> =>
  encodeMaybe(encodeProjectCache)(projectCacheWithId.projectCache).concat(
    encodeId(projectCacheWithId.projectId)
  );

export const encodeUserCacheWithId = (
  userCacheWithId: UserCacheWithId
): ReadonlyArray<number> =>
  encodeMaybe(encodeUserCache)(userCacheWithId.userCache).concat(
    encodeId(userCacheWithId.userId)
  );

/**
 * SignedLeb128で表現されたバイナリをnumberのビット演算ができる32bit符号付き整数の範囲の数値に変換するコード
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeInt32 = (
  index: number,
  binary: Uint8Array
): { result: number; nextIndex: number } => {
  let result = 0;
  let offset = 0;
  while (true) {
    const byte: number = binary[index + offset];
    result |= (byte & 127) << (offset * 7);
    offset += 1;
    if ((128 & byte) === 0) {
      if (offset * 7 < 32 && (byte & 64) !== 0) {
        return {
          result: result | (~0 << (offset * 7)),
          nextIndex: index + offset,
        };
      }
      return { result: result, nextIndex: index + offset };
    }
  }
};

/**
 * バイナリからstringに変換する.
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeString = (
  index: number,
  binary: Uint8Array
): { result: string; nextIndex: number } => {
  const length: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  const nextIndex: number = length.nextIndex + length.result;
  const textBinary: Uint8Array = binary.slice(length.nextIndex, nextIndex);
  const isBrowser: boolean =
    process === undefined || process.title === "browser";
  if (isBrowser) {
    return {
      result: new TextDecoder().decode(textBinary),
      nextIndex: nextIndex,
    };
  }
  return {
    result: new a.TextDecoder().decode(textBinary),
    nextIndex: nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeBool = (
  index: number,
  binary: Uint8Array
): { result: boolean; nextIndex: number } => ({
  result: binary[index] !== 0,
  nextIndex: index + 1,
});

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeBinary = (
  index: number,
  binary: Uint8Array
): { result: Uint8Array; nextIndex: number } => {
  const length: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  const nextIndex: number = length.nextIndex + length.result;
  return {
    result: binary.slice(length.nextIndex, nextIndex),
    nextIndex: nextIndex,
  };
};

export const decodeList = <T>(
  decodeFunction: (a: number, b: Uint8Array) => { result: T; nextIndex: number }
): ((
  a: number,
  b: Uint8Array
) => { result: ReadonlyArray<T>; nextIndex: number }) => (
  index: number,
  binary: Uint8Array
): { result: ReadonlyArray<T>; nextIndex: number } => {
  const lengthResult: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  index = lengthResult.nextIndex;
  const result: Array<T> = [];
  for (let i = 0; i < lengthResult.result; i += 1) {
    const resultAndNextIndex: { result: T; nextIndex: number } = decodeFunction(
      index,
      binary
    );
    result.push(resultAndNextIndex.result);
    index = resultAndNextIndex.nextIndex;
  }
  return { result: result, nextIndex: index };
};

export const decodeMaybe = <T>(
  decodeFunction: (a: number, b: Uint8Array) => { result: T; nextIndex: number }
): ((a: number, b: Uint8Array) => { result: Maybe<T>; nextIndex: number }) => (
  index: number,
  binary: Uint8Array
): { result: Maybe<T>; nextIndex: number } => {
  const patternIndexAndNextIndex: {
    result: number;
    nextIndex: number;
  } = decodeInt32(index, binary);
  if (patternIndexAndNextIndex.result === 0) {
    const valueAndNextIndex: { result: T; nextIndex: number } = decodeFunction(
      patternIndexAndNextIndex.nextIndex,
      binary
    );
    return {
      result: maybeJust(valueAndNextIndex.result),
      nextIndex: valueAndNextIndex.nextIndex,
    };
  }
  if (patternIndexAndNextIndex.result === 1) {
    return {
      result: maybeNothing(),
      nextIndex: patternIndexAndNextIndex.nextIndex,
    };
  }
  throw new Error(
    "存在しないMaybeのパターンを受け取った. 型情報を更新してください"
  );
};

export const decodeResult = <ok, error>(
  okDecodeFunction: (
    a: number,
    b: Uint8Array
  ) => { result: ok; nextIndex: number },
  errorDecodeFunction: (
    a: number,
    b: Uint8Array
  ) => { result: error; nextIndex: number }
): ((
  a: number,
  b: Uint8Array
) => { result: Result<ok, error>; nextIndex: number }) => (
  index: number,
  binary: Uint8Array
): { result: Result<ok, error>; nextIndex: number } => {
  const patternIndexAndNextIndex: {
    result: number;
    nextIndex: number;
  } = decodeInt32(index, binary);
  if (patternIndexAndNextIndex.result === 0) {
    const okAndNextIndex: { result: ok; nextIndex: number } = okDecodeFunction(
      patternIndexAndNextIndex.nextIndex,
      binary
    );
    return {
      result: resultOk(okAndNextIndex.result),
      nextIndex: okAndNextIndex.nextIndex,
    };
  }
  if (patternIndexAndNextIndex.result === 1) {
    const errorAndNextIndex: {
      result: error;
      nextIndex: number;
    } = errorDecodeFunction(patternIndexAndNextIndex.nextIndex, binary);
    return {
      result: resultError(errorAndNextIndex.result),
      nextIndex: errorAndNextIndex.nextIndex,
    };
  }
  throw new Error(
    "存在しないResultのパターンを受け取った. 型情報を更新してください"
  );
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeId = (
  index: number,
  binary: Uint8Array
): { result: string; nextIndex: number } => ({
  result: [...binary.slice(index, index + 16)]
    .map((n: number): string => n.toString(16).padStart(2, "0"))
    .join(""),
  nextIndex: index + 16,
});

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeToken = (
  index: number,
  binary: Uint8Array
): { result: string; nextIndex: number } => ({
  result: [...binary.slice(index, index + 32)]
    .map((n: number): string => n.toString(16).padStart(2, "0"))
    .join(""),
  nextIndex: index + 32,
});

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTime = (
  index: number,
  binary: Uint8Array
): { result: Time; nextIndex: number } => {
  const dayAndNextIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  const millisecondAndNextIndex: {
    result: number;
    nextIndex: number;
  } = decodeInt32(dayAndNextIndex.nextIndex, binary);
  return {
    result: {
      day: dayAndNextIndex.result,
      millisecond: millisecondAndNextIndex.result,
    },
    nextIndex: millisecondAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeClientMode = (
  index: number,
  binary: Uint8Array
): { result: ClientMode; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: { result: number; nextIndex: number } = decodeInt32(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: clientModeDebugMode(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    return { result: clientModeRelease, nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeRequestLogInUrlRequestData = (
  index: number,
  binary: Uint8Array
): { result: RequestLogInUrlRequestData; nextIndex: number } => {
  const openIdConnectProviderAndNextIndex: {
    result: OpenIdConnectProvider;
    nextIndex: number;
  } = decodeOpenIdConnectProvider(index, binary);
  const urlDataAndNextIndex: {
    result: UrlData;
    nextIndex: number;
  } = decodeUrlData(openIdConnectProviderAndNextIndex.nextIndex, binary);
  return {
    result: {
      openIdConnectProvider: openIdConnectProviderAndNextIndex.result,
      urlData: urlDataAndNextIndex.result,
    },
    nextIndex: urlDataAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeOpenIdConnectProvider = (
  index: number,
  binary: Uint8Array
): { result: OpenIdConnectProvider; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    return { result: "Google", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: "GitHub", nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeUrlData = (
  index: number,
  binary: Uint8Array
): { result: UrlData; nextIndex: number } => {
  const clientModeAndNextIndex: {
    result: ClientMode;
    nextIndex: number;
  } = decodeClientMode(index, binary);
  const locationAndNextIndex: {
    result: Location;
    nextIndex: number;
  } = decodeLocation(clientModeAndNextIndex.nextIndex, binary);
  const languageAndNextIndex: {
    result: Language;
    nextIndex: number;
  } = decodeLanguage(locationAndNextIndex.nextIndex, binary);
  const accessTokenAndNextIndex: {
    result: Maybe<AccessToken>;
    nextIndex: number;
  } = decodeMaybe(
    decodeToken as
      (a: number, b: Uint8Array) => { result: AccessToken; nextIndex: number }
  )(languageAndNextIndex.nextIndex, binary);
  return {
    result: {
      clientMode: clientModeAndNextIndex.result,
      location: locationAndNextIndex.result,
      language: languageAndNextIndex.result,
      accessToken: accessTokenAndNextIndex.result,
    },
    nextIndex: accessTokenAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeLanguage = (
  index: number,
  binary: Uint8Array
): { result: Language; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    return { result: "Japanese", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: "English", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 2) {
    return { result: "Esperanto", nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeLocation = (
  index: number,
  binary: Uint8Array
): { result: Location; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    return { result: locationHome, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: locationCreateProject, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 2) {
    const result: { result: UserId; nextIndex: number } = (
      decodeId as
      (a: number, b: Uint8Array) => { result: UserId; nextIndex: number }
    )(patternIndex.nextIndex, binary);
    return { result: locationUser(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 3) {
    const result: { result: ProjectId; nextIndex: number } = (
      decodeId as
      (a: number, b: Uint8Array) => { result: ProjectId; nextIndex: number }
    )(patternIndex.nextIndex, binary);
    return {
      result: locationProject(result.result),
      nextIndex: result.nextIndex,
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeUser = (
  index: number,
  binary: Uint8Array
): { result: User; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const imageHashAndNextIndex: { result: FileHash; nextIndex: number } = (
    decodeToken as
    (a: number, b: Uint8Array) => { result: FileHash; nextIndex: number }
  )(nameAndNextIndex.nextIndex, binary);
  const introductionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(imageHashAndNextIndex.nextIndex, binary);
  const createdAtAndNextIndex: { result: Time; nextIndex: number } = decodeTime(
    introductionAndNextIndex.nextIndex,
    binary
  );
  const likedProjectIdListAndNextIndex: {
    result: ReadonlyArray<ProjectId>;
    nextIndex: number;
  } = decodeList(
    decodeId as
      (a: number, b: Uint8Array) => { result: ProjectId; nextIndex: number }
  )(createdAtAndNextIndex.nextIndex, binary);
  const developedProjectIdListAndNextIndex: {
    result: ReadonlyArray<ProjectId>;
    nextIndex: number;
  } = decodeList(
    decodeId as
      (a: number, b: Uint8Array) => { result: ProjectId; nextIndex: number }
  )(likedProjectIdListAndNextIndex.nextIndex, binary);
  const commentedIdeaIdListAndNextIndex: {
    result: ReadonlyArray<IdeaId>;
    nextIndex: number;
  } = decodeList(
    decodeId as
      (a: number, b: Uint8Array) => { result: IdeaId; nextIndex: number }
  )(developedProjectIdListAndNextIndex.nextIndex, binary);
  return {
    result: {
      name: nameAndNextIndex.result,
      imageHash: imageHashAndNextIndex.result,
      introduction: introductionAndNextIndex.result,
      createdAt: createdAtAndNextIndex.result,
      likedProjectIdList: likedProjectIdListAndNextIndex.result,
      developedProjectIdList: developedProjectIdListAndNextIndex.result,
      commentedIdeaIdList: commentedIdeaIdListAndNextIndex.result,
    },
    nextIndex: commentedIdeaIdListAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeUserAndUserId = (
  index: number,
  binary: Uint8Array
): { result: UserAndUserId; nextIndex: number } => {
  const userIdAndNextIndex: { result: UserId; nextIndex: number } = (
    decodeId as
    (a: number, b: Uint8Array) => { result: UserId; nextIndex: number }
  )(index, binary);
  const userAndNextIndex: { result: User; nextIndex: number } = decodeUser(
    userIdAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      userId: userIdAndNextIndex.result,
      user: userAndNextIndex.result,
    },
    nextIndex: userAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeProject = (
  index: number,
  binary: Uint8Array
): { result: Project; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const iconAndNextIndex: { result: FileHash; nextIndex: number } = (
    decodeToken as
    (a: number, b: Uint8Array) => { result: FileHash; nextIndex: number }
  )(nameAndNextIndex.nextIndex, binary);
  const imageAndNextIndex: { result: FileHash; nextIndex: number } = (
    decodeToken as
    (a: number, b: Uint8Array) => { result: FileHash; nextIndex: number }
  )(iconAndNextIndex.nextIndex, binary);
  const createdAtAndNextIndex: { result: Time; nextIndex: number } = decodeTime(
    imageAndNextIndex.nextIndex,
    binary
  );
  const createdByAndNextIndex: { result: UserId; nextIndex: number } = (
    decodeId as
    (a: number, b: Uint8Array) => { result: UserId; nextIndex: number }
  )(createdAtAndNextIndex.nextIndex, binary);
  return {
    result: {
      name: nameAndNextIndex.result,
      icon: iconAndNextIndex.result,
      image: imageAndNextIndex.result,
      createdAt: createdAtAndNextIndex.result,
      createdBy: createdByAndNextIndex.result,
    },
    nextIndex: createdByAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeProjectAndProjectId = (
  index: number,
  binary: Uint8Array
): { result: ProjectAndProjectId; nextIndex: number } => {
  const projectIdAndNextIndex: { result: ProjectId; nextIndex: number } = (
    decodeId as
    (a: number, b: Uint8Array) => { result: ProjectId; nextIndex: number }
  )(index, binary);
  const projectAndNextIndex: {
    result: Project;
    nextIndex: number;
  } = decodeProject(projectIdAndNextIndex.nextIndex, binary);
  return {
    result: {
      projectId: projectIdAndNextIndex.result,
      project: projectAndNextIndex.result,
    },
    nextIndex: projectAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeIdea = (
  index: number,
  binary: Uint8Array
): { result: Idea; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const createdByAndNextIndex: { result: UserId; nextIndex: number } = (
    decodeId as
    (a: number, b: Uint8Array) => { result: UserId; nextIndex: number }
  )(nameAndNextIndex.nextIndex, binary);
  const createdAtAndNextIndex: { result: Time; nextIndex: number } = decodeTime(
    createdByAndNextIndex.nextIndex,
    binary
  );
  const projectIdAndNextIndex: { result: ProjectId; nextIndex: number } = (
    decodeId as
    (a: number, b: Uint8Array) => { result: ProjectId; nextIndex: number }
  )(createdAtAndNextIndex.nextIndex, binary);
  const itemListAndNextIndex: {
    result: ReadonlyArray<IdeaItem>;
    nextIndex: number;
  } = decodeList(decodeIdeaItem)(projectIdAndNextIndex.nextIndex, binary);
  return {
    result: {
      name: nameAndNextIndex.result,
      createdBy: createdByAndNextIndex.result,
      createdAt: createdAtAndNextIndex.result,
      projectId: projectIdAndNextIndex.result,
      itemList: itemListAndNextIndex.result,
    },
    nextIndex: itemListAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeIdeaItem = (
  index: number,
  binary: Uint8Array
): { result: IdeaItem; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: { result: Comment; nextIndex: number } = decodeComment(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: ideaItemComment(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: { result: Suggestion; nextIndex: number } = decodeSuggestion(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: ideaItemSuggestion(result.result),
      nextIndex: result.nextIndex,
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeComment = (
  index: number,
  binary: Uint8Array
): { result: Comment; nextIndex: number } => {
  const bodyAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const createdByAndNextIndex: { result: UserId; nextIndex: number } = (
    decodeId as
    (a: number, b: Uint8Array) => { result: UserId; nextIndex: number }
  )(bodyAndNextIndex.nextIndex, binary);
  const createdAtAndNextIndex: { result: Time; nextIndex: number } = decodeTime(
    createdByAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      body: bodyAndNextIndex.result,
      createdBy: createdByAndNextIndex.result,
      createdAt: createdAtAndNextIndex.result,
    },
    nextIndex: createdAtAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeSuggestion = (
  index: number,
  binary: Uint8Array
): { result: Suggestion; nextIndex: number } => {
  const createdAtAndNextIndex: { result: Time; nextIndex: number } = decodeTime(
    index,
    binary
  );
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(createdAtAndNextIndex.nextIndex, binary);
  const changeAndNextIndex: {
    result: Change;
    nextIndex: number;
  } = decodeChange(descriptionAndNextIndex.nextIndex, binary);
  return {
    result: {
      createdAt: createdAtAndNextIndex.result,
      description: descriptionAndNextIndex.result,
      change: changeAndNextIndex.result,
    },
    nextIndex: changeAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeChange = (
  index: number,
  binary: Uint8Array
): { result: Change; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: { result: string; nextIndex: number } = decodeString(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: changeProjectName(result.result),
      nextIndex: result.nextIndex,
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeModule = (
  index: number,
  binary: Uint8Array
): { result: Module; nextIndex: number } => {
  const nameAndNextIndex: {
    result: ReadonlyArray<string>;
    nextIndex: number;
  } = decodeList(decodeString)(index, binary);
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(nameAndNextIndex.nextIndex, binary);
  const exportAndNextIndex: { result: boolean; nextIndex: number } = decodeBool(
    descriptionAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      name: nameAndNextIndex.result,
      description: descriptionAndNextIndex.result,
      export: exportAndNextIndex.result,
    },
    nextIndex: exportAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTypeDefinition = (
  index: number,
  binary: Uint8Array
): { result: TypeDefinition; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const parentListAndNextIndex: {
    result: ReadonlyArray<PartId>;
    nextIndex: number;
  } = decodeList(
    decodeId as
      (a: number, b: Uint8Array) => { result: PartId; nextIndex: number }
  )(nameAndNextIndex.nextIndex, binary);
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(parentListAndNextIndex.nextIndex, binary);
  return {
    result: {
      name: nameAndNextIndex.result,
      parentList: parentListAndNextIndex.result,
      description: descriptionAndNextIndex.result,
    },
    nextIndex: descriptionAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTypeBody = (
  index: number,
  binary: Uint8Array
): { result: TypeBody; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: {
      result: ReadonlyArray<TypeBodyProductMember>;
      nextIndex: number;
    } = decodeList(decodeTypeBodyProductMember)(patternIndex.nextIndex, binary);
    return {
      result: typeBodyProduct(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: {
      result: ReadonlyArray<TypeBodySumPattern>;
      nextIndex: number;
    } = decodeList(decodeTypeBodySumPattern)(patternIndex.nextIndex, binary);
    return { result: typeBodySum(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 2) {
    const result: {
      result: TypeBodyKernel;
      nextIndex: number;
    } = decodeTypeBodyKernel(patternIndex.nextIndex, binary);
    return {
      result: typeBodyKernel(result.result),
      nextIndex: result.nextIndex,
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTypeBodyProductMember = (
  index: number,
  binary: Uint8Array
): { result: TypeBodyProductMember; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(nameAndNextIndex.nextIndex, binary);
  const memberTypeAndNextIndex: { result: TypeId; nextIndex: number } = (
    decodeId as
    (a: number, b: Uint8Array) => { result: TypeId; nextIndex: number }
  )(descriptionAndNextIndex.nextIndex, binary);
  return {
    result: {
      name: nameAndNextIndex.result,
      description: descriptionAndNextIndex.result,
      memberType: memberTypeAndNextIndex.result,
    },
    nextIndex: memberTypeAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTypeBodySumPattern = (
  index: number,
  binary: Uint8Array
): { result: TypeBodySumPattern; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(nameAndNextIndex.nextIndex, binary);
  const parameterAndNextIndex: {
    result: Maybe<TypeId>;
    nextIndex: number;
  } = decodeMaybe(
    decodeId as
      (a: number, b: Uint8Array) => { result: TypeId; nextIndex: number }
  )(descriptionAndNextIndex.nextIndex, binary);
  return {
    result: {
      name: nameAndNextIndex.result,
      description: descriptionAndNextIndex.result,
      parameter: parameterAndNextIndex.result,
    },
    nextIndex: parameterAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTypeBodyKernel = (
  index: number,
  binary: Uint8Array
): { result: TypeBodyKernel; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    return { result: "Function", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: "Int32", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 2) {
    return { result: "List", nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodePartDefinition = (
  index: number,
  binary: Uint8Array
): { result: PartDefinition; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const parentListAndNextIndex: {
    result: ReadonlyArray<PartId>;
    nextIndex: number;
  } = decodeList(
    decodeId as
      (a: number, b: Uint8Array) => { result: PartId; nextIndex: number }
  )(nameAndNextIndex.nextIndex, binary);
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(parentListAndNextIndex.nextIndex, binary);
  const typeAndNextIndex: { result: Type; nextIndex: number } = decodeType(
    descriptionAndNextIndex.nextIndex,
    binary
  );
  const exprAndNextIndex: {
    result: Maybe<Expr>;
    nextIndex: number;
  } = decodeMaybe(decodeExpr)(typeAndNextIndex.nextIndex, binary);
  const moduleIdAndNextIndex: { result: ModuleId; nextIndex: number } = (
    decodeId as
    (a: number, b: Uint8Array) => { result: ModuleId; nextIndex: number }
  )(exprAndNextIndex.nextIndex, binary);
  return {
    result: {
      name: nameAndNextIndex.result,
      parentList: parentListAndNextIndex.result,
      description: descriptionAndNextIndex.result,
      type: typeAndNextIndex.result,
      expr: exprAndNextIndex.result,
      moduleId: moduleIdAndNextIndex.result,
    },
    nextIndex: moduleIdAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeType = (
  index: number,
  binary: Uint8Array
): { result: Type; nextIndex: number } => {
  const referenceAndNextIndex: { result: TypeId; nextIndex: number } = (
    decodeId as
    (a: number, b: Uint8Array) => { result: TypeId; nextIndex: number }
  )(index, binary);
  const parameterAndNextIndex: {
    result: ReadonlyArray<Type>;
    nextIndex: number;
  } = decodeList(decodeType)(referenceAndNextIndex.nextIndex, binary);
  return {
    result: {
      reference: referenceAndNextIndex.result,
      parameter: parameterAndNextIndex.result,
    },
    nextIndex: parameterAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeExpr = (
  index: number,
  binary: Uint8Array
): { result: Expr; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: { result: KernelExpr; nextIndex: number } = decodeKernelExpr(
      patternIndex.nextIndex,
      binary
    );
    return { result: exprKernel(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 1) {
    const result: { result: number; nextIndex: number } = decodeInt32(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: exprInt32Literal(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 2) {
    const result: { result: PartId; nextIndex: number } = (
      decodeId as
      (a: number, b: Uint8Array) => { result: PartId; nextIndex: number }
    )(patternIndex.nextIndex, binary);
    return {
      result: exprPartReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 3) {
    const result: {
      result: LocalPartReference;
      nextIndex: number;
    } = decodeLocalPartReference(patternIndex.nextIndex, binary);
    return {
      result: exprLocalPartReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 4) {
    const result: {
      result: TagReferenceIndex;
      nextIndex: number;
    } = decodeTagReferenceIndex(patternIndex.nextIndex, binary);
    return {
      result: exprTagReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 5) {
    const result: {
      result: FunctionCall;
      nextIndex: number;
    } = decodeFunctionCall(patternIndex.nextIndex, binary);
    return {
      result: exprFunctionCall(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 6) {
    const result: {
      result: ReadonlyArray<LambdaBranch>;
      nextIndex: number;
    } = decodeList(decodeLambdaBranch)(patternIndex.nextIndex, binary);
    return { result: exprLambda(result.result), nextIndex: result.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeEvaluatedExpr = (
  index: number,
  binary: Uint8Array
): { result: EvaluatedExpr; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: { result: KernelExpr; nextIndex: number } = decodeKernelExpr(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: evaluatedExprKernel(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: { result: number; nextIndex: number } = decodeInt32(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: evaluatedExprInt32(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 2) {
    const result: {
      result: TagReferenceIndex;
      nextIndex: number;
    } = decodeTagReferenceIndex(patternIndex.nextIndex, binary);
    return {
      result: evaluatedExprTagReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 3) {
    const result: {
      result: ReadonlyArray<LambdaBranch>;
      nextIndex: number;
    } = decodeList(decodeLambdaBranch)(patternIndex.nextIndex, binary);
    return {
      result: evaluatedExprLambda(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 4) {
    const result: { result: KernelCall; nextIndex: number } = decodeKernelCall(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: evaluatedExprKernelCall(result.result),
      nextIndex: result.nextIndex,
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeKernelCall = (
  index: number,
  binary: Uint8Array
): { result: KernelCall; nextIndex: number } => {
  const kernelAndNextIndex: {
    result: KernelExpr;
    nextIndex: number;
  } = decodeKernelExpr(index, binary);
  const exprAndNextIndex: {
    result: EvaluatedExpr;
    nextIndex: number;
  } = decodeEvaluatedExpr(kernelAndNextIndex.nextIndex, binary);
  return {
    result: {
      kernel: kernelAndNextIndex.result,
      expr: exprAndNextIndex.result,
    },
    nextIndex: exprAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeKernelExpr = (
  index: number,
  binary: Uint8Array
): { result: KernelExpr; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    return { result: "Int32Add", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: "Int32Sub", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 2) {
    return { result: "Int32Mul", nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeLocalPartReference = (
  index: number,
  binary: Uint8Array
): { result: LocalPartReference; nextIndex: number } => {
  const partIdAndNextIndex: { result: PartId; nextIndex: number } = (
    decodeId as
    (a: number, b: Uint8Array) => { result: PartId; nextIndex: number }
  )(index, binary);
  const localPartIdAndNextIndex: { result: LocalPartId; nextIndex: number } = (
    decodeId as
    (a: number, b: Uint8Array) => { result: LocalPartId; nextIndex: number }
  )(partIdAndNextIndex.nextIndex, binary);
  return {
    result: {
      partId: partIdAndNextIndex.result,
      localPartId: localPartIdAndNextIndex.result,
    },
    nextIndex: localPartIdAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTagReferenceIndex = (
  index: number,
  binary: Uint8Array
): { result: TagReferenceIndex; nextIndex: number } => {
  const typeIdAndNextIndex: { result: TypeId; nextIndex: number } = (
    decodeId as
    (a: number, b: Uint8Array) => { result: TypeId; nextIndex: number }
  )(index, binary);
  const tagIndexAndNextIndex: {
    result: number;
    nextIndex: number;
  } = decodeInt32(typeIdAndNextIndex.nextIndex, binary);
  return {
    result: {
      typeId: typeIdAndNextIndex.result,
      tagIndex: tagIndexAndNextIndex.result,
    },
    nextIndex: tagIndexAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeFunctionCall = (
  index: number,
  binary: Uint8Array
): { result: FunctionCall; nextIndex: number } => {
  const functionAndNextIndex: { result: Expr; nextIndex: number } = decodeExpr(
    index,
    binary
  );
  const parameterAndNextIndex: { result: Expr; nextIndex: number } = decodeExpr(
    functionAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      function: functionAndNextIndex.result,
      parameter: parameterAndNextIndex.result,
    },
    nextIndex: parameterAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeLambdaBranch = (
  index: number,
  binary: Uint8Array
): { result: LambdaBranch; nextIndex: number } => {
  const conditionAndNextIndex: {
    result: Condition;
    nextIndex: number;
  } = decodeCondition(index, binary);
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(conditionAndNextIndex.nextIndex, binary);
  const localPartListAndNextIndex: {
    result: ReadonlyArray<BranchPartDefinition>;
    nextIndex: number;
  } = decodeList(decodeBranchPartDefinition)(
    descriptionAndNextIndex.nextIndex,
    binary
  );
  const exprAndNextIndex: {
    result: Maybe<Expr>;
    nextIndex: number;
  } = decodeMaybe(decodeExpr)(localPartListAndNextIndex.nextIndex, binary);
  return {
    result: {
      condition: conditionAndNextIndex.result,
      description: descriptionAndNextIndex.result,
      localPartList: localPartListAndNextIndex.result,
      expr: exprAndNextIndex.result,
    },
    nextIndex: exprAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeCondition = (
  index: number,
  binary: Uint8Array
): { result: Condition; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: {
      result: ConditionTag;
      nextIndex: number;
    } = decodeConditionTag(patternIndex.nextIndex, binary);
    return {
      result: conditionByTag(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: {
      result: ConditionCapture;
      nextIndex: number;
    } = decodeConditionCapture(patternIndex.nextIndex, binary);
    return {
      result: conditionByCapture(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 2) {
    return { result: conditionAny, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 3) {
    const result: { result: number; nextIndex: number } = decodeInt32(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: conditionInt32(result.result),
      nextIndex: result.nextIndex,
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeConditionTag = (
  index: number,
  binary: Uint8Array
): { result: ConditionTag; nextIndex: number } => {
  const tagAndNextIndex: { result: TagId; nextIndex: number } = (
    decodeId as
    (a: number, b: Uint8Array) => { result: TagId; nextIndex: number }
  )(index, binary);
  const parameterAndNextIndex: {
    result: Maybe<Condition>;
    nextIndex: number;
  } = decodeMaybe(decodeCondition)(tagAndNextIndex.nextIndex, binary);
  return {
    result: {
      tag: tagAndNextIndex.result,
      parameter: parameterAndNextIndex.result,
    },
    nextIndex: parameterAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeConditionCapture = (
  index: number,
  binary: Uint8Array
): { result: ConditionCapture; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const localPartIdAndNextIndex: { result: LocalPartId; nextIndex: number } = (
    decodeId as
    (a: number, b: Uint8Array) => { result: LocalPartId; nextIndex: number }
  )(nameAndNextIndex.nextIndex, binary);
  return {
    result: {
      name: nameAndNextIndex.result,
      localPartId: localPartIdAndNextIndex.result,
    },
    nextIndex: localPartIdAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeBranchPartDefinition = (
  index: number,
  binary: Uint8Array
): { result: BranchPartDefinition; nextIndex: number } => {
  const localPartIdAndNextIndex: { result: LocalPartId; nextIndex: number } = (
    decodeId as
    (a: number, b: Uint8Array) => { result: LocalPartId; nextIndex: number }
  )(index, binary);
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    localPartIdAndNextIndex.nextIndex,
    binary
  );
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(nameAndNextIndex.nextIndex, binary);
  const typeAndNextIndex: { result: Type; nextIndex: number } = decodeType(
    descriptionAndNextIndex.nextIndex,
    binary
  );
  const exprAndNextIndex: { result: Expr; nextIndex: number } = decodeExpr(
    typeAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      localPartId: localPartIdAndNextIndex.result,
      name: nameAndNextIndex.result,
      description: descriptionAndNextIndex.result,
      type: typeAndNextIndex.result,
      expr: exprAndNextIndex.result,
    },
    nextIndex: exprAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeEvaluateExprError = (
  index: number,
  binary: Uint8Array
): { result: EvaluateExprError; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: { result: PartId; nextIndex: number } = (
      decodeId as
      (a: number, b: Uint8Array) => { result: PartId; nextIndex: number }
    )(patternIndex.nextIndex, binary);
    return {
      result: evaluateExprErrorNeedPartDefinition(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: { result: PartId; nextIndex: number } = (
      decodeId as
      (a: number, b: Uint8Array) => { result: PartId; nextIndex: number }
    )(patternIndex.nextIndex, binary);
    return {
      result: evaluateExprErrorPartExprIsNothing(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 2) {
    const result: {
      result: LocalPartReference;
      nextIndex: number;
    } = decodeLocalPartReference(patternIndex.nextIndex, binary);
    return {
      result: evaluateExprErrorCannotFindLocalPartDefinition(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 3) {
    const result: { result: TypeError; nextIndex: number } = decodeTypeError(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: evaluateExprErrorTypeError(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 4) {
    return {
      result: evaluateExprErrorNotSupported,
      nextIndex: patternIndex.nextIndex,
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTypeError = (
  index: number,
  binary: Uint8Array
): { result: TypeError; nextIndex: number } => {
  const messageAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(index, binary);
  return {
    result: { message: messageAndNextIndex.result },
    nextIndex: messageAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeCreateProjectParameter = (
  index: number,
  binary: Uint8Array
): { result: CreateProjectParameter; nextIndex: number } => {
  const accessTokenAndNextIndex: { result: AccessToken; nextIndex: number } = (
    decodeToken as
    (a: number, b: Uint8Array) => { result: AccessToken; nextIndex: number }
  )(index, binary);
  const projectNameAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(accessTokenAndNextIndex.nextIndex, binary);
  return {
    result: {
      accessToken: accessTokenAndNextIndex.result,
      projectName: projectNameAndNextIndex.result,
    },
    nextIndex: projectNameAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeAccessTokenError = (
  index: number,
  binary: Uint8Array
): { result: AccessTokenError; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    return {
      result: "AccessTokenExpiredOrInvalid",
      nextIndex: patternIndex.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    return {
      result: "ProjectNameIsInvalid",
      nextIndex: patternIndex.nextIndex,
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeProjectCache = (
  index: number,
  binary: Uint8Array
): { result: ProjectCache; nextIndex: number } => {
  const projectAndNextIndex: {
    result: Project;
    nextIndex: number;
  } = decodeProject(index, binary);
  const respondTimeAndNextIndex: {
    result: Time;
    nextIndex: number;
  } = decodeTime(projectAndNextIndex.nextIndex, binary);
  return {
    result: {
      project: projectAndNextIndex.result,
      respondTime: respondTimeAndNextIndex.result,
    },
    nextIndex: respondTimeAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeUserCache = (
  index: number,
  binary: Uint8Array
): { result: UserCache; nextIndex: number } => {
  const userAndNextIndex: { result: User; nextIndex: number } = decodeUser(
    index,
    binary
  );
  const respondTimeAndNextIndex: {
    result: Time;
    nextIndex: number;
  } = decodeTime(userAndNextIndex.nextIndex, binary);
  return {
    result: {
      user: userAndNextIndex.result,
      respondTime: respondTimeAndNextIndex.result,
    },
    nextIndex: respondTimeAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeProjectCacheWithId = (
  index: number,
  binary: Uint8Array
): { result: ProjectCacheWithId; nextIndex: number } => {
  const projectCacheAndNextIndex: {
    result: Maybe<ProjectCache>;
    nextIndex: number;
  } = decodeMaybe(decodeProjectCache)(index, binary);
  const projectIdAndNextIndex: { result: ProjectId; nextIndex: number } = (
    decodeId as
    (a: number, b: Uint8Array) => { result: ProjectId; nextIndex: number }
  )(projectCacheAndNextIndex.nextIndex, binary);
  return {
    result: {
      projectCache: projectCacheAndNextIndex.result,
      projectId: projectIdAndNextIndex.result,
    },
    nextIndex: projectIdAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeUserCacheWithId = (
  index: number,
  binary: Uint8Array
): { result: UserCacheWithId; nextIndex: number } => {
  const userCacheAndNextIndex: {
    result: Maybe<UserCache>;
    nextIndex: number;
  } = decodeMaybe(decodeUserCache)(index, binary);
  const userIdAndNextIndex: { result: UserId; nextIndex: number } = (
    decodeId as
    (a: number, b: Uint8Array) => { result: UserId; nextIndex: number }
  )(userCacheAndNextIndex.nextIndex, binary);
  return {
    result: {
      userCache: userCacheAndNextIndex.result,
      userId: userIdAndNextIndex.result,
    },
    nextIndex: userIdAndNextIndex.nextIndex,
  };
};
