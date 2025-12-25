import { useState, useMemo } from "react";
import { Search, HelpCircle } from "lucide-react";
import FAQItem from "../components/FAQItem";



const FAQ_DATA = [
  {
    category: "General",
    items: [
      {
        question: "What is CarMazik?",
        answer:
          "CarMazik is a trusted platform for buying and selling verified used cars, upcoming cars, and newly launched cars in India.",
      },
      {
        question: "Is CarMazik free to use?",
        answer:
          "Yes, browsing and listing cars on CarMazik is currently free.",
      },
    ],
  },
  {
    category: "Buying Cars",
    items: [
      {
        question: "Are cars verified before listing?",
        answer:
          "Yes, all used cars are verified and approved by our admin team before going live.",
      },
      {
        question: "Can I save cars to wishlist?",
        answer:
          "Yes, logged-in users can save cars to their wishlist for later.",
      },
    ],
  },
  {
    category: "Selling Cars",
    items: [
      {
        question: "How can I sell my car?",
        answer:
          "Login as a seller, upload car details with images, and submit it for admin approval.",
      },
      {
        question: "Is there any listing charge?",
        answer:
          "No, listing your car on CarMazik is completely free.",
      },
    ],
  },
  {
    category: "Upcoming & New Cars",
    items: [
      {
        question: "What are upcoming cars?",
        answer:
          "Upcoming cars are models expected to launch soon with estimated specifications.",
      },
      {
        question: "What are newly launched cars?",
        answer:
          "Newly launched cars are recently released models with official launch details.",
      },
    ],
  },
];



const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("General");
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");

  const activeFAQs = useMemo(() => {
    const category = FAQ_DATA.find((c) => c.category === activeCategory);
    if (!category) return [];

    if (!search) return category.items;

    return category.items.filter((f) =>
      f.question.toLowerCase().includes(search.toLowerCase())
    );
  }, [activeCategory, search]);

  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.flatMap((c) =>
      c.items.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      }))
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-16 px-4">
      
    
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>

      <div className="max-w-5xl mx-auto">
      
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <HelpCircle className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 mt-2">
            Everything you need to know about CarMazik
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {FAQ_DATA.map((c) => (
            <button
              key={c.category}
              onClick={() => {
                setActiveCategory(c.category);
                setOpenIndex(null);
                setSearch("");
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
                activeCategory === c.category
                  ? "bg-blue-600 text-white"
                  : "bg-white border hover:bg-blue-50"
              }`}
            >
              {c.category}
            </button>
          ))}
        </div>

       
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {activeFAQs.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              No matching questions found.
            </p>
          ) : (
            activeFAQs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            ))
          )}
        </div>

        
        <p className="text-center text-sm text-gray-400 mt-10">
          Didn’t find what you were looking for? Contact support.
        </p>
      </div>
    </div>
  );
};

export default FAQ;
