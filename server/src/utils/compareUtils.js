export const compareValue = (a, b, type = "higher") => {
  if (a == null || b == null) return "neutral";
  if (a === b) return "equal";

  if (type === "lower") {
    return a < b ? "better" : "worse";
  }

  return a > b ? "better" : "worse";
};
