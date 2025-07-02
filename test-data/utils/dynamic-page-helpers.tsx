import VaccinePage from "@src/app/vaccines/[vaccine]/page";
import { render } from "@testing-library/react";
import { JSX } from "react";

export const getDynamicRoute = (path: string) => {
  return Promise.resolve({ vaccine: path });
};

export const renderDynamicPage = async (path: string) => {
  const page: JSX.Element = await VaccinePage({
    params: getDynamicRoute(path),
  });
  render(page);
};
