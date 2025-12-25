const VerdictBox = ({ verdict }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <h3 className="font-bold text-blue-700 mb-1">
        AI Verdict
      </h3>
      <p className="text-gray-700">{verdict}</p>
    </div>
  );
};

export default VerdictBox;
