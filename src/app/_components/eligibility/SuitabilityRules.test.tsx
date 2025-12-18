import { RuleDisplayType } from "@src/services/eligibility-api/types";
import { suitabilityRuleBuilder } from "@test-data/eligibility-api/builders";
import { render, screen } from "@testing-library/react";
import React from "react";

import { SuitabilityRules } from "./SuitabilityRules";

jest.mock("react-markdown", () => {
  return function MockMarkdown({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  };
});

describe("SuitabilityRules", () => {
  describe("when suitabilityRuless are present", () => {
    describe("alreadyVaccinated - basic card", () => {
      it("should display paragraph content successfully", () => {
        render(
          SuitabilityRules({
            suitabilityRules: [
              suitabilityRuleBuilder().withType(RuleDisplayType.card).andContent("Test Content").build(),
            ],
          }),
        );

        expectContentToBeVisible("Test Content");
      });

      it("should display multiple paragraphs successfully", () => {
        render(
          SuitabilityRules({
            suitabilityRules: [
              suitabilityRuleBuilder().withType(RuleDisplayType.card).andContent("Test Content 1").build(),
              suitabilityRuleBuilder().withType(RuleDisplayType.card).andContent("Test Content 2").build(),
            ],
          }),
        );

        expectContentToBeVisible("Test Content 1");
        expectContentToBeVisible("Test Content 2");
      });

      it("should display delineator for all but last rule", () => {
        render(
          SuitabilityRules({
            suitabilityRules: [
              suitabilityRuleBuilder()
                .withType(RuleDisplayType.card)
                .andContent("Test Content 1")
                .andDelineator(true)
                .build(),
              suitabilityRuleBuilder()
                .withType(RuleDisplayType.card)
                .andContent("Test Content 2")
                .andDelineator(false)
                .build(),
            ],
          }),
        );

        const content1: HTMLElement = screen.getByText("Test Content 1");
        const content2: HTMLElement = screen.getByText("Test Content 2");

        expect(content1.closest('[data-testid="markdown-with-styling"]')?.nextElementSibling?.tagName).toBe("HR");
        expect(content2.closest('[data-testid="markdown-with-styling"]')?.nextElementSibling?.tagName).not.toBe("HR");
      });
    });

    describe("infotext cardType", () => {
      it("should display paragraph content successfully", () => {
        render(
          SuitabilityRules({
            suitabilityRules: [
              suitabilityRuleBuilder().withType(RuleDisplayType.infotext).andContent("Test Content").build(),
            ],
          }),
        );

        expectContentToBeVisible("Test Content");
      });

      it("should display multiple paragraphs successfully", () => {
        render(
          SuitabilityRules({
            suitabilityRules: [
              suitabilityRuleBuilder().withType(RuleDisplayType.infotext).andContent("Test Content 1").build(),
              suitabilityRuleBuilder().withType(RuleDisplayType.infotext).andContent("Test Content 2").build(),
            ],
          }),
        );

        expectContentToBeVisible("Test Content 1");
        expectContentToBeVisible("Test Content 2");
      });

      it("should display delineator for all but last rule", () => {
        render(
          SuitabilityRules({
            suitabilityRules: [
              suitabilityRuleBuilder()
                .withType(RuleDisplayType.infotext)
                .andContent("Test Content 1")
                .andDelineator(true)
                .build(),
              suitabilityRuleBuilder()
                .withType(RuleDisplayType.infotext)
                .andContent("Test Content 2")
                .andDelineator(false)
                .build(),
            ],
          }),
        );

        const content1: HTMLElement = screen.getByText("Test Content 1");
        const content2: HTMLElement = screen.getByText("Test Content 2");

        expect(content1.closest('[data-testid="markdown-with-styling"]')?.nextElementSibling?.tagName).toBe("HR");
        expect(content2.closest('[data-testid="markdown-with-styling"]')?.nextElementSibling?.tagName).not.toBe("HR");
      });
    });
  });

  const expectContentToBeVisible = (content: string) => {
    const contentElement: HTMLElement = screen.getByText(content);
    expect(contentElement).toBeVisible();
  };
});
