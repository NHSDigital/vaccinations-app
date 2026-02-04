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

    expect(rowHeader1).toBeVisible();
    expect(rowHeader2).toBeVisible();
    expect(rowHeader3).toBeVisible();
  });

  it("displays table with correct cell values", () => {
    render(<CookiesTable />);
    const cell1: HTMLElement = screen.getByRole("cell", {
      name: "Helps keep the site secure by preventing cross-site request forgery (CSRF) attacks",
    });
    const cell2: HTMLElement = screen.getByRole("cell", {
      name: "After a successful login, this stores the URL that you are redirected to",
    });
    const cell3: HTMLElement = screen.getByRole("cell", {
      name: "Stores information in an encrypted format that allows us to communicate with other services",
    });
    const cell4: HTMLElement = screen.getByRole("cell", {
      name: "Stores a unique, randomly generated session ID used in operational logs to help our IT support team investigate issues",
    });
    const cells5and6: HTMLElement[] = screen.getAllByRole("cell", { name: "When you close the browser" });
    const cells7and8: HTMLElement[] = screen.getAllByRole("cell", { name: "After 1 hour" });

    expect(cell1).toBeVisible();
    expect(cell2).toBeVisible();
    expect(cell3).toBeVisible();
    expect(cell4).toBeVisible();
    expect(cells5and6.length).toBe(2);
    expect(cells7and8.length).toBe(2);
  });
});
