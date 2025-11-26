/**
 * A TypeScript implementation inspired by Python's `yarl` library.
 * This class provides an immutable, fluent interface for URL manipulation.
 */

export type QueryValue = string | number | boolean | null | undefined;
export type QueryInput = Record<string, QueryValue | QueryValue[]> | URLSearchParams;

export class Url {
  private readonly _url: globalThis.URL;

  /**
   * Creates a new immutable Url instance.
   * @param url - A string, existing Url instance, or native URL object.
   * @param base - Optional base URL if the first argument is a relative path.
   */
  constructor(url: string | Url | globalThis.URL = "", base?: string | Url | globalThis.URL) {
    try {
      const baseString = base instanceof Url ? base.toString() : base?.toString();

      this._url = baseString ? new globalThis.URL(url.toString(), baseString) : new globalThis.URL(url.toString());
    } catch {
      // Fallback for relative URLs without base (mimicking yarl's ability to hold partials,
      // though native URL requires absolute. We use a dummy base internally for parsing
      // if strictly necessary, or rethrow if invalid).
      // For strict yarl compatibility regarding relative URLs, we would need a custom parser.
      // Here we assume standard URL behavior: strictly absolute or relative-to-base.
      throw new Error(`Invalid URL: ${url} ${base ? `(base: ${base})` : ""}`);
    }
  }

  /**
   * Internal helper to return a new instance with a mutation applied to the underlying URL.
   * This ensures immutability.
   */
  private cloneWith(mutator: (u: globalThis.URL) => void): Url {
    const newUrl = new globalThis.URL(this._url.toString());
    mutator(newUrl);
    return new Url(newUrl);
  }

  // ==========================================
  // Properties (Getters)
  // ==========================================

  /** Returns the full URL string. */
  toString(): string {
    return this._url.href;
  }

  /** Returns the full URL string. */
  get href(): string {
    return this._url.href;
  }

  /** Returns the underlying URL value. */
  get rawUrl(): globalThis.URL {
    return this._url;
  }

  /** Returns the scheme (protocol) without the colon (e.g., 'http'). */
  get scheme(): string {
    return this._url.protocol.replace(":", "");
  }

  /** Returns the user part of credentials. */
  get user(): string | null {
    return this._url.username || null;
  }

  /** Returns the password part of credentials. */
  get password(): string | null {
    return this._url.password || null;
  }

  /** Returns the host (hostname). */
  get host(): string {
    return this._url.hostname;
  }

  /** Returns the port as a number, or null if not present. */
  get port(): number | null {
    return this._url.port ? parseInt(this._url.port, 10) : null;
  }

  /** Returns the path (pathname). */
  get path(): string {
    return this._url.pathname;
  }

  /** Returns the origin. */
  get origin(): string {
    return this._url.origin;
  }

  /** Returns the decoded path string (yarl: human_repr for path). */
  get decodedPath(): string {
    return decodeURIComponent(this._url.pathname);
  }

  /** Returns the query parameters as a simplified object. */
  get query(): Record<string, string | string[]> {
    const q: Record<string, string | string[]> = {};
    this._url.searchParams.forEach((value, key) => {
      if (key in q) {
        if (Array.isArray(q[key])) {
          (q[key] as string[]).push(value);
        } else {
          q[key] = [q[key] as string, value];
        }
      } else {
        q[key] = value;
      }
    });
    return q;
  }

  /** Returns the URLSearchParams object for advanced manipulation. */
  get searchParams(): URLSearchParams {
    return this._url.searchParams;
  }

  /** Returns the query string (e.g., 'a=1&b=2'). */
  get queryString(): string {
    return this._url.search.slice(1);
  }

  /** Returns the fragment (hash) without the #. */
  get fragment(): string {
    return this._url.hash.slice(1);
  }

  /** Returns true if the URL is secure (https or wss). */
  get isSecure(): boolean {
    return this.scheme === "https" || this.scheme === "wss";
  }

  /** Returns true if the URL is absolute (has host and scheme). */
  get isAbsolute(): boolean {
    return !!this.host && !!this.scheme;
  }

  // ==========================================
  // Path Helpers
  // ==========================================

  /** Returns the last segment of the path. */
  get name(): string {
    const parts = this.path.split("/").filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : "";
  }

  /** Returns the file extension of the name (with dot), or empty string. */
  get suffix(): string {
    const name = this.name;
    const idx = name.lastIndexOf(".");
    return idx > 0 ? name.substring(idx) : "";
  }

  /** Returns the path parts as an array. */
  get parts(): string[] {
    // Note: JS URL pathname always starts with /, so split results in empty first el.
    return this.path.split("/").filter((p) => p.length > 0);
  }

