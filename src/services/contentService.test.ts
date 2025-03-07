/**
 * @jest-environment node
 */

import getContent from "@src/services/contentService";

const mockContentApiResponse = { description: "mockDescription" };

const fetchMock = jest
  .spyOn(global, "fetch")
  .mockImplementation(
    jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(mockContentApiResponse) }),
    ) as jest.Mock,
  );

describe("Content service", () => {
  describe("getContent", () => {
    it("should return response from content API", async () => {
      const content = await getContent();

      expect(fetchMock).toHaveBeenCalled();
      expect(content).toEqual(mockContentApiResponse);
    });
  });
});
