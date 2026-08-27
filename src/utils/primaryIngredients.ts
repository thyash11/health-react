export const cleanPrimaryIngredients = (values: string[]) => {
  const seen = new Set<string>();
  return values
    .map((value) => value.trim())
    .filter((value) => {
      const key = value.toLocaleLowerCase();
      if (!value || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

export const parsePrimaryIngredients = (value: string) =>
  cleanPrimaryIngredients(value.split(/[,\n]/));
