import { AgeBasedHubCards } from "@src/app/_components/hub/AgeBasedHubCards";
import { AgeGroup } from "@src/models/ageBasedHub";
import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import { render, screen } from "@testing-library/react";

const testData = [
  {
    ageGroup: AgeGroup.AGE_12_to_16,
    expectedHeading: "Routine vaccines for children and teenagers aged 12 to 16",
    expectedVaccines: [
      VaccineType.HPV,
      VaccineType.MENACWY,
      VaccineType.TD_IPV_3_IN_1,
      VaccineType.FLU_FOR_SCHOOL_AGED_CHILDREN,
    ],
  },
  {
    ageGroup: AgeGroup.AGE_65_to_74,
    expectedHeading: "Adults aged 65 to 74 should get these routine vaccines",
    expectedVaccines: [VaccineType.PNEUMOCOCCAL, VaccineType.FLU_FOR_ADULTS, VaccineType.SHINGLES],
  },
  {
    ageGroup: AgeGroup.AGE_75_to_80,
    expectedHeading: "Adults aged 75 to 80 should get these routine vaccines",
    expectedVaccines: [
      VaccineType.PNEUMOCOCCAL,
      VaccineType.FLU_FOR_ADULTS,
      VaccineType.SHINGLES,
      VaccineType.RSV,
      VaccineType.COVID_19,
    ],
  },
  {
    ageGroup: AgeGroup.AGE_81_PLUS,
    expectedHeading: "Adults aged 81 and over should get these routine vaccines",
    expectedVaccines: [VaccineType.PNEUMOCOCCAL, VaccineType.FLU_FOR_ADULTS, VaccineType.RSV, VaccineType.COVID_19],
  },
];

describe("Age based hub cards", () => {
  it.each(testData)(`should have expected heading for $ageGroup`, async ({ ageGroup, expectedHeading }) => {
    render(<AgeBasedHubCards ageGroup={ageGroup} />);

    const heading: HTMLElement = screen.getByRole("heading", {
      name: expectedHeading,
      level: 2,
    });

    expect(heading).toBeVisible();
  });

  it.each(testData)("should render card for each vaccine for $ageGroup", async () => {
    const expectedVaccinesFor65to74 = [VaccineType.PNEUMOCOCCAL, VaccineType.FLU_FOR_ADULTS, VaccineType.SHINGLES];

    render(<AgeBasedHubCards ageGroup={AgeGroup.AGE_65_to_74} />);

    expectedVaccinesFor65to74.forEach((vaccineType) => {
      const link: HTMLElement = screen.getByRole("link", { name: VaccineInfo[vaccineType].displayName.titleCase });

      expect(link).toBeVisible();
      expect(link.getAttribute("href")).toEqual(`/vaccines/${VaccineInfo[vaccineType].urlPath}`);
    });
  });

  it("should render empty component when age group is unknown", () => {
    const { container } = render(<AgeBasedHubCards ageGroup={AgeGroup.UNKNOWN_AGE_GROUP} />);
    expect(container).toBeEmptyDOMElement();
  });
});
