import React, { useState } from "react";

interface LeftPanelProps {
  data: any;
  onSelect: (key: string) => void;
  selectedTab: "patient" | "guideline";
  setSelectedTab: (tab: "patient" | "guideline") => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ data, onSelect, selectedTab, setSelectedTab }) => {
  const [search, setSearch] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredKeys = Object.keys(data).filter((key) =>
    key.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 h-full">
      {/* Tabs for patient and guideline */}
      <div className="border-b mb-4">
        <div className="flex">
          <button
            className={`p-2 w-full text-center ${
              selectedTab === "patient" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => setSelectedTab("patient")}
          >
            Patient
          </button>
          <button
            className={`p-2 w-full text-center ${
              selectedTab === "guideline" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => setSelectedTab("guideline")}
          >
            Guideline
          </button>
        </div>
      </div>

      {/* Search bar */}
      <input
        type="text"
        placeholder={`Search ${selectedTab}`}
        value={search}
        onChange={handleSearchChange}
        className="w-full p-2 border mb-4"
      />

      {/* File List */}
      <ul className="overflow-auto max-h-64">
        {filteredKeys.length > 0 ? (
          filteredKeys.map((key) => (
            <li
              key={key}
              className="cursor-pointer p-2 border-b hover:bg-gray-100"
              onClick={() => onSelect(key)}
            >
              {key}
            </li>
          ))
        ) : (
          <li>No results found</li>
        )}
      </ul>
    </div>
  );
};

export default LeftPanel;
