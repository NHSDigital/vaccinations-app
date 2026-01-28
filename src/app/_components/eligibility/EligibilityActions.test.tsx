import { VaccineType } from "@src/models/vaccine";
import { ActionDisplayType, ButtonUrl, Label } from "@src/services/eligibility-api/types";
import { actionBuilder, buttonBuilder } from "@test-data/eligibility-api/builders";
import { render, screen, within } from "@testing-library/react";
import React from "react";

import { EligibilityActions } from "./EligibilityActions";

jest.mock("react-markdown", () => {
  return function MockMarkdown({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  };
});
jest.mock("@src/app/_components/nbs/NBSBookingAction", () => ({
  NBSBookingActionWithAuthSSOForBaseUrl: () => <a href="https://nbs-test-link">NBS Booking Link Test</a>,
  NBSBookingActionWithoutAuthForUrl: () => (
    <a href="https://nbs-without-auth-test-link">NBS Booking Without Auth Link Test</a>
  ),
}));

describe("EligibilityActions", () => {
  describe("when actions are present", () => {
    describe("should show delineator based on last action", () => {
      it("does not show for single action", async () => {
        render(
          EligibilityActions({
            actions: [actionBuilder().withType(ActionDisplayType.infotext).andContent("Test Content 1").build()],
            vaccineType: VaccineType.RSV,
          }),
        );

        const content1: HTMLElement = screen.getByText("Test Content 1");
        expect(content1.closest('[data-testid="markdown-with-styling"]')?.nextElementSibling?.tagName).not.toBe("HR");
      });

      it("shows below first but not the second for two actions", async () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder().withType(ActionDisplayType.infotext).andContent("Test Content 1").build(),
              actionBuilder().withType(ActionDisplayType.infotext).andContent("Test Content 2").build(),
            ],
            vaccineType: VaccineType.RSV,
          }),
        );

        const content1: HTMLElement = screen.getByText("Test Content 1");
        const content2: HTMLElement = screen.getByText("Test Content 2");

        expect(content1.closest('[data-testid="markdown-with-styling"]')?.nextElementSibling?.tagName).toBe("HR");
        expect(content2.closest('[data-testid="markdown-with-styling"]')?.nextElementSibling?.tagName).not.toBe("HR");
      });

      it("shows below all but the last one for multiple mixed action types", async () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder().withType(ActionDisplayType.infotext).andContent("Test Content 1").build(),
              actionBuilder().withType(ActionDisplayType.card).andContent("Test Content 2").build(),
              actionBuilder()
                .withType(ActionDisplayType.nbsAuthLinkButtonWithCard)
                .andContent("Test Content 3")
                .build(),
              actionBuilder()
                .withType(ActionDisplayType.nbsAuthLinkButtonWithInfo)
                .andContent("Test Content 4")
                .build(),
              actionBuilder().withType(ActionDisplayType.actionLinkWithInfo).andContent("Test Content 5").build(),
            ],
            vaccineType: VaccineType.RSV,
          }),
        );

        const separator = screen.getAllByRole("separator");
        expect(separator.length).toBe(4);

        expectDelineatorToNotBePresentAfterElementWithSelector("Test Content 5", '[data-testid="action-paragraph"]');
      });
    });

    describe("infotext", () => {
      it("should display infotext content successfully", () => {
        render(
          EligibilityActions({
            actions: [actionBuilder().withType(ActionDisplayType.infotext).andContent("Test Content").build()],
            vaccineType: VaccineType.RSV,
          }),
        );

        expectContentStringToBeVisible("Test Content");
      });

      it("should display multiple infotexts successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder().withType(ActionDisplayType.infotext).andContent("Test Content 1").build(),
              actionBuilder().withType(ActionDisplayType.infotext).andContent("Test Content 2").build(),
            ],
            vaccineType: VaccineType.RSV,
          }),
        );

        expectEachContentStringToBeVisible(["Test Content 1", "Test Content 2"]);
      });
    });

    describe("card", () => {
      it("should display card content successfully", () => {
        render(
          EligibilityActions({
            actions: [actionBuilder().withType(ActionDisplayType.card).andContent("Test Content").build()],
            vaccineType: VaccineType.RSV,
          }),
        );

        expectContentStringToBeVisible("Test Content");
      });

      it("should display multiple cards successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder().withType(ActionDisplayType.card).andContent("Test Content 1").build(),
              actionBuilder().withType(ActionDisplayType.card).andContent("Test Content 2").build(),
            ],
            vaccineType: VaccineType.RSV,
          }),
        );

        expectEachContentStringToBeVisible(["Test Content 1", "Test Content 2"]);
      });
    });

    describe("nbsAuthLinkButtonWithCard", () => {
      it("should display auth action card content successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder()
                .withType(ActionDisplayType.nbsAuthLinkButtonWithCard)
                .andContent("Test Auth Action Content")
                .build(),
            ],
            vaccineType: VaccineType.RSV,
          }),
        );

        expectContentStringToBeVisible("Test Auth Action Content");
      });

      it("should display button content successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder().withType(ActionDisplayType.nbsAuthLinkButtonWithCard).andContent("Test Content").build(),
            ],
            vaccineType: VaccineType.RSV,
          }),
        );

        expectContentStringToBeVisible("Test Content");
        const bookingButton: HTMLElement = screen.getByText("NBS Booking Link Test");
        expect(bookingButton).toBeInTheDocument();
      });

      it("should display multiple button content components successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder()
                .withType(ActionDisplayType.nbsAuthLinkButtonWithCard)
                .andContent("Test Content 1")
                .build(),
              actionBuilder()
                .withType(ActionDisplayType.nbsAuthLinkButtonWithCard)
                .andContent("Test Content 2")
                .build(),
            ],
            vaccineType: VaccineType.RSV,
          }),
        );

        expectEachContentStringToBeVisible(["Test Content 1", "Test Content 2"]);
      });

      it("should display button without card if no description present", () => {
        render(
          EligibilityActions({
            actions: [actionBuilder().withType(ActionDisplayType.nbsAuthLinkButtonWithCard).andContent("").build()],
            vaccineType: VaccineType.RSV,
          }),
        );

        const authButtonComponents: HTMLElement = screen.getByTestId("action-auth-button-components");

        const card = within(authButtonComponents).queryByTestId("action-auth-button-card");

        expect(card).not.toBeInTheDocument();
      });
    });

    describe("nbsAuthLinkButtonWithInfo", () => {
      it("should display info content successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder()
                .withType(ActionDisplayType.nbsAuthLinkButtonWithInfo)
                .andContent("Test Auth Action Content")
                .andMoreInfo("Another content under the button")
                .build(),
            ],
            vaccineType: VaccineType.RSV,
          }),
        );

        expectContentStringToBeVisible("Test Auth Action Content");
        expectContentStringToBeVisible("Another content under the button");
      });

      it("should display button content successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder().withType(ActionDisplayType.nbsAuthLinkButtonWithInfo).andContent("Test Content").build(),
            ],
            vaccineType: VaccineType.RSV,
          }),
        );

        expectContentStringToBeVisible("Test Content");
        const bookingButton: HTMLElement = screen.getByText("NBS Booking Link Test");
        expect(bookingButton).toBeInTheDocument();
      });

      it("should display multiple button content components successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder()
                .withType(ActionDisplayType.nbsAuthLinkButtonWithInfo)
                .andContent("Test Content 1")
                .build(),
              actionBuilder()
                .withType(ActionDisplayType.nbsAuthLinkButtonWithInfo)
                .andContent("Test Content 2")
                .build(),
            ],
            vaccineType: VaccineType.RSV,
          }),
        );

        expectEachContentStringToBeVisible(["Test Content 1", "Test Content 2"]);
      });

      it("should display button without info if no description present", () => {
        render(
          EligibilityActions({
            actions: [actionBuilder().withType(ActionDisplayType.nbsAuthLinkButtonWithInfo).andContent("").build()],
            vaccineType: VaccineType.RSV,
          }),
        );

        const authButtonComponents = screen.getByTestId("action-auth-button-components");

        const card = within(authButtonComponents).queryByTestId("action-auth-button-card");

        expect(card).not.toBeInTheDocument();
      });
    });

    describe("buttonWithoutAuthLinkWithInfo", () => {
      it("should display info content successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder()
                .withType(ActionDisplayType.buttonWithoutAuthLinkWithInfo)
                .andContent("Test Button Action Content")
                .build(),
            ],
            vaccineType: VaccineType.FLU_FOR_CHILDREN,
          }),
        );

        expectContentStringToBeVisible("Test Button Action Content");
      });

      it("should display button content successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder()
                .withType(ActionDisplayType.buttonWithoutAuthLinkWithInfo)
                .andContent("Test Content")
                .build(),
            ],
            vaccineType: VaccineType.FLU_FOR_CHILDREN,
          }),
        );

        expectContentStringToBeVisible("Test Content");
        const bookingButton: HTMLElement = screen.getByText("NBS Booking Without Auth Link Test");
        expect(bookingButton).toBeInTheDocument();
      });

      it("should display multiple button content components successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder()
                .withType(ActionDisplayType.buttonWithoutAuthLinkWithInfo)
                .andContent("Test Content 1")
                .build(),
              actionBuilder()
                .withType(ActionDisplayType.buttonWithoutAuthLinkWithInfo)
                .andContent("Test Content 2")
                .build(),
            ],
            vaccineType: VaccineType.FLU_FOR_CHILDREN,
          }),
        );

        expectEachContentStringToBeVisible(["Test Content 1", "Test Content 2"]);
      });

      it("should display button without info if no description present", () => {
        render(
          EligibilityActions({
            actions: [actionBuilder().withType(ActionDisplayType.buttonWithoutAuthLinkWithInfo).andContent("").build()],
            vaccineType: VaccineType.FLU_FOR_CHILDREN,
          }),
        );

        const buttonComponents = screen.getByTestId("action-button-without-auth-components");

        const card = within(buttonComponents).queryByTestId("action-auth-button-card");

        expect(card).not.toBeInTheDocument();
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
            vaccineType: VaccineType.RSV,
          }),
        );

        expectEachContentStringToBeVisible(["Test Auth Action Content"]);
      });

      it("should display link content successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder()
                .withType(ActionDisplayType.actionLinkWithInfo)
                .andContent("Test Content")
                .andButton(
                  buttonBuilder()
                    .withLabel("Action Link Test" as Label)
                    .andUrl(new URL("https://example.com/bacon/") as ButtonUrl)
                    .build(),
                )
                .build(),
            ],
            vaccineType: VaccineType.RSV,
          }),
        );

        expectContentStringToBeVisible("Test Content");
        const link = screen.getByRole("link", { name: "Action Link Test" });
        expect(link).toHaveAttribute("href", "https://example.com/bacon/");
      });

      it("should display multiple link content components successfully", () => {
        render(
          EligibilityActions({
            actions: [
              actionBuilder().withType(ActionDisplayType.actionLinkWithInfo).andContent("Test Content 1").build(),
              actionBuilder().withType(ActionDisplayType.actionLinkWithInfo).andContent("Test Content 2").build(),
            ],
            vaccineType: VaccineType.RSV,
          }),
        );

        expectEachContentStringToBeVisible(["Test Content 1", "Test Content 2"]);
      });

      it("should display link without info if no description present", () => {
        render(
          EligibilityActions({
            actions: [actionBuilder().withType(ActionDisplayType.actionLinkWithInfo).andContent("").build()],
            vaccineType: VaccineType.RSV,
          }),
        );

        const linkComponents = screen.getByTestId("action-auth-link-components");

        const card = within(linkComponents).queryByTestId("action-auth-button-card");

        expect(card).not.toBeInTheDocument();
      });
    });
  });

  const expectContentStringToBeVisible = (content: string) => {
    expectEachContentStringToBeVisible([content]);
  };

  const expectEachContentStringToBeVisible = (contentList: string[]) => {
    contentList.forEach((content) => {
      const contentElement: HTMLElement = screen.getByText(content);
      expect(contentElement).toBeVisible();
    });
  };

  const expectDelineatorToNotBePresentAfterElementWithSelector = (content: string, selector: string) => {
    const contentElement: HTMLElement = screen.getByText(content);
    expect(contentElement.closest(selector)?.nextElementSibling?.nextElementSibling?.tagName).not.toBe("HR");
  };
});
