import { problemDetailsSchema } from '@lib/schemas/problem-details.server';
import { ResultAsync, errAsync, fromPromise, ok } from 'neverthrow';

interface ApiClientOptions {
  baseUrl: string;
  version: string;
}

function trim(input: string, char: string) {
  let start = 0;
  let end = input.length;
  while (input[start] === char) ++start;
  while (input[--end] === char);
  if (end < start) end = start - 1;
  return input.substring(start, end + 1);
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: Record<number | string, any> | any[] | FormData | Buffer;
}

export interface ApiResponse extends Response {}

export class ApiError extends Error {
  private constructor(
    private readonly details_: Zod.infer<typeof problemDetailsSchema>
  ) {
    super();
  }

  public get details() {
    return this.details_;
  }

  public static async from(details: unknown) {
    const data = await problemDetailsSchema.parseAsync(details);
    return new ApiError(data);
  }
}

export class ApiClient {
  private static _instance: ApiClient | undefined = undefined;
  protected static _options: ApiClientOptions | undefined = undefined;

  protected constructor(private readonly _options: ApiClientOptions) {}

  public static get instance() {
    if (!ApiClient._instance) {
      if (!ApiClient._options) {
        throw new ReferenceError(
          'Failed to initialize ApiClient. An option must be provided using `ApiClient.use(options)` first'
        );
      }
      ApiClient._instance = new ApiClient(ApiClient._options);
    }
    return ApiClient._instance;
  }

  public static use(options: ApiClientOptions) {
    ApiClient._options = options;
  }

  protected fetch(
    input: string | URL,
    options?: RequestOptions
  ): ResultAsync<ApiResponse, Error> {
    const url = typeof input === 'string' ? input : input.pathname;
    return fromPromise(
      fetch(
        this._options.baseUrl +
          '/' +
          trim(url, '/').split('/').join('/') +
          '/' +
          this._options.version,
        options
          ? {
              ...options,
              body:
                options?.body instanceof FormData ||
                options?.body instanceof Buffer
                  ? options.body
                  : JSON.stringify(options?.body),
            }
          : undefined
      ),
      (e) =>
        e instanceof Error ? e : new Error('Unexpected error', { cause: e })
    ).andThen((x) =>
      x.ok
        ? ok(x)
        : errAsync(x.json()).mapErr(async (x) => ApiError.from(await x))
    );
  }

  public post(input: string | URL, options?: RequestOptions) {
    return this.fetch(input, {
      ...options,
      method: 'POST',
    });
  }
}
