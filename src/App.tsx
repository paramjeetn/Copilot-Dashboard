import { useState } from "react";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import patientAndGuidelineData from "./patientAndGuidelineData.json";

const App = () => {
  const [selectedTab, setSelectedTab] = useState<"patient" | "guideline">("patient");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const data = selectedTab === "patient" ? patientAndGuidelineData.patient : patientAndGuidelineData.guideline;

  return (
    <div className="h-screen flex">
      {/* Left Panel */}
      <div className="w-1/2 border-r border-gray-300">
        <LeftPanel
          data={data}
          onSelect={(key) => setSelectedKey(key)}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </div>

      {/* Right Panel */}
      <div className="w-1/2">
        <RightPanel selectedKey={selectedKey} data={data} selectedTab={selectedTab} />
      </div>
    </div>
  );
};

export default App;
