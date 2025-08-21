import { writeContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { VaccineTypes } from "@src/models/vaccine";
import { INVALIDATED_CONTENT_OVERWRITE_VALUE } from "@src/services/content-api/constants";

const invalidateCacheForVaccine = async (vaccine: VaccineTypes) => {
  await writeContentForVaccine(vaccine, INVALIDATED_CONTENT_OVERWRITE_VALUE);
};

export { invalidateCacheForVaccine };
