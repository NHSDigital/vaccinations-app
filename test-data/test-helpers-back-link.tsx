import { screen } from "@testing-library/react";
import { Screen } from "@testing-library/dom/types/screen";

export const initialiseBackLinkMocks = () => {
  jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
  }));

  jest.mock("@src/app/_components/nhs-frontend/BackLink", () =>
    jest.fn(() => <div data-testid="back-link"></div>),
  );
};

export const assertBackLinkIsPresent = (screen: Screen) => {
  const backLink = screen.getByTestId("back-link");
  expect(backLink).toBeInTheDocument();
};
