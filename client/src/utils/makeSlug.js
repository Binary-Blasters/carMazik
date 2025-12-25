export const makeSlug = (a, b) => {
  const clean = (s) =>
    s
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  return `${clean(a.model)}-vs-${clean(b.model)}`;
};