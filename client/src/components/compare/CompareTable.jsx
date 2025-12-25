const colorMap = {
  better: "text-green-600 font-semibold",
  worse: "text-red-500",
  equal: "text-gray-600",
};

const CompareTable = ({ carA, carB, comparison }) => {
  return (
    <table className="w-full border mb-6">
      <thead>
        <tr className="bg-gray-100">
          <th>Spec</th>
          <th>{carA.model}</th>
          <th>{carB.model}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Price</td>
          <td className={colorMap[comparison.price.a]}>
            ₹{carA.price}
          </td>
          <td className={colorMap[comparison.price.b]}>
            ₹{carB.price}
          </td>
        </tr>

        <tr>
          <td>Mileage</td>
          <td className={colorMap[comparison.mileage.a]}>
            {carA.mileage} km/l
          </td>
          <td className={colorMap[comparison.mileage.b]}>
            {carB.mileage} km/l
          </td>
        </tr>

        <tr>
          <td>Year</td>
          <td className={colorMap[comparison.year.a]}>
            {carA.year}
          </td>
          <td className={colorMap[comparison.year.b]}>
            {carB.year}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default CompareTable;
