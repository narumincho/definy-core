import * as firestore from "@firebase/firestore-types";

export type Firestore = {
  user: { doc: User; col: {} };
  accessToken: { doc: AccessTokenData; col: {} };
  project: { doc: Project; col: {} };
  googleState: { doc: State; col: {} };
  gitHubState: { doc: State; col: {} };
  lineState: { doc: State; col: {} };
  branch: { doc: Branch; col: {} };
  commit: { doc: Commit; col: {} };
  moduleSnapshot: { doc: ModuleSnapshot; col: {} };
  partDefSnapshot: { doc: PartDefSnapshot; col: {} };
  typeDefSnapshot: { doc: TypeDefSnapshot; col: {} };
};

export type UserId = string & { _userId: never };
/**
 *  画像のハッシュ値。
 *  gs://definy-lang.appspot.com/ハッシュ値
 *  に保存してある
 */
export type ImageHash = string & { _imageHash: never };

/**
 * アクセストークン。個人的なデータにアクセスするための鍵。
 * getLogInUrlで取得したログインURLのページからリダイレクトするときのクエリパラメータについてくる。
 * 使う文字は0123456789abcdef。長さは48文字
 * functions内で生成してブラウザのindexed DBに保存する
 */
export type AccessToken = string & { _accessToken: never };
/**
 * アクセストークンのハッシュ値。
 * firestoreに保存して、functions内でブラウザから送られてきたアクセストークンのハッシュ値を求めて比較して秘密のリソースをブラウザに渡す
 */
export type AccessTokenHash = string & { _accessTokenHash: never };

export type ProjectId = string & { _projectId: never };

export type BranchId = string & { _accessTokenHash: never };

/**
 * Definyでよく使う識別子 最初の1文字はアルファベット、それ以降は数字と大文字アルファベット、小文字のアルファベット。1文字以上63文字以下
 */
export type Label = string & { __simpleNameBrand: never };

export type CommitHash = string & { __commitObjectHashBrand: never };

export type LogInServiceAndId = {
  service: SocialLoginService;
  accountId: string;
};

export type SocialLoginService = "google" | "gitHub" | "line";

export type User = {
  /** ユーザー名
   * 表示される名前。他のユーザーとかぶっても良い。絵文字も使える
   * 全角英数は半角英数、半角カタカナは全角カタカナ、(株)の合字を分解するなどのNFKCの正規化がされる
   * U+0000-U+0019 と U+007F-U+00A0 の範囲の文字は入らない
   * 前後に空白を含められない
   * 間の空白は2文字以上連続しない
   * 文字数のカウント方法は正規化されたあとのCodePoint単位
   * Twitterと同じ、1文字以上50文字以下
   */
  readonly name: string;
  /**
   * プロフィール画像
   */
  readonly imageHash: ImageHash;
  /**
   * 自己紹介文。改行文字を含めることができる。
   *
   * Twitterと同じ 0～160文字
   */
  readonly introduction: string;
  /** 所有者になっているブランチ */
  readonly branchIds: ReadonlyArray<BranchId>;
  /** ユーザーが作成された日時 */
  readonly createdAt: firestore.Timestamp;
  /** プロジェクトに対する いいね */
  readonly likedProjectIds: ReadonlyArray<ProjectId>;
};

/**
 * 他のユーザーから読めない、ユーザーの隠された情報
 */
export type UserSecret = {
  /** 他のユーザーから見られたくない、個人的なプロジェクトに対する いいね */
  readonly bookmarkedProjectIds: ReadonlyArray<ProjectId>;
  /** 最後にログインしたアクセストークンのハッシュ値 */
  readonly lastAccessTokenHash: AccessTokenHash;
  /** ユーザーのログイン */
  readonly logInServiceAndId: LogInServiceAndId;
};

export type AccessTokenData = {
  readonly userId: UserId;
  readonly issuedAt: firestore.Timestamp;
};

/**
 *
 */
export type Project = {
  /** マスターブランチ、型チェックが通ったもののみコミットできる */
  readonly masterBranch: BranchId;
  /** プロジェクトが持つブランチ */
  readonly branches: ReadonlyArray<BranchId>;
  /** 安定版としてリソースされたコミット */
  readonly statableReleasedCommitHashes: ReadonlyArray<CommitHash>;
  /** ベータ版としてリソースされたコミット */
  readonly betaReleasedCommitHashes: ReadonlyArray<CommitHash>;
};

/**
 * OpenId ConnectのState
 * リプレイアタックを防いだり、他のサーバーがDefinyのクライアントIDを使って発行してもDefinyのサーバーが発行したものと見比べて、Definyのサーバーが発行したものだけを有効にするために必要
 */
export type State = {
  readonly createdAt: firestore.Timestamp;
};

/**
 * ブランチ。コミットの流れをまとめたもの
 */
export type Branch = {
  /**
   * ブランチの名前
   */
  readonly name: Label;
  /**
   * ブランチが所属しているプロジェクト (変わらない)
   */
  readonly projectId: ProjectId;
  /**
   * ブランチの説明
   */
  readonly description: string;
  /**
   * ブランチの最新のコミット
   */
  readonly headHash: CommitHash;
  /**
   * ブランチ所有者 (変わらない)
   */
  readonly ownerId: UserId;
};

