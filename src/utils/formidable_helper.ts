import { BookFormFields, NormalizedBookFields } from "../types/responce";

export type FormField = string | string[] | undefined;

export const getField = (field: FormField): string | undefined => {
  if (Array.isArray(field)) {
    return field[0];
  }
  return field;
};

export const normalizeFields = (
  fields: BookFormFields
): NormalizedBookFields => {
  const publishYearValue = getField(fields.publishYear);

  return {
    name: getField(fields.name),
    author: getField(fields.author),
    publishYear: publishYearValue
      ? Number(publishYearValue)
      : undefined,
    description: getField(fields.description),
  };
};

