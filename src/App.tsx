// src/App.tsx
import React, { useState } from 'react';
import RightPanel from './components/RightPanel';
import SearchBar from './components/ SearchBar';
import data from './patientAndGuidelineData.json'; // Import the unified JSON

const App = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<'patients' | 'guidelines'>('patients'); // Default is patients tab

  const handleSearch = (id: string) => {
    setSelectedId(id);
  };

  const handleTabChange = (newTab: 'patients' | 'guidelines') => {
    setTab(newTab);
    setSelectedId(null); // Clear the selection when switching tabs
  };

  const selectedData = tab === 'patients' ? data.patient[selectedId || ''] : data.guideline[selectedId || ''];

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '50%', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => handleTabChange('patients')} style={{ fontWeight: tab === 'patients' ? 'bold' : 'normal' }}>
            Patients
          </button>
          <button onClick={() => handleTabChange('guidelines')} style={{ fontWeight: tab === 'guidelines' ? 'bold' : 'normal' }}>
            Guidelines
          </button>
        </div>

        <SearchBar onSearch={handleSearch} tab={tab} />

        <div>
          <h3>{tab === 'patients' ? 'Patient Profile' : 'Guideline'}</h3>
          <p>{selectedId ? (tab === 'patients' ? selectedData?.patient_profile_file_path : selectedData?.guideline_file_path) : 'No selection'}</p>
        </div>
      </div>

      <div style={{ width: '50%', padding: '20px' }}>
        <RightPanel data={selectedData} tab={tab} />
      </div>
    </div>
  );
};

export default App;
