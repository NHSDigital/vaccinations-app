import { AgeBasedHubCards } from "@src/app/_components/hub/AgeBasedHubCards";
import { AgeGroup } from "@src/models/ageBasedHub";
import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("Age based hub cards", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("for 65-74 year old group", () => {
    it("should render expected heading for age group", async () => {
      render(<AgeBasedHubCards ageGroup={AgeGroup.AGE_65_to_74} />);

      const heading: HTMLElement = screen.getByRole("heading", {
        name: "Adults aged 65 to 74 should get these routine vaccines",
        level: 2,
      });

      expect(heading).toBeVisible();
    });

    it("should render card for each vaccine for age group", async () => {
      const expectedVaccinesFor65to74 = [VaccineType.PNEUMOCOCCAL, VaccineType.FLU_FOR_ADULTS, VaccineType.SHINGLES];

      render(<AgeBasedHubCards ageGroup={AgeGroup.AGE_65_to_74} />);

      expectedVaccinesFor65to74.forEach((vaccineType) => {
        const link: HTMLElement = screen.getByRole("link", { name: VaccineInfo[vaccineType].displayName.titleCase });

        expect(link).toBeVisible();
        expect(link.getAttribute("href")).toEqual(`/vaccines/${VaccineInfo[vaccineType].urlPath}`);
      });
    });
  });

  describe("for unknown age group", () => {
    it("should call redirect with '/service-failure' when age group is unknown", () => {
      try {
        render(<AgeBasedHubCards ageGroup={AgeGroup.UNKNOWN_AGE_GROUP} />);
      } catch {
        expect(redirect).toHaveBeenCalledTimes(1);
        expect(redirect).toHaveBeenCalledWith("/service-failure");
      }
    });
  });
});