  /** Returns a new Url corresponding to the parent directory. */
  get parent(): Url {
    if (this.path === "/" || this.path === "") return this;
    return this.cloneWith((u) => {
      const parts = u.pathname.split("/");
      // Remove last segment (handle trailing slash logic if needed)
      if (parts[parts.length - 1] === "") parts.pop();
      parts.pop();
      u.pathname = parts.join("/") || "/";
    });
  }

  // ==========================================
  // Fluent Modifiers (Immutability)
  // ==========================================

  /** Returns a new Url with a replaced scheme. */
  withScheme(scheme: string): Url {
    return this.cloneWith((u) => {
      u.protocol = scheme.endsWith(":") ? scheme : `${scheme}:`;
    });
  }

  /** Returns a new Url with a replaced host. */
  withHost(host: string): Url {
    return this.cloneWith((u) => {
      u.hostname = host;
    });
  }

  /** Returns a new Url with a replaced user. */
  withUser(user: string): Url {
    return this.cloneWith((u) => {
      u.username = user;
    });
  }

  /** Returns a new Url with a replaced password. */
  withPassword(password: string): Url {
    return this.cloneWith((u) => {
      u.password = password;
    });
  }

  /** Returns a new Url with a replaced port. */
  withPort(port: number | string | null): Url {
    return this.cloneWith((u) => {
      u.port = port === null ? "" : port.toString();
    });
  }

  /** Returns a new Url with a replaced path. */
  withPath(path: string): Url {
    return this.cloneWith((u) => {
      // Ensure leading slash for consistency
      u.pathname = path.startsWith("/") ? path : `/${path}`;
    });
  }

  /** * Returns a new Url with replaced query parameters.
   * Completely replaces existing query.
   */
  withQuery(query: QueryInput): Url {
    return this.cloneWith((u) => {
      u.search = ""; // Clear existing
      this.appendQueryToUrl(u, query);
    });
  }

  /** Returns a new Url with a replaced fragment. */
  withFragment(fragment: string): Url {
    return this.cloneWith((u) => {
      u.hash = fragment;
    });
  }

  // ==========================================
  // Operations
  // ==========================================

  /**
   * Equivalent to yarl's `/` operator.
   * Appends path segments to the current path.
   */
  join(...parts: string[]): Url {
    return this.cloneWith((u) => {
      // Normalization logic to prevent double slashes
      let current = u.pathname;
      if (current.endsWith("/")) current = current.slice(0, -1);

      const toAppend = parts
        .map((p) => {
          let part = p;
          if (part.startsWith("/")) part = part.slice(1);
          if (part.endsWith("/")) part = part.slice(0, -1);
          return part;
        })
        .filter(Boolean)
        .join("/");

      u.pathname = `${current}/${toAppend}`;
    });
  }

  /**
   * Equivalent to yarl's `%` operator.
   * Updates the query parameters, merging with existing ones.
   * Passing `null` as a value removes that key.
   */
  updateQuery(query: Record<string, QueryValue | QueryValue[]>): Url {
    return this.cloneWith((u) => {
      Object.entries(query).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          u.searchParams.delete(key);
        } else if (Array.isArray(value)) {
          u.searchParams.delete(key);
          value.forEach((v) => {
            if (v !== null && v !== undefined) u.searchParams.append(key, String(v));
          });
        } else {
          // yarl update usually replaces strict key, but standard URLSearchParams
          // behavior for "set" is to replace all occurrences with one.
          u.searchParams.set(key, String(value));
        }
      });
    });
  }

  /**
   * Returns a human-readable representation (decoded).
   * Equivalent to yarl's `human_repr()`.
   */
  humanRepr(): string {
    return decodeURI(this.toString());
  }

  // ==========================================
  // Helpers
  // ==========================================

  private appendQueryToUrl(u: globalThis.URL, query: QueryInput) {
    if (query instanceof URLSearchParams) {
      query.forEach((val, key) => u.searchParams.append(key, val));
      return;
    }

    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== null && item !== undefined) {
            u.searchParams.append(key, String(item));
          }
        });
      } else if (value !== null && value !== undefined) {
        u.searchParams.set(key, String(value));
      }
    });
  }
}

// ==========================================
// Usage Example
// ==========================================
/*
const u = new Url('https://google.com/search');
const u2 = u
  .withPath('api/v1')
  .join('users', '123')
  .updateQuery({ q: 'typescript', page: 1 });

console.log(u.toString());  // https://google.com/search
console.log(u2.toString()); // https://google.com/api/v1/users/123?q=typescript&page=1
*/
