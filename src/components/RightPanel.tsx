import React, { useEffect, useState } from "react";
// Import the FS API provided by vite-plugin-fs
import fs from 'vite-plugin-fs/browser';

interface RightPanelProps {
  selectedKey: string | null;
  data: any;
  selectedTab: "patient" | "guideline";
}

const RightPanel: React.FC<RightPanelProps> = ({ selectedKey, data, selectedTab }) => {
  const [fileData, setFileData] = useState<any>({});
  const [goldenRecommendation, setGoldenRecommendation] = useState<string>(""); // Text content of the recommendation
  const [isEditing, setIsEditing] = useState<boolean>(false); // Control whether the text is editable or not

  // Fetch file content when selectedKey or tab changes
  useEffect(() => {
    if (selectedKey && data[selectedKey]) {
      const fetchFiles = async () => {
        try {
          if (selectedTab === "patient") {
            const { medical_condition_path, reccomendation_path, retrieve_result_path } = data[selectedKey];

            const [medical, recommendation, retrieve] = await Promise.all([
              fetchFile(medical_condition_path),
              fetchFile(reccomendation_path),
              fetchFile(retrieve_result_path),
            ]);

            setFileData({ medical, recommendation, retrieve });

            // Try to read the golden recommendation from the golden_recommendation folder
            const recommendationPath = `./public/data/output/golden_recommendation/${selectedKey}.txt`;
            try {
              const savedRecommendation = await fs.readFile(recommendationPath);
              setGoldenRecommendation(savedRecommendation || ""); // Load existing content for display
              setIsEditing(false); // Disable editing initially
            } catch (err) {
              console.log("File doesn't exist yet, initializing empty text");
              setGoldenRecommendation(""); // Initialize as empty if the file doesn't exist
              setIsEditing(true); // Enable editing if no file exists
            }
          } else if (selectedTab === "guideline") {
            const { guideline_medical_condition_path, guideline_criteria_path } = data[selectedKey];

            const [medicalCondition, guidelineCriteria] = await Promise.all([
              fetchFile(guideline_medical_condition_path),
              fetchFile(guideline_criteria_path)
            ]);

            setFileData({ medicalCondition, guidelineCriteria });
          }
        } catch (error) {
          console.error("Error loading files:", error);
        }
      };

      fetchFiles();
    }
  }, [selectedKey, data, selectedTab]);

  // Handle enabling the edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Save the updated golden recommendation to the file when user clicks save
  const handleSave = async () => {
    if (selectedKey) {
      const filePath = `./public/data/output/golden_recommendation/${selectedKey}.txt`;
      await fs.writeFile(filePath, goldenRecommendation); // Save the updated text
      setIsEditing(false); // Disable editing after save
    }
  };

  const fetchFile = async (filePath: string) => {
    const response = await fetch(filePath);
    if (response.ok) {
      return await response.text();
    } else {
      return "Error loading file";
    }
  };

  return (
    <div className="h-full p-4">
      {selectedTab === "patient" && selectedKey && (
        <div className="h-full flex flex-col justify-between">
          {/* Medical Condition */}
          <div className="flex-1 overflow-auto mb-4">
            <h2 className="font-semibold mb-2">Medical Condition</h2>
            <pre className="bg-gray-100 p-2">{fileData.medical}</pre>
          </div>

          {/* Recommendation */}
          <div className="flex-1 overflow-auto mb-4">
            <h2 className="font-semibold mb-2">Recommendation</h2>
            <pre className="bg-gray-100 p-2">{fileData.recommendation}</pre>
          </div>

          {/* Retrieved Candidates */}
          <div className="flex-1 overflow-auto">
            <h2 className="font-semibold mb-2">Retrieved Candidates</h2>
            <pre className="bg-gray-100 p-2">{fileData.retrieve}</pre>
          </div>

          {/* Golden Recommendation Box */}
          <div className="flex-1 overflow-auto mt-4">
            <h2 className="font-semibold mb-2">Golden Recommendation</h2>
            
            {/* Display text area for editing */}
            {isEditing ? (
              <textarea
                className="w-full p-2 border rounded bg-gray-100"
                placeholder="Enter Golden Recommendation here..."
                value={goldenRecommendation}
                onChange={(e) => setGoldenRecommendation(e.target.value)} // Handle text changes
                rows={4}
              />
            ) : (
              <pre className="bg-gray-100 p-2">{goldenRecommendation || "No Golden Recommendation yet"}</pre>
            )}

            {/* Show Edit or Save buttons */}
            {isEditing ? (
              <button
                onClick={handleSave}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            ) : (
              <button
                onClick={handleEdit}
                className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      )}

      {selectedTab === "guideline" && selectedKey && (
        <div className="h-full flex flex-col justify-between">
          {/* Guideline Medical Condition */}
          <div className="flex-1 overflow-auto mb-4">
            <h2 className="font-semibold mb-2">Guideline Medical Condition</h2>
            <pre className="bg-gray-100 p-2">{fileData.medicalCondition}</pre>
          </div>

          {/* Guideline Criteria */}
          <div className="flex-1 overflow-auto mb-4">
            <h2 className="font-semibold mb-2">Guideline Criteria</h2>
            <pre className="bg-gray-100 p-2">{fileData.guidelineCriteria || "No Criteria available"}</pre>
          </div>

          {/* Main Guideline Path */}
          <div className="flex-1 overflow-auto">
            <h2 className="font-semibold mb-2">Main Guideline Path (PDF)</h2>
            {data[selectedKey]?.main_guideline_path ? (
              <p className="bg-gray-100 p-2">
                <a href={data[selectedKey].main_guideline_path} target="_blank" rel="noopener noreferrer">
                  View PDF
                </a>
              </p>
            ) : (
              <p>No PDF available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
