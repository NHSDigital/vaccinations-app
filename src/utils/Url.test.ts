import { Url } from "./Url";

describe("Url Class", () => {
  describe("Constructor", () => {
    test("creates from string", () => {
      const u = new Url("https://example.com");
      expect(u.href).toBe("https://example.com/");
    });

    test("creates from native URL", () => {
      const native = new Url("https://example.com/foo");
      const u = new Url(native);
      expect(u.href).toBe("https://example.com/foo");
    });

    test("creates from another Url instance", () => {
      const original = new Url("https://example.com");
      const copy = new Url(original);
      expect(copy.href).toBe(original.href);
      expect(copy).not.toBe(original); // Ensure it's a new reference
    });

    test("handles base URL", () => {
      const u = new Url("/path", "https://example.com");
      expect(u.href).toBe("https://example.com/path");
    });

    test("throws on invalid URL", () => {
      expect(() => new Url("invalid-url")).toThrow();
    });

    test("handles trailing slash", () => {
      const u = new Url("https://example.com/foo/");
      expect(u.href).toBe("https://example.com/foo/");
    });
  });

  describe("Properties", () => {
    const fullUrl = new Url("https://user:pass@example.com:8080/path/to/file.txt?q=search&tags=a&tags=b#intro");

    test("extracts scheme", () => {
      expect(fullUrl.scheme).toBe("https");
    });

    test("extracts credentials", () => {
      expect(fullUrl.user).toBe("user");
      expect(fullUrl.password).toBe("pass");
    });

    test("extracts host and port", () => {
      expect(fullUrl.host).toBe("example.com");
      expect(fullUrl.port).toBe(8080);
    });

    test("extracts path", () => {
      expect(fullUrl.path).toBe("/path/to/file.txt");
    });

    test("extracts query as object", () => {
      expect(fullUrl.query).toEqual({
        q: "search",
        tags: ["a", "b"],
      });
    });

    test("extracts fragment", () => {
      expect(fullUrl.fragment).toBe("intro");
    });

    test("checks security", () => {
      expect(fullUrl.isSecure).toBe(true);
      expect(new Url("http://example.com").isSecure).toBe(false);
    });

    test("checks absolute", () => {
      expect(fullUrl.isAbsolute).toBe(true);
    });
  });

  describe("Path Helpers", () => {
    const u = new Url("https://example.com/dir/subdir/image.png");

    test("gets name", () => {
      expect(u.name).toBe("image.png");
    });

    test("gets suffix", () => {
      expect(u.suffix).toBe(".png");
    });

    test("gets parts", () => {
      expect(u.parts).toEqual(["dir", "subdir", "image.png"]);
    });

    test("gets parent", () => {
      const parent = u.parent;
      expect(parent.href).toBe("https://example.com/dir/subdir");
      expect(parent.name).toBe("subdir");
    });

    test("parent of root is root", () => {
      const root = new Url("https://example.com/");
      expect(root.parent.href).toBe("https://example.com/");
    });
  });

  describe("Fluent Modifiers (Immutability)", () => {
    const original = new Url("http://example.com/foo");

    test("withScheme", () => {
      const modified = original.withScheme("https");
      expect(modified.href).toBe("https://example.com/foo");
      expect(original.scheme).toBe("http"); // Verify immutability
    });

    test("withHost", () => {
      const modified = original.withHost("api.example.com");
      expect(modified.host).toBe("api.example.com");
      expect(original.host).toBe("example.com");
    });

    test("withUser and withPassword", () => {
      const modified = original.withUser("admin").withPassword("1234");
      expect(modified.href).toBe("http://admin:1234@example.com/foo");
    });

    test("withPort", () => {
      const modified = original.withPort(3000);
      expect(modified.port).toBe(3000);
      const cleared = modified.withPort(null);
      expect(cleared.port).toBeNull();
    });

    test("withPath", () => {
      const modified = original.withPath("/bar");
      expect(modified.path).toBe("/bar");
    });

    test("withQuery (replaces entire query)", () => {
      const u = new Url("https://example.com?a=1");
      const modified = u.withQuery({ b: 2 });
      expect(modified.query).toEqual({ b: "2" }); // a=1 is gone
    });

    test("withFragment", () => {
      const modified = original.withFragment("top");
      expect(modified.fragment).toBe("top");
    });
  });

  describe("Operations", () => {
    test("join (path joining)", () => {
      const u = new Url("https://example.com/api");

      const v1 = u.join("v1", "users");
      expect(v1.path).toBe("/api/v1/users");

      // Handles extra slashes in args
      const v2 = u.join("/v2/", "posts");
      expect(v2.path).toBe("/api/v2/posts");
    });

    test("updateQuery (merges query)", () => {
      const u = new Url("https://example.com?a=1&b=2");

      const updated = u.updateQuery({ b: 3, c: 4 });
      expect(updated.query).toEqual({ a: "1", b: "3", c: "4" });
    });

    test("updateQuery (removes keys)", () => {
      const u = new Url("https://example.com?a=1&b=2");

      const updated = u.updateQuery({ b: null });
      expect(updated.query).toEqual({ a: "1" });
    });

    test("updateQuery (handles arrays)", () => {
      const u = new Url("https://example.com?a=1");
      const updated = u.updateQuery({ a: [10, 20] });
      expect(updated.query).toEqual({ a: ["10", "20"] });
    });

    test("humanRepr (decoding)", () => {
      const u = new Url("https://example.com/path%20with%20spaces");
      expect(u.humanRepr()).toBe("https://example.com/path with spaces");
    });
  });
});
