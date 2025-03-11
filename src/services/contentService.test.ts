/**
 * @jest-environment node
 */

import { getContent, getContentForVaccine } from "@src/services/contentService";
import { VaccineTypes } from "@src/utils/Constants";

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
      const expected6in1VaccinePath =
        "https://content-endpoint/vaccinations/6-in-1-vaccine";

      const content = await getContentForVaccine(VaccineTypes.VACCINE_6_IN_1);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(expected6in1VaccinePath);
      expect(content).toEqual(mockContentApiResponse);
    });
  });
});
