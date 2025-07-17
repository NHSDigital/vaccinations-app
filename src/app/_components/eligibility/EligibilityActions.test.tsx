import { ActionType } from "@src/services/eligibility-api/types";
import { actionBuilder } from "@test-data/eligibility-api/builders";
import { render, screen, within } from "@testing-library/react";
import React from "react";

import { EligibilityActions } from "./EligibilityActions";

// TODO: Remove after final solution for testing with react-markdown
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
    describe("paragraph", () => {
      it("should display paragraph content successfully", () => {
        render(
          EligibilityActions({
            actions: [actionBuilder().withType(ActionType.paragraph).andContent("Test Content").build()],
          }),
        );

        const content: HTMLElement = screen.getByText("Test Content");

        expect(content).toBeVisible();
      });

      it("should display multiple paragraphs successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder().withType(ActionType.paragraph).andContent("Test Content 1").build(),
              actionBuilder().withType(ActionType.paragraph).andContent("Test Content 2").build(),
            ],
          }),
        );

        const content1: HTMLElement = screen.getByText("Test Content 1");
        const content2: HTMLElement = screen.getByText("Test Content 2");

        expect(content1).toBeVisible();
        expect(content2).toBeVisible();
      });
    });

    describe("card", () => {
      it("should display card content successfully", () => {
        render(
          EligibilityActions({
            actions: [actionBuilder().withType(ActionType.card).andContent("Test Content").build()],
          }),
        );

        const content: HTMLElement = screen.getByText("Test Content");

        expect(content).toBeVisible();
      });

      it("should display multiple paragraphs successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder().withType(ActionType.card).andContent("Test Content 1").build(),
              actionBuilder().withType(ActionType.card).andContent("Test Content 2").build(),
            ],
          }),
        );

        const content1: HTMLElement = screen.getByText("Test Content 1");
        const content2: HTMLElement = screen.getByText("Test Content 2");

        expect(content1).toBeVisible();
        expect(content2).toBeVisible();
      });
    });

    describe("button", () => {
      it("should display auth action card content successfully", () => {
        render(
          EligibilityActions({
            actions: [actionBuilder().withType(ActionType.authButton).andContent("Test Auth Action Content").build()],
          }),
        );

        const content: HTMLElement = screen.getByText("Test Auth Action Content");

        expect(content).toBeVisible();
      });

      it("should display button content successfully", () => {
        render(
          EligibilityActions({
            actions: [actionBuilder().withType(ActionType.authButton).andContent("Test Content").build()],
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
              actionBuilder().withType(ActionType.authButton).andContent("Test Content 1").build(),
              actionBuilder().withType(ActionType.authButton).andContent("Test Content 2").build(),
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
            actions: [actionBuilder().withType(ActionType.authButton).andContent("").build()],
          }),
        );

        const authButtonComponents = screen.getByTestId("action-auth-button-components");

        const card = within(authButtonComponents).queryByTestId("action-auth-button-card");

        expect(card).not.toBeInTheDocument();
      });
    });
  });
});
