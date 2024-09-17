import React, { useEffect, useState } from 'react';

interface PatientProfileProps {
  filePath: string;
}

const PatientProfile: React.FC<PatientProfileProps> = ({ filePath }) => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    // Simulate file content loading. Replace with real file fetching logic.
    setContent(`Patient Profile: ${filePath}`);
  }, [filePath]);

  return (
    <div>
      <h4>Patient Profile</h4>
      <p>{content}</p>
    </div>
  );
};

export default PatientProfile;
