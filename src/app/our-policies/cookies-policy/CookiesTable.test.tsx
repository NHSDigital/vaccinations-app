import CookiesTable from "@src/app/our-policies/cookies-policy/CookiesTable";
import { render, screen } from "@testing-library/react";

describe("CookiesTable component", () => {
  it("displays table with correct columns", () => {
    render(<CookiesTable />);
    const nameColumn: HTMLElement = screen.getByRole("columnheader", { name: "Name" });
    const purposeColumn: HTMLElement = screen.getByRole("columnheader", { name: "Purpose" });
    const expiresColumn: HTMLElement = screen.getByRole("columnheader", { name: "Expires" });

    expect(nameColumn).toBeVisible();
    expect(purposeColumn).toBeVisible();
    expect(expiresColumn).toBeVisible();
  });

  it("displays table with correct row headers", () => {
    render(<CookiesTable />);
    const rowHeader1: HTMLElement = screen.getByRole("rowheader", { name: "__Host-authjs.csrf-token" });
    const rowHeader2: HTMLElement = screen.getByRole("rowheader", { name: "__Secure-authjs.callback-url" });
    const rowHeader3: HTMLElement = screen.getByRole("rowheader", { name: "__Secure-authjs.session-token" });
    const rowHeader4: HTMLElement = screen.getByRole("rowheader", { name: "__Host-Http-session-id" });
    const rowHeader5: HTMLElement = screen.getByRole("rowheader", { name: "__Secure-signout" });

    expect(rowHeader1).toBeVisible();
    expect(rowHeader2).toBeVisible();
    expect(rowHeader3).toBeVisible();
    expect(rowHeader4).toBeVisible();
    expect(rowHeader5).toBeVisible();
  });

  it("displays table with correct cell values", () => {
    render(<CookiesTable />);

    const csrfCookieText: HTMLElement = screen.getByRole("cell", {
      name: "Helps keep the site secure by preventing cross-site request forgery (CSRF) attacks",
    });
    const redirectUrlCookieText: HTMLElement = screen.getByRole("cell", {
      name: "After a successful login, this stores the URL that you are redirected to",
    });
    const encryptedSessionTokenCookieText: HTMLElement = screen.getByRole("cell", {
      name: "Stores information in an encrypted format that allows us to communicate with other services",
    });
    const sessionIdCookieText: HTMLElement = screen.getByRole("cell", {
      name: "Stores a unique, randomly generated session ID used in operational logs to help our IT support team investigate issues",
    });
    const signoutCookieText: HTMLElement = screen.getByRole("cell", {
      name: "Stores temporary information used to identify when you sign out or are signed out after a period of inactivity.",
    });

    const onBrowserCloseCookieTime: HTMLElement[] = screen.getAllByRole("cell", { name: "When you close the browser" });
    const after1hourCookieTime: HTMLElement[] = screen.getAllByRole("cell", { name: "After 1 hour" });
    const after30sCookieTime: HTMLElement[] = screen.getAllByRole("cell", { name: "After 30 seconds" });

    expect(csrfCookieText).toBeVisible();
    expect(redirectUrlCookieText).toBeVisible();
    expect(encryptedSessionTokenCookieText).toBeVisible();
    expect(sessionIdCookieText).toBeVisible();
    expect(signoutCookieText).toBeVisible();

    expect(onBrowserCloseCookieTime.length).toBe(2);
    expect(after1hourCookieTime.length).toBe(2);
    expect(after30sCookieTime.length).toBe(1);
  });
});
