import { Screen } from "@testing-library/dom/types/screen";

export const assertBackLinkIsPresent = (screen: Screen) => {
  const backLink = screen.getByTestId("back-link");
  expect(backLink).toBeInTheDocument();
};
