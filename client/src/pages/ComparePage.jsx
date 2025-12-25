import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { getCompareDetails } from "../api/compare";
import CompareHero from "../components/compare/CompareHero";
import CompareTable from "../components/compare/CompareTable";
import VerdictBox from "../components/compare/VerdictBox";
import RelatedComparisons from "../components/compare/RelatedComparisons";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/Button";
import LoadingScreen from "../components/ui/LoadingScreen";

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const carA = searchParams.get("carA");
  const carB = searchParams.get("carB");

  const { toast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!carA || !carB) {
      toast({
        title: "Invalid comparison",
        description: "Both cars are required",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getCompareDetails(carA, carB);
        console.log(res);
        
        setData(res.data);
      } catch (err) {
        toast({
          title: "Comparison failed",
          description:
            err.response?.data?.message ||
            "Unable to load comparison",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [carA, carB, toast]);

  if (loading) return <LoadingScreen stuff="Compare" />;

  if (!data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <Link to="/comparisons" className="text-orange-600 flex items-center">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Comparisons
      </Link>

      <CompareHero carA={data.carA} carB={data.carB} />
      <CompareTable {...data} />
      {data.verdict && <VerdictBox verdict={data.verdict} />}

      <RelatedComparisons
        brand={data.carA.brand}
        excludeIds={[data.carA._id, data.carB._id]}
      />
    </div>
  );
};

export default ComparePage;