/**
 * プロジェクトのデータのスナップショット。このデータは一度作ったら変えない
 */
export type Commit = {
  /**
   * 前のコミットのコミット
   */
  readonly parentCommitHashes: ReadonlyArray<CommitHash>;
  /**
   * 作られていたときに所属していたブランチ
   */
  readonly branchId: BranchId;
  /**
   * 作成日時
   */
  readonly date: firestore.Timestamp;
  /**
   * どんな変更をしたのかの説明
   */
  readonly commitDescription: string;
  /**
   * プロジェクト名
   */
  readonly projectName: string;
  /**
   * プロジェクトのアイコン画像
   */
  readonly projectIconHash: ImageHash | null;
  /**
   * プロジェクトのカバー画像
   */
  readonly projectImageHash: ImageHash | null;
  /**
   * プロジェクトの簡潔な説明 キャッチコピー
   */
  readonly projectSummary: string;
  /**
   * プロジェクトの詳しい説明
   */
  readonly projectDescription: string;
  /**
   *
   */
  readonly children: ReadonlyArray<{
    readonly id: ModuleId;
    readonly hash: ModuleSnapshotHash;
  }>;
  readonly typeDefs: ReadonlyArray<{
    readonly id: TypeId;
    readonly hash: TypeDefSnapshotHash;
  }>;
  readonly partDefs: ReadonlyArray<{
    readonly id: PartId;
    readonly hash: PartDefSnapshotHash;
  }>;
  readonly dependencies: ReadonlyArray<{
    readonly projectId: ProjectId;
    readonly commitHash: CommitHash;
  }>;
};

/** 0～fで64文字 256bit SHA-256のハッシュ値 */
export type ModuleSnapshotHash = string & { __moduleObjectHashBrand: never };

export type ModuleSnapshot = {
  hash: ModuleSnapshotHash;
  name: Label;
  children: ReadonlyArray<{
    id: ModuleId;
    snapshot: ModuleSnapshot;
  }>;
  typeDefs: ReadonlyArray<{
    id: TypeId;
    snapshot: TypeDefSnapshot;
  }>;
  partDefs: ReadonlyArray<{
    id: PartId;
    snapshot: PartDefSnapshot;
  }>;
  description: string;
  exposing: boolean;
};

export type ModuleId = string & { __moduleIdBrand: never };

export type TypeId = string & { __typeIdBrand: never };

export type TypeDefSnapshot = {
  hash: TypeDefSnapshotHash;
  name: Label;
  description: string;
  body: TypeBody;
};

/** 0～fで64文字 256bit SHA-256のハッシュ値 */
export type TypeDefSnapshotHash = string & { __typeDefObjectBrand: never };

export type TypeBody = TypeBodyTags | TypeBodyKernel;

export type TypeBodyTags = {
  type: "tag";
  tags: ReadonlyArray<TypeBodyTag>;
};

export type TypeBodyTag = {
  name: Label;
  description: string;
  parameter: ReadonlyArray<TypeTermOrParenthesis>;
};

export type TypeBodyKernel = {
  type: "kernel";
  kernelType: KernelType;
};

export type KernelType = "float64" | "string-uft16" | "array" | "function";

export type TypeTermOrParenthesis =
  | TypeTermParenthesisStart
  | TypeTermParenthesisEnd
  | TypeTermRef;

export type TypeTermParenthesisStart = {
  type: "(";
};

export type TypeTermParenthesisEnd = {
  type: ")";
};

export type TypeTermRef = { type: "ref"; typeId: TypeId };

export type PartDefSnapshot = {
  hash: PartDefSnapshotHash;
  name: Label;
  description: string;
  type: ReadonlyArray<TypeTermOrParenthesis>;
  expr: {
    /**
     * 値を表すハッシュ値
     */
    hash: ExprSnapshotHash;
    /**
     * ExprBody のJSONデータ
     */
    body: string;
  };
};

/** 0～fで64文字 256bit SHA-256のハッシュ値 */
export type PartDefSnapshotHash = string & { __partDefObjectBrand: never };

export type PartId = string & { __partIdBrand: never };

/** 0～fで64文字 256bit SHA-256のハッシュ値 */
export type ExprSnapshotHash = string & { __exprObjectHashBrand: never };

export type ExprBody = Array<TermOrParenthesis>;

export type TermOrParenthesis =
  | TermParenthesisStart
  | TermParenthesisEnd
  | TermNumber
  | TermPartRef
  | TermKernel;

/** 式の開きカッコ */
export type TermParenthesisStart = "(";
/** 式の閉じカッコ */
export type TermParenthesisEnd = ")";
/** float64 数値 */
export type TermNumber = { type: "number"; value: number };
/** パーツのID */
export type TermPartRef = { type: "part"; partId: PartId };
export type TermKernel = { type: "kernel"; value: KernelTerm };

export type KernelTerm = "add" | "sub" | "mul" | "div";
