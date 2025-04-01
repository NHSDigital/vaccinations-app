/**
 * @jest-environment node
 */

import { VaccineTypes } from "@src/models/vaccine";
import {
  getContent,
  getContentForVaccine,
} from "@src/services/content-api/gateway/content-service";
import {
  CONTENT_API_VACCINATIONS_PATH,
  VaccineContentPaths,
} from "@src/services/content-api/constants";

const mockContentApiResponse = { description: "mockDescription" };

const fetchMock = jest
  .spyOn(global, "fetch")
  .mockImplementation(
    jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(mockContentApiResponse) }),
    ) as jest.Mock,
  );

jest.mock("@src/utils/config", () => () => ({
  CONTENT_API_ENDPOINT: "https://content-endpoint",
  CONTENT_API_KEY: "x",
}));

describe("Content service", () => {
  describe("getContent", () => {
    it("should return response from content API", async () => {
      const content = await getContent();

      expect(fetchMock).toHaveBeenCalled();
      expect(content).toEqual(mockContentApiResponse);
    });
  });

  describe("getContentForVaccine", () => {
    it("should return response for 6-in-1 vaccine from content API", async () => {
      const expected6in1VaccinePath = `https://content-endpoint${CONTENT_API_VACCINATIONS_PATH}${VaccineContentPaths.SIX_IN_ONE}`;

      const content = await getContentForVaccine(VaccineTypes.SIX_IN_ONE);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(expected6in1VaccinePath, {
        headers: { accept: "application/json", apikey: "x" },
        method: "GET",
      });
      expect(content).toEqual(mockContentApiResponse);
    });
  });
});
