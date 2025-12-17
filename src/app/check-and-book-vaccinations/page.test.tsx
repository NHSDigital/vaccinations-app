import { auth } from "@project/auth";
import { AgeBasedHubCards } from "@src/app/_components/hub/AgeBasedHubCards";
import VaccinationsHub from "@src/app/check-and-book-vaccinations/page";
import { SERVICE_HEADING } from "@src/app/constants";
import { AgeGroup } from "@src/models/ageBasedHub";
import { NhsNumber } from "@src/models/vaccine";
import { Age } from "@src/utils/auth/types";
import { render, screen } from "@testing-library/react";
import { Session } from "next-auth";

jest.mock("@src/app/_components/nhs-app/BackToNHSAppLink");

jest.mock("@project/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@src/app/_components/hub/AgeBasedHubCards", () => ({
  AgeBasedHubCards: jest
    .fn()
    .mockImplementation(() => <p data-testid={"age-based-hub-cards"}>Age based hub cards test</p>),
}));

jest.mock("@src/app/_components/hub/AtRiskHubContent", () => ({
  AtRiskHubContent: jest
    .fn()
    .mockImplementation(() => <p data-testid={"at-risk-hub-content"}>At risk hub content test</p>),
}));

jest.mock("@src/app/_components/hub/PregnancyHubContent", () => ({
  PregnancyHubContent: jest
    .fn()
    .mockImplementation(() => <p data-testid={"pregnancy-hub-content"}>Pregnancy hub content test</p>),
}));

const mockAgeGroup = AgeGroup.AGE_25_to_64;

const mockSessionValue: Partial<Session> = {
  expires: new Date(Date.now() + 60000).toISOString(),
  user: {
    nhs_number: "" as NhsNumber,
    age: 25 as Age,
    age_group: mockAgeGroup,
  },
};

const mockSession = { data: mockSessionValue, status: "authenticated" };

jest.mock("next-auth/react", () => ({
  useSession: () => mockSession,
}));

describe("Vaccination Hub Page", () => {
  beforeEach(async () => {
    (auth as jest.Mock).mockResolvedValue(mockSessionValue);

    render(await VaccinationsHub());
  });

  it("renders main heading", async () => {
    expectHeadingToBeRendered();
  });

  it("renders age based cards for user", () => {
    const ageBasedHubCards: HTMLElement = screen.getByTestId("age-based-hub-cards");

    expect(ageBasedHubCards).toBeVisible();
    expect(AgeBasedHubCards).toHaveBeenCalledWith(
      {
        ageGroup: mockAgeGroup,
      },
      undefined,
    );
  });

  it("should show at risk expander ", () => {
    const atRiskHubContent: HTMLElement = screen.getByTestId("at-risk-hub-content");

    expect(atRiskHubContent).toBeVisible();
  });

  it("should show pregnancy hub content ", () => {
    const pregnancyHubContent: HTMLElement = screen.getByTestId("pregnancy-hub-content");

    expect(pregnancyHubContent).toBeVisible();
  });

  it("renders vaccines for all ages button", async () => {
    expectLinkToBeRendered("View vaccines for all ages", "/vaccines-for-all-ages");
  });
});

const expectHeadingToBeRendered = () => {
  expect(getHeading(SERVICE_HEADING, 1)).toBeVisible();
};

const expectLinkToBeRendered = (text: string, href: string) => {
  const link: HTMLElement = screen.getByRole("link", { name: text });
  expect(link).toBeVisible();
  expect(link).toHaveAttribute("href", href);
};

const getHeading = (text: string, level: number): HTMLElement => {
  return screen.getByRole("heading", {
    name: text,
    level: level,
  });
};
