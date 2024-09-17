import React, { useEffect, useState } from "react";

interface RightPanelProps {
  selectedKey: string | null;
  data: any;
  selectedTab: "patient" | "guideline";
}

const RightPanel: React.FC<RightPanelProps> = ({ selectedKey, data, selectedTab }) => {
  const [fileData, setFileData] = useState<any>({});

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
          } else if (selectedTab === "guideline") {
            const { guideline_medical_condition_path, guideline_criteria_path } = data[selectedKey];

            const [medical, criteria] = await Promise.all([
              fetchFile(guideline_medical_condition_path),
              fetchFile(guideline_criteria_path),
            ]);

            setFileData({ medical, criteria });
          }
        } catch (error) {
          console.error("Error loading files:", error);
        }
      };

      fetchFiles();
    }
  }, [selectedKey, data, selectedTab]);

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
        </div>
      )}

      {selectedTab === "guideline" && selectedKey && (
        <div className="h-full flex flex-col justify-between">
          {/* Guideline Medical Condition */}
          <div className="flex-1 overflow-auto mb-4">
            <h2 className="font-semibold mb-2">Guideline Medical Condition</h2>
            <pre className="bg-gray-100 p-2">{fileData.medical}</pre>
          </div>

          {/* Guideline Criteria */}
          <div className="flex-1 overflow-auto mb-4">
            <h2 className="font-semibold mb-2">Guideline Criteria</h2>
            <pre className="bg-gray-100 p-2">{fileData.criteria}</pre>
          </div>

          {/* Main Guideline Path - Don't attempt to read it, just display the path */}
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
