import { fetchContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-fetcher";
import { writeContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { handler } from "@src/_lambda/content-cache-hydrator/handler";
import { VaccineTypes } from "@src/models/vaccine";
import { getFilteredContentForVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { getStyledContentForVaccine } from "@src/services/content-api/parsers/content-styling-service";

jest.mock("@src/_lambda/content-cache-hydrator/content-writer-service");
jest.mock("@src/_lambda/content-cache-hydrator/content-fetcher");
jest.mock("@src/services/content-api/parsers/content-filter-service");
jest.mock("@src/services/content-api/parsers/content-styling-service");

describe("Lambda Handler", () => {
  const numberOfVaccines = Object.values(VaccineTypes).length;

  it("returns 200 when cache hydration is successful", async () => {
    (fetchContentForVaccine as jest.Mock).mockResolvedValue(undefined);
    (getFilteredContentForVaccine as jest.Mock).mockResolvedValue(undefined);
    (getStyledContentForVaccine as jest.Mock).mockResolvedValue(undefined);
    (writeContentForVaccine as jest.Mock).mockResolvedValue(undefined);

    await expect(handler({})).resolves.toBeUndefined();
  });

  it("returns 500 when cache hydration has failed due to fetching errors", async () => {
    (fetchContentForVaccine as jest.Mock).mockRejectedValue(new Error("test"));
    await expect(handler({})).rejects.toThrow(`${numberOfVaccines} failures`);
  });

  it("returns 500 when cache hydration has failed due to filtering invalid content errors", async () => {
    (fetchContentForVaccine as jest.Mock).mockResolvedValue(undefined);
    (getFilteredContentForVaccine as jest.Mock).mockImplementation(() => {
      throw new Error("test");
    });
    await expect(handler({})).rejects.toThrow(`${numberOfVaccines} failures`);
  });

  it("returns 500 when cache hydration has failed due to styling errors", async () => {
    (fetchContentForVaccine as jest.Mock).mockResolvedValue(undefined);
    (getFilteredContentForVaccine as jest.Mock).mockResolvedValue(undefined);
    (getStyledContentForVaccine as jest.Mock).mockRejectedValue(
      new Error("test"),
    );
    await expect(handler({})).rejects.toThrow(`${numberOfVaccines} failures`);
  });

  it("returns 500 when cache hydration has failed due to writing errors", async () => {
    (fetchContentForVaccine as jest.Mock).mockResolvedValue(undefined);
    (getFilteredContentForVaccine as jest.Mock).mockResolvedValue(undefined);
    (getStyledContentForVaccine as jest.Mock).mockResolvedValue(undefined);
    (writeContentForVaccine as jest.Mock).mockRejectedValue(new Error("test"));
    await expect(handler({})).rejects.toThrow(`${numberOfVaccines} failures`);
  });
});
