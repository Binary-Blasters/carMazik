import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { budgetRanges } from "../mockData";

const HeroForm = () => {
  const [tab, setTab] = useState("new");
  const [filter, setFilter] = useState("budget");

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Find your right car
      </h2>

 
      <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setTab("new")}
          className={`flex-1 py-2 rounded-md font-medium transition-all ${
            tab === "new"
              ? "bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          New Car
        </button>
        <button
          onClick={() => setTab("used")}
          className={`flex-1 py-2 rounded-md font-medium transition-all ${
            tab === "used"
              ? "bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          Used Car
        </button>
      </div>

      
      <div className="flex items-center gap-4 mb-4">
        <label
          className={`flex items-center gap-2 cursor-pointer ${
            filter === "budget" ? "text-blue-600 font-semibold" : "text-gray-600"
          }`}
        >
          <input
            type="radio"
            checked={filter === "budget"}
            onChange={() => setFilter("budget")}
            className="accent-blue-600"
          />
          By Budget
        </label>
        <label
          className={`flex items-center gap-2 cursor-pointer ${
            filter === "brand" ? "text-blue-600 font-semibold" : "text-gray-600"
          }`}
        >
          <input
            type="radio"
            checked={filter === "brand"}
            onChange={() => setFilter("brand")}
            className="accent-blue-600"
          />
          By Brand
        </label>
      </div>

      {/* Dropdowns */}
      <div className="space-y-3 mb-4">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select Budget" />
          </SelectTrigger>
          <SelectContent>
            {budgetRanges.map((range) => (
              <SelectItem key={range.label} value={range.label}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger>
            <SelectValue placeholder="All Vehicle Types" />
          </SelectTrigger>
          <SelectContent>
            {["SUV", "Sedan", "Hatchback", "Luxury"].map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-lg font-semibold text-white transition">
        Search
      </Button>

      <p className="mt-3 text-sm text-gray-500 text-center cursor-pointer hover:text-blue-600 transition">
        Advanced Search →
      </p>
    </div>
  );
};

export default HeroForm;
