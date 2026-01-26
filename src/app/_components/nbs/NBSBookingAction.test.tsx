import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import {
  NBSBookingActionWithAuthSSOForBaseUrl,
  NBSBookingActionWithAuthSSOForVaccine,
  NBSBookingActionWithoutAuthForUrl,
} from "@src/app/_components/nbs/NBSBookingAction";
import { VaccineType } from "@src/models/vaccine";
import { randomURL } from "@test-data/meta-builder";
import { render, screen } from "@testing-library/react";

jest.mock("@src/app/_components/context/BrowserContext", () => ({
  useBrowserContext: jest.fn(),
}));

describe("NBSBookingAction", () => {
  beforeAll(() => {
    window.open = jest.fn() as never;
  });

  const renderVariants = [
    { type: "button", index: 0 },
    { type: "anchor", index: 0 },
    { type: "actionLink", index: 1 },
  ] as const;

  const testScenarios = [
    {
      name: "should open NBS SSO link in same window when action is clicked within NHS app",
      context: { hasContextLoaded: true, isOpenInMobileApp: true },
      expectedTarget: "_self",
      shouldCall: true,
    },
    {
      name: "should open NBS SSO link in new window when action is clicked outside NHS app",
      context: { hasContextLoaded: true, isOpenInMobileApp: false },
      expectedTarget: "_blank",
      shouldCall: true,
    },
    {
      name: "given browser context has not loaded, should do nothing when action is clicked",
      context: { hasContextLoaded: false, isOpenInMobileApp: undefined },
      expectedTarget: "",
      shouldCall: false,
    },
  ];

  describe("Given vaccine type", () => {
    const renderAndClick = (renderAs: "anchor" | "button" | "actionLink", whichElement: number) => {
      render(
        <NBSBookingActionWithAuthSSOForVaccine
          vaccineType={VaccineType.RSV}
          displayText="test"
          renderAs={renderAs}
          reduceBottomPadding={false}
        />,
      );
      const role = renderAs === "button" ? "button" : "link";
      const element = screen.getAllByRole(role, { name: "test" })[whichElement];
      element.click();
    };

    it.each(testScenarios)("$name", ({ context, expectedTarget, shouldCall }) => {
      (useBrowserContext as jest.Mock).mockReturnValue(context);

      renderVariants.forEach(({ type, index }) => {
        jest.clearAllMocks();

        renderAndClick(type, index);

        if (shouldCall) {
          expect(window.open).toHaveBeenCalledWith("/api/sso-to-nbs?vaccine=rsv", expectedTarget);
        } else {
          expect(window.open).not.toHaveBeenCalled();
        }
      });
    });
  });

  describe("Given base URL", () => {
    const url = randomURL();

    const renderAndClick = (renderAs: "anchor" | "button" | "actionLink", whichElement: number) => {
      render(
        <NBSBookingActionWithAuthSSOForBaseUrl
          vaccineType={VaccineType.COVID_19}
          url={url.href}
          displayText="test"
          renderAs={renderAs}
          reduceBottomPadding={false}
        />,
      );
      const role = renderAs === "button" ? "button" : "link";
      const element = screen.getAllByRole(role, { name: "test" })[whichElement];
      element.click();
    };

    it.each(testScenarios)("$name", ({ context, expectedTarget, shouldCall }) => {
      (useBrowserContext as jest.Mock).mockReturnValue(context);

      renderVariants.forEach(({ type, index }) => {
        jest.clearAllMocks();

        renderAndClick(type, index);

        if (shouldCall) {
          expect(window.open).toHaveBeenCalledWith(
            `/api/sso-to-nbs?redirectTarget=${url.href}&vaccine=covid-19-vaccine`,
            expectedTarget,
          );
        } else {
          expect(window.open).not.toHaveBeenCalled();
        }
      });
    });
  });

  describe("Given full URL without SSO auth", () => {
    const url = randomURL();

    const renderAndClick = (renderAs: "anchor" | "button" | "actionLink", whichElement: number) => {
      render(
        <NBSBookingActionWithoutAuthForUrl
          url={url.href}
          displayText="test"
          renderAs={renderAs}
          reduceBottomPadding={false}
        />,
      );
      const role = renderAs === "button" ? "button" : "link";
      const element = screen.getAllByRole(role, { name: "test" })[whichElement];
      element.click();
    };

    it.each(testScenarios)("$name", ({ context, expectedTarget, shouldCall }) => {
      (useBrowserContext as jest.Mock).mockReturnValue(context);

      renderVariants.forEach(({ type, index }) => {
        jest.clearAllMocks();

        renderAndClick(type, index);

        if (shouldCall) {
          expect(window.open).toHaveBeenCalledWith(url.href, expectedTarget);
        } else {
          expect(window.open).not.toHaveBeenCalled();
        }
      });
    });
  });
});
