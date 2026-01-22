import { auth } from "@project/auth";
import { AgeBasedHubCards } from "@src/app/_components/hub/AgeBasedHubCards";
import VaccinationsHub from "@src/app/check-and-book-vaccinations/page";
import { SERVICE_HEADING } from "@src/app/constants";
import { AgeGroup } from "@src/models/ageBasedHub";
import { NhsNumber } from "@src/models/vaccine";
import { render, screen } from "@testing-library/react";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

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
    it.each(Object.entries(AgeGroup))(`renders main heading for %s`, async (ageGroupString, ageGroup) => {
      (auth as jest.Mock).mockResolvedValue(mockSessionDataForAgeGroup(ageGroup));

      render(await VaccinationsHub());

      expectHeadingToBeRendered();
    });

    it.each(Object.entries(AgeGroup))(`renders feedback banner for %s`, async (ageGroupString, ageGroup) => {
      (auth as jest.Mock).mockResolvedValue(mockSessionDataForAgeGroup(ageGroup));

      render(await VaccinationsHub());

      expectLinkToBeRendered(
        "give your feedback",
        "https://feedback.digital.nhs.uk/jfe/form/SV_cDd4qebuAblVBZ4?page=hub",
      );
    });

    it.each(Object.entries(AgeGroup))(`renders age based cards for %s`, async (ageGroupString, ageGroup) => {
      (auth as jest.Mock).mockResolvedValue(mockSessionDataForAgeGroup(ageGroup));

      render(await VaccinationsHub());

      const ageBasedHubCards: HTMLElement = screen.getByTestId("age-based-hub-cards");
      expect(ageBasedHubCards).toBeVisible();
      expect(AgeBasedHubCards).toHaveBeenCalledWith({ ageGroup: ageGroup }, undefined);
    });

    it("should redirect to service failure page if user age unknown", async () => {
      (auth as jest.Mock).mockResolvedValue(mockSessionDataForAgeGroup(AgeGroup.UNKNOWN_AGE_GROUP));

      try {
        render(await VaccinationsHub());
      } catch {
        expect(redirect).toHaveBeenCalledTimes(1);
        expect(redirect).toHaveBeenCalledWith("/service-failure");
      }
    });

    it.each(Object.entries(AgeGroup))("should show at risk expander for %s", async (ageGroupString, ageGroup) => {
      (auth as jest.Mock).mockResolvedValue(mockSessionDataForAgeGroup(ageGroup));

      render(await VaccinationsHub());

      const atRiskHubExpander: HTMLElement = screen.getByTestId("at-risk-hub-expander");
      expect(atRiskHubExpander).toBeVisible();
    });

    it.each(Object.entries(AgeGroup))(
      "renders vaccines for all ages button for %s",
      async (ageGroupString, ageGroup) => {
        (auth as jest.Mock).mockResolvedValue(mockSessionDataForAgeGroup(ageGroup));

        render(await VaccinationsHub());

        expectLinkToBeRendered("View vaccines for all ages", "/vaccines-for-all-ages");
      },
    );
  });

  describe("pregnancy hub content", () => {
    it.each([
      { description: "show", ageGroup: AgeGroup.AGE_12_to_16, shouldShowPregnancyContent: true },
      { description: "show", ageGroup: AgeGroup.AGE_17_to_24, shouldShowPregnancyContent: true },
      { description: "show", ageGroup: AgeGroup.AGE_25_to_64, shouldShowPregnancyContent: true },
      { description: "hide", ageGroup: AgeGroup.AGE_65_to_74, shouldShowPregnancyContent: false },
      { description: "hide", ageGroup: AgeGroup.AGE_75_to_80, shouldShowPregnancyContent: false },
      { description: "hide", ageGroup: AgeGroup.AGE_81_PLUS, shouldShowPregnancyContent: false },
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

  describe("age groups with warning callout", () => {
    it.each([
      { description: "hide", ageGroup: AgeGroup.AGE_12_to_16, showWarningCallout: false },
      { description: "show", ageGroup: AgeGroup.AGE_17_to_24, showWarningCallout: true },
      { description: "show", ageGroup: AgeGroup.AGE_25_to_64, showWarningCallout: true },
      { description: "hide", ageGroup: AgeGroup.AGE_65_to_74, showWarningCallout: false },
      { description: "hide", ageGroup: AgeGroup.AGE_75_to_80, showWarningCallout: false },
      { description: "hide", ageGroup: AgeGroup.AGE_81_PLUS, showWarningCallout: false },
    ])(`$ageGroup should $description warning callout`, async ({ ageGroup, showWarningCallout }) => {
      (auth as jest.Mock).mockResolvedValue(mockSessionDataForAgeGroup(ageGroup));

      render(await VaccinationsHub());

      const warningCalloutContent: HTMLElement | null = screen.queryByTestId("callout");

      if (showWarningCallout) {
        expect(warningCalloutContent).toBeVisible();
      } else {
        expect(warningCalloutContent).toBeNull();
      }
    });
  });
});

const expectHeadingToBeRendered = () => {
  expect(getHeading(SERVICE_HEADING, 1)).toBeVisible();
};

const expectLinkToBeRendered = (text: string, href: string) => {
  const link: HTMLLinkElement = screen.getByRole("link", { name: text });
  expect(link).toBeVisible();
  expect(link).toHaveAttribute("href", href);
};

const getHeading = (text: string, level: number): HTMLElement => {
  return screen.getByRole("heading", {
    name: text,
    level: level,
  });
};
