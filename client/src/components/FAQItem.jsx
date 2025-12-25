import { ChevronDown } from "lucide-react";

const FAQItem = ({ faq, isOpen, onToggle }) => {
  return (
    <div className="border-b last:border-none">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center py-5 text-left cursor-pointer"
      >
        <span className="font-medium text-gray-900">
          {faq.question}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden text-gray-600 pb-5">
          {faq.answer}
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
