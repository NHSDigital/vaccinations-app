import { writeContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { VaccineTypes } from "@src/models/vaccine";

const INVALIDATED_CONTENT_OVERWRITE_VALUE = "{}";

const invalidateCacheForVaccine = async (vaccine: VaccineTypes) => {
  await writeContentForVaccine(vaccine, INVALIDATED_CONTENT_OVERWRITE_VALUE);
};

export { invalidateCacheForVaccine };
