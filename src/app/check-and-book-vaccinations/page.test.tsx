import { auth } from "@project/auth";
import { AgeBasedHubCards } from "@src/app/_components/hub/AgeBasedHubCards";
import VaccinationsHub from "@src/app/check-and-book-vaccinations/page";
import { SERVICE_HEADING } from "@src/app/constants";
import { AgeGroup } from "@src/models/ageBasedHub";
import { NhsNumber } from "@src/models/vaccine";
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

jest.mock("@src/app/_components/hub/AtRiskHubExpander", () => ({
  AtRiskHubExpander: jest
    .fn()
    .mockImplementation(() => <p data-testid={"at-risk-hub-expander"}>At risk hub expander test</p>),
}));

jest.mock("@src/app/_components/hub/PregnancyHubContent", () => ({
  PregnancyHubContent: jest
    .fn()
    .mockImplementation(() => <p data-testid={"pregnancy-hub-content"}>Pregnancy hub content test</p>),
}));

const mockSessionDataForAgeGroup = (ageGroup: AgeGroup): Partial<Session> => {
  return {
    expires: new Date(Date.now() + 60000).toISOString(),
    user: {
      nhs_number: "" as NhsNumber,
      age_group: ageGroup,
    },
  };
};

describe("Vaccination Hub Page", () => {
  describe("for all ages", () => {
    const mockAgeGroup = AgeGroup.AGE_25_to_64;

    beforeEach(async () => {
      (auth as jest.Mock).mockResolvedValue(mockSessionDataForAgeGroup(mockAgeGroup));

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
      const atRiskHubExpander: HTMLElement = screen.getByTestId("at-risk-hub-expander");
      expect(atRiskHubExpander).toBeVisible();
    });

    it("should show pregnancy hub content ", () => {
      const pregnancyHubContent: HTMLElement = screen.getByTestId("pregnancy-hub-content");

      expect(pregnancyHubContent).toBeVisible();
    });

    it("renders vaccines for all ages button", async () => {
      expectLinkToBeRendered("View vaccines for all ages", "/vaccines-for-all-ages");
    });
  });

  describe("pregnancy hub content", () => {
    it.each([
      { description: "hide", ageGroup: AgeGroup.AGE_65_to_74, shouldShowPregnancyContent: false },
      { description: "show", ageGroup: AgeGroup.UNKNOWN_AGE_GROUP, shouldShowPregnancyContent: true },
    ])(`$ageGroup should $description pregnancy content`, async ({ ageGroup, shouldShowPregnancyContent }) => {
      (auth as jest.Mock).mockResolvedValue(mockSessionDataForAgeGroup(ageGroup));

      render(await VaccinationsHub());

      const pregnancyHubContent: HTMLElement | null = screen.queryByTestId("pregnancy-hub-content");

      if (shouldShowPregnancyContent) {
        expect(pregnancyHubContent).toBeVisible();
      } else {
        expect(pregnancyHubContent).toBeNull();
      }
    });
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
