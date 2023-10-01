declare type ActionError = Record<string, string[]>;
declare type Either<T1, T2> =
  | (T1 & { [key in keyof T2]?: never })
  | (T2 & { [key in keyof T1]?: never });

declare namespace NodeJS {
  interface ProcessEnv {
    API_BASE_URL?: string;
    COOKIE_SECRET?: string;
  }
}
