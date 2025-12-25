import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCompareBySlug } from "../api/compare";
import CompareTable from "../components/compare/CompareTable";
import VerdictBox from "../components/compare/VerdictBox";

const ComparePage = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    getCompareBySlug(slug).then((res) => {
      setData(res.data.data);
    });
  }, [slug]);

  if (!data) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {data.carA.model} vs {data.carB.model}
      </h1>

      <CompareTable {...data} />
      <VerdictBox verdict={data.verdict} />
    </div>
  );
};

export default ComparePage;
