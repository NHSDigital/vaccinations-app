import { AgeGroup } from "@src/models/ageGroup";
import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import { render, screen } from "@testing-library/react";
import React from "react";

import { AgeBasedHubInfo } from "./ageBasedHub";

jest.mock("@src/app/_components/hub/HubWarningCallout", () => ({
  __esModule: true,
  default: ({ heading, content }: never) => (
    <div data-testid="hub-warning">
      <h2>{heading}</h2>
      <div>{content}</div>
    </div>
  ),
}));

jest.mock("@src/app/_components/navigation/TransitionLink", () => ({
  TransitionLink: ({ children, href, className }: never) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("AgeBasedHubInfo", () => {
  it("exports AgeBasedHubInfo and AgeGroup", () => {
    expect(AgeBasedHubInfo).toBeDefined();
    expect(AgeGroup).toBeDefined();
  });

  it("contains all expected age group keys", () => {
    expect(AgeBasedHubInfo).toHaveProperty(AgeGroup.AGE_12_to_16);
    expect(AgeBasedHubInfo).toHaveProperty(AgeGroup.AGE_17_to_24);
    expect(AgeBasedHubInfo).toHaveProperty(AgeGroup.AGE_25_to_64);
    expect(AgeBasedHubInfo).toHaveProperty(AgeGroup.AGE_65_to_74);
    expect(AgeBasedHubInfo).toHaveProperty(AgeGroup.AGE_75_to_80);
    expect(AgeBasedHubInfo).toHaveProperty(AgeGroup.AGE_81_PLUS);
    expect(AgeBasedHubInfo).toHaveProperty(AgeGroup.UNKNOWN_AGE_GROUP);
  });

  describe("AGE_12_to_16", () => {
    const info = AgeBasedHubInfo[AgeGroup.AGE_12_to_16]!;

    it("has correct heading", () => {
      expect(info.heading).toBe("Routine vaccines for children and teenagers aged 12 to 16");
    });

    it("has 4 vaccines", () => {
      expect(info.vaccines).toHaveLength(4);
    });

    it("has correct vaccine names", () => {
      expect(info.vaccines.map((v) => v.vaccineName)).toEqual([
        VaccineType.HPV,
        VaccineType.MENACWY,
        VaccineType.TD_IPV_3_IN_1,
        VaccineType.FLU_FOR_SCHOOL_AGED_CHILDREN,
      ]);
    });

    it("shows pregnancy hub content", () => {
      expect(info.showPregnancyHubContent).toBe(true);
    });

    it("has no styledWarningCallout", () => {
      expect(info.styledWarningCallout).toBeUndefined();
    });
  });

  describe("AGE_17_to_24", () => {
    const info = AgeBasedHubInfo[AgeGroup.AGE_17_to_24]!;

    it("has correct heading", () => {
      expect(info.heading).toBe("Routine vaccines for young people aged 17 to 24");
    });

    it("has no vaccines", () => {
      expect(info.vaccines).toHaveLength(0);
    });

    it("shows pregnancy hub content", () => {
      expect(info.showPregnancyHubContent).toBe(true);
    });

    it("renders styledWarningCallout correctly", () => {
      render(info.styledWarningCallout!);

      expect(screen.getByTestId("hub-warning")).toBeInTheDocument();
      expect(screen.getByText("Are you up to date?")).toBeInTheDocument();

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(4);

      const mmrLink = screen.getByRole("link", { name: /MMR vaccine/i });
      expect(mmrLink).toHaveAttribute("href", `/vaccines/${VaccineInfo[VaccineType.MMR].urlPath}`);
    });
  });

  describe("AGE_25_to_64", () => {
    const info = AgeBasedHubInfo[AgeGroup.AGE_25_to_64]!;

    it("has correct heading", () => {
      expect(info.heading).toBe("Routine vaccines for adults aged 25 to 64");
    });

    it("has no vaccines", () => {
      expect(info.vaccines).toHaveLength(0);
    });

    it("shows pregnancy hub content", () => {
      expect(info.showPregnancyHubContent).toBe(true);
    });

    it("renders styledWarningCallout correctly", () => {
      render(info.styledWarningCallout!);

      expect(screen.getByTestId("hub-warning")).toBeInTheDocument();
      expect(screen.getByText("Are you up to date?")).toBeInTheDocument();

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(2);

      const mmrLink = screen.getByRole("link", { name: /MMR vaccine/i });
      expect(mmrLink).toHaveAttribute("href", `/vaccines/${VaccineInfo[VaccineType.MMR].urlPath}`);
    });
  });

  describe("AGE_65_to_74", () => {
    const info = AgeBasedHubInfo[AgeGroup.AGE_65_to_74]!;

    it("has correct heading", () => {
      expect(info.heading).toBe("Adults aged 65 to 74 should get these routine vaccines");
    });

    it("has 3 vaccines", () => {
      expect(info.vaccines).toHaveLength(4);
    });

    it("has correct vaccine names", () => {
      expect(info.vaccines.map((v) => v.vaccineName)).toEqual([
        VaccineType.PNEUMOCOCCAL,
        VaccineType.FLU_FOR_ADULTS,
        VaccineType.SHINGLES,
        VaccineType.COVID_19,
      ]);
    });

    it("does not show pregnancy hub content", () => {
      expect(info.showPregnancyHubContent).toBe(false);
    });

    it("has no styledWarningCallout", () => {
      expect(info.styledWarningCallout).toBeUndefined();
    });
  });

  describe("AGE_75_to_80", () => {
    const info = AgeBasedHubInfo[AgeGroup.AGE_75_to_80]!;

    it("has correct heading", () => {
      expect(info.heading).toBe("Adults aged 75 to 80 should get these routine vaccines");
    });

    it("has 5 vaccines", () => {
      expect(info.vaccines).toHaveLength(5);
    });

    it("has correct vaccine names", () => {
      expect(info.vaccines.map((v) => v.vaccineName)).toEqual([
        VaccineType.PNEUMOCOCCAL,
        VaccineType.FLU_FOR_ADULTS,
        VaccineType.SHINGLES,
        VaccineType.RSV,
        VaccineType.COVID_19,
      ]);
    });

    it("does not show pregnancy hub content", () => {
      expect(info.showPregnancyHubContent).toBe(false);
    });

    it("has no styledWarningCallout", () => {
      expect(info.styledWarningCallout).toBeUndefined();
    });
  });

  describe("AGE_81_PLUS", () => {
    const info = AgeBasedHubInfo[AgeGroup.AGE_81_PLUS]!;

    it("has correct heading", () => {
      expect(info.heading).toBe("Adults aged 81 and over should get these routine vaccines");
    });

    it("has 4 vaccines", () => {
      expect(info.vaccines).toHaveLength(4);
    });

    it("has correct vaccine names", () => {
      expect(info.vaccines.map((v) => v.vaccineName)).toEqual([
        VaccineType.PNEUMOCOCCAL,
        VaccineType.FLU_FOR_ADULTS,
        VaccineType.RSV,
        VaccineType.COVID_19,
      ]);
    });

    it("does not show pregnancy hub content", () => {
      expect(info.showPregnancyHubContent).toBe(false);
    });

    it("has no styledWarningCallout", () => {
      expect(info.styledWarningCallout).toBeUndefined();
    });
  });

  it("returns undefined for UNKNOWN_AGE_GROUP", () => {
    expect(AgeBasedHubInfo[AgeGroup.UNKNOWN_AGE_GROUP]).toBeUndefined();
  });
});
