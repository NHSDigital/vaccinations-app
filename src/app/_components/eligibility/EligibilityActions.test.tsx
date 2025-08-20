import { ActionDisplayType } from "@src/services/eligibility-api/types";
import { actionBuilder } from "@test-data/eligibility-api/builders";
import { render, screen, within } from "@testing-library/react";
import React from "react";

import { EligibilityActions } from "./EligibilityActions";

jest.mock("react-markdown", () => {
  return function MockMarkdown({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  };
});
jest.mock("@src/app/_components/nbs/NBSBookingAction", () => ({
  NBSBookingActionForBaseUrl: () => <a href="https://nbs-test-link">NBS Booking Link Test</a>,
}));

describe("EligibilityActions", () => {
  describe("when actions are present", () => {
    describe("infotext", () => {
      it("should display infotext content successfully", () => {
        render(
          EligibilityActions({
            actions: [actionBuilder().withType(ActionDisplayType.infotext).andContent("Test Content").build()],
          }),
        );

        const content: HTMLElement = screen.getByText("Test Content");

        expect(content).toBeVisible();
      });

      it("should display multiple infotexts successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder().withType(ActionDisplayType.infotext).andContent("Test Content 1").build(),
              actionBuilder().withType(ActionDisplayType.infotext).andContent("Test Content 2").build(),
            ],
          }),
        );

        const content1: HTMLElement = screen.getByText("Test Content 1");
        const content2: HTMLElement = screen.getByText("Test Content 2");

        expect(content1).toBeVisible();
        expect(content2).toBeVisible();
      });

      it("should display delineator depending on flag", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder()
                .withType(ActionDisplayType.infotext)
                .andContent("Test Content 1")
                .andDelineator(true)
                .build(),
              actionBuilder()
                .withType(ActionDisplayType.infotext)
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

    describe("card", () => {
      it("should display card content successfully", () => {
        render(
          EligibilityActions({
            actions: [actionBuilder().withType(ActionDisplayType.card).andContent("Test Content").build()],
          }),
        );

        const content: HTMLElement = screen.getByText("Test Content");

        expect(content).toBeVisible();
      });

      it("should display multiple cards successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder().withType(ActionDisplayType.card).andContent("Test Content 1").build(),
              actionBuilder().withType(ActionDisplayType.card).andContent("Test Content 2").build(),
            ],
          }),
        );

        const content1: HTMLElement = screen.getByText("Test Content 1");
        const content2: HTMLElement = screen.getByText("Test Content 2");

        expect(content1).toBeVisible();
        expect(content2).toBeVisible();
      });

      it("should display delineator depending on flag", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder()
                .withType(ActionDisplayType.card)
                .andContent("Test Content 1")
                .andDelineator(false)
                .build(),
              actionBuilder().withType(ActionDisplayType.card).andContent("Test Content 2").andDelineator(true).build(),
            ],
          }),
        );

        const content1: HTMLElement = screen.getByText("Test Content 1");
        const content2: HTMLElement = screen.getByText("Test Content 2");

        expect(content1.closest('[data-testid="markdown-with-styling"]')?.nextElementSibling?.tagName).not.toBe("HR");
        expect(content2.closest('[data-testid="markdown-with-styling"]')?.nextElementSibling?.tagName).toBe("HR");
      });
    });

    describe("buttonWithCard", () => {
      it("should display auth action card content successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder().withType(ActionDisplayType.buttonWithCard).andContent("Test Auth Action Content").build(),
            ],
          }),
        );

        const content: HTMLElement = screen.getByText("Test Auth Action Content");

        expect(content).toBeVisible();
      });

      it("should display button content successfully", () => {
        render(
          EligibilityActions({
            actions: [actionBuilder().withType(ActionDisplayType.buttonWithCard).andContent("Test Content").build()],
          }),
        );

        const content: HTMLElement = screen.getByText("Test Content");
        const bookingButton: HTMLElement = screen.getByText("NBS Booking Link Test");

        expect(content).toBeVisible();
        expect(bookingButton).toBeInTheDocument();
      });

      it("should display multiple button content components successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder().withType(ActionDisplayType.buttonWithCard).andContent("Test Content 1").build(),
              actionBuilder().withType(ActionDisplayType.buttonWithCard).andContent("Test Content 2").build(),
            ],
          }),
        );

        const content1: HTMLElement = screen.getByText("Test Content 1");
        const content2: HTMLElement = screen.getByText("Test Content 2");

        expect(content1).toBeVisible();
        expect(content2).toBeVisible();
      });

      it("should display button without card if no description present", () => {
        render(
          EligibilityActions({
            actions: [actionBuilder().withType(ActionDisplayType.buttonWithCard).andContent("").build()],
          }),
        );

        const authButtonComponents = screen.getByTestId("action-auth-button-components");

        const card = within(authButtonComponents).queryByTestId("action-auth-button-card");

        expect(card).not.toBeInTheDocument();
      });

      it("should display delineator depending on flag", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder()
                .withType(ActionDisplayType.buttonWithCard)
                .andContent("Test Content 1")
                .andDelineator(true)
                .build(),
              actionBuilder()
                .withType(ActionDisplayType.buttonWithCard)
                .andContent("Test Content 2")
                .andDelineator(false)
                .build(),
            ],
          }),
        );

        const content1: HTMLElement = screen.getByText("Test Content 1");
        const content2: HTMLElement = screen.getByText("Test Content 2");

        expect(content1.closest(".nhsuk-card")?.nextElementSibling?.nextElementSibling?.tagName).toBe("HR");
        expect(content2.closest(".nhsuk-card")?.nextElementSibling?.nextElementSibling?.tagName).not.toBe("HR");
      });
    });

    describe("buttonWithInfo", () => {
      it("should display info content successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder().withType(ActionDisplayType.buttonWithInfo).andContent("Test Auth Action Content").build(),
            ],
          }),
        );

        const content: HTMLElement = screen.getByText("Test Auth Action Content");

        expect(content).toBeVisible();
      });

      it("should display button content successfully", () => {
        render(
          EligibilityActions({
            actions: [actionBuilder().withType(ActionDisplayType.buttonWithInfo).andContent("Test Content").build()],
          }),
        );

        const content: HTMLElement = screen.getByText("Test Content");
        const bookingButton: HTMLElement = screen.getByText("NBS Booking Link Test");

        expect(content).toBeVisible();
        expect(bookingButton).toBeInTheDocument();
      });

      it("should display multiple button content components successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder().withType(ActionDisplayType.buttonWithInfo).andContent("Test Content 1").build(),
              actionBuilder().withType(ActionDisplayType.buttonWithInfo).andContent("Test Content 2").build(),
            ],
          }),
        );

        const content1: HTMLElement = screen.getByText("Test Content 1");
        const content2: HTMLElement = screen.getByText("Test Content 2");

        expect(content1).toBeVisible();
        expect(content2).toBeVisible();
      });

      it("should display button without info if no description present", () => {
        render(
          EligibilityActions({
            actions: [actionBuilder().withType(ActionDisplayType.buttonWithInfo).andContent("").build()],
          }),
        );

        const authButtonComponents = screen.getByTestId("action-auth-button-components");

        const card = within(authButtonComponents).queryByTestId("action-auth-button-card");

        expect(card).not.toBeInTheDocument();
      });

      it("should display delineator depending on flag", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder()
                .withType(ActionDisplayType.buttonWithInfo)
                .andContent("Test Content 1")
                .andDelineator(true)
                .build(),
              actionBuilder()
                .withType(ActionDisplayType.buttonWithInfo)
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

    describe("actionLinkWithInfo", () => {
      it("should display info content successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder()
                .withType(ActionDisplayType.actionLinkWithInfo)
                .andContent("Test Auth Action Content")
                .build(),
            ],
          }),
        );

        const content: HTMLElement = screen.getByText("Test Auth Action Content");

        expect(content).toBeVisible();
      });

      it("should display link content successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder().withType(ActionDisplayType.actionLinkWithInfo).andContent("Test Content").build(),
            ],
          }),
        );

        const content: HTMLElement = screen.getByText("Test Content");
        const bookingButton: HTMLElement = screen.getByText("NBS Booking Link Test");

        expect(content).toBeVisible();
        expect(bookingButton).toBeInTheDocument();
      });

      it("should display multiple link content components successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder().withType(ActionDisplayType.actionLinkWithInfo).andContent("Test Content 1").build(),
              actionBuilder().withType(ActionDisplayType.actionLinkWithInfo).andContent("Test Content 2").build(),
            ],
          }),
        );

        const content1: HTMLElement = screen.getByText("Test Content 1");
        const content2: HTMLElement = screen.getByText("Test Content 2");

        expect(content1).toBeVisible();
        expect(content2).toBeVisible();
      });

      it("should display link without info if no description present", () => {
        render(
          EligibilityActions({
            actions: [actionBuilder().withType(ActionDisplayType.actionLinkWithInfo).andContent("").build()],
          }),
        );

        const linkComponents = screen.getByTestId("action-auth-button-components");

        const card = within(linkComponents).queryByTestId("action-auth-button-card");

        expect(card).not.toBeInTheDocument();
      });

      it("should display delineator depending on flag", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder()
                .withType(ActionDisplayType.actionLinkWithInfo)
                .andContent("Test Content 1")
                .andDelineator(true)
                .build(),
              actionBuilder()
                .withType(ActionDisplayType.actionLinkWithInfo)
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
});
