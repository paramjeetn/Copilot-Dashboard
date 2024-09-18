import fs from 'fs';
import patientAndGuidelineData from './patientAndGuidelineData.json' assert { type: 'json' }; // Import the structure with JSON assertion

// Function to create a new verification status file with all values set to false
const createVerificationStatusFile = async () => {
  // Initialize the verification status object
  const verificationStatus = {
    patients: {},
    guidelines: {}
  };

  // Iterate over the patients in the original structure
  Object.keys(patientAndGuidelineData.patient).forEach((patientId) => {
    verificationStatus.patients[patientId] = {
      medical_condition_verified: false,
      recommendation_verified: false,
      retrieved_candidates_verified: false
    };
  });

  // Iterate over the guidelines in the original structure
  Object.keys(patientAndGuidelineData.guideline).forEach((guidelineId) => {
    verificationStatus.guidelines[guidelineId] = {
      guideline_medical_condition_verified: false,
      guideline_criteria_verified: false
    };
  });

  // Write the new JSON to a file in the public folder
  const filePath = '../public/data/verificationStatus.json';
  await fs.promises.writeFile(filePath, JSON.stringify(verificationStatus, null, 2));

  console.log('Verification status file created successfully.');
};

// Call the function to create the file
createVerificationStatusFile();
