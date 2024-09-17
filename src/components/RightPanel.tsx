// src/components/RightPanel.tsx
import React, { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';
import { Box, Button, Typography } from '@mui/material';

interface RightPanelProps {
  data: {
    goldenRecommendation?: string;
    medicalConditions?: string;
    recommendations?: string;
    retrieveResults?: string;
  } | null;
}

// Helper function to read the file synchronously (works only in Node.js environment)
const readFileSync = (filePath: string) => {
  try {
    const absolutePath = path.resolve('src/data', filePath); // Ensure relative to the 'src/data'
    const content = fs.readFileSync(absolutePath, 'utf-8');
    return content;
  } catch (err) {
    console.error(`Error reading file: ${filePath}`, err);
    return 'Error reading file';
  }
};

const RightPanel: React.FC<RightPanelProps> = ({ data }) => {
  const [goldenRecommendationContent, setGoldenRecommendationContent] = useState<string>('');
  const [medicalConditionsContent, setMedicalConditionsContent] = useState<string>('');
  const [recommendationsContent, setRecommendationsContent] = useState<string>('');
  const [retrieveResultsContent, setRetrieveResultsContent] = useState<string>('');

  // Read file contents when component is mounted and data is passed
  useEffect(() => {
    if (data) {
      if (data.goldenRecommendation) {
        const content = readFileSync(data.goldenRecommendation);
        setGoldenRecommendationContent(content);
      }
      if (data.medicalConditions) {
        const content = readFileSync(data.medicalConditions);
        setMedicalConditionsContent(content);
      }
      if (data.recommendations) {
        const content = readFileSync(data.recommendations);
        setRecommendationsContent(content);
      }
      if (data.retrieveResults) {
        const content = readFileSync(data.retrieveResults);
        setRetrieveResultsContent(content);
      }
    }
  }, [data]);

  return (
    <Box>
      {/* Golden Recommendation */}
      <Typography variant="h6">Golden Recommendation</Typography>
      <Typography variant="body1">{goldenRecommendationContent || 'No data'}</Typography>
      <Button variant="contained" color="primary">LGTM</Button>

      {/* Medical Conditions */}
      <Typography variant="h6">Medical Conditions</Typography>
      <Typography variant="body1">{medicalConditionsContent || 'No data'}</Typography>
      <Button variant="contained" color="primary">LGTM</Button>

      {/* Recommendations */}
      <Typography variant="h6">Recommendations</Typography>
      <Typography variant="body1">{recommendationsContent || 'No data'}</Typography>
      <Button variant="contained" color="primary">LGTM</Button>

      {/* Retrieve Results */}
      <Typography variant="h6">Retrieve Results</Typography>
      <Typography variant="body1">{retrieveResultsContent || 'No data'}</Typography>
      <Button variant="contained" color="primary">LGTM</Button>
    </Box>
  );
};

export default RightPanel;
