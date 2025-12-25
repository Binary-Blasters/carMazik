export const generateVerdict = (a, b) => {
  const points = [];

  if (a.price < b.price)
    points.push(`${a.model} is more budget friendly`);
  else if (a.price > b.price)
    points.push(`${b.model} is more budget friendly`);

  if (a.mileage > b.mileage)
    points.push(`${a.model} offers better mileage`);
  else if (a.mileage < b.mileage)
    points.push(`${b.model} offers better mileage`);

  if (a.year > b.year)
    points.push(`${a.model} is a newer model`);
  else if (a.year < b.year)
    points.push(`${b.model} is a newer model`);

  if (!points.length)
    return "Both cars are evenly matched. Choose based on personal preference.";

  return points.join(". ") + ".";
};
