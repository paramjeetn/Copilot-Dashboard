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
            const { guideline_file_path, guideline_medical_condition_path, guideline_criteria_path } = data[selectedKey];

            const [guideline, medical, criteria] = await Promise.all([
              fetchFile(guideline_file_path),
              fetchFile(guideline_medical_condition_path),
              fetchFile(guideline_criteria_path),
            ]);

            setFileData({ guideline, medical, criteria });
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
      const fileExtension = filePath.split('.').pop();
      if (fileExtension === 'json') {
        const jsonData = await response.json();
        return JSON.stringify(jsonData, null, 2); // Return JSON in readable format
      } else {
        return await response.text(); // Handle text, yaml files
      }
    } else {
      return "Error loading file";
    }
  };

  return (
    <div className="h-full p-4">
      {selectedTab === "patient" && selectedKey && (
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1 overflow-auto mb-4">
            <h2 className="font-semibold mb-2">Medical Condition</h2>
            <pre className="bg-gray-100 p-2">{fileData.medical}</pre>
          </div>

          <div className="flex-1 overflow-auto mb-4">
            <h2 className="font-semibold mb-2">Recommendation</h2>
            <pre className="bg-gray-100 p-2">{fileData.recommendation}</pre>
          </div>

          <div className="flex-1 overflow-auto">
            <h2 className="font-semibold mb-2">Retrieved Candidates</h2>
            <pre className="bg-gray-100 p-2">{fileData.retrieve}</pre>
          </div>
        </div>
      )}

      {selectedTab === "guideline" && selectedKey && (
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1 overflow-auto mb-4">
            <h2 className="font-semibold mb-2">Guideline Content</h2>
            <pre className="bg-gray-100 p-2">{fileData.guideline}</pre>
          </div>

          <div className="flex-1 overflow-auto mb-4">
            <h2 className="font-semibold mb-2">Guideline Medical Condition</h2>
            <pre className="bg-gray-100 p-2">{fileData.medical}</pre>
          </div>

          <div className="flex-1 overflow-auto">
            <h2 className="font-semibold mb-2">Guideline Criteria</h2>
            <pre className="bg-gray-100 p-2">{fileData.criteria}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
