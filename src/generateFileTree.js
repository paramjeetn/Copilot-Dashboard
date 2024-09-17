import fs from 'fs';
import path from 'path';

// Read the full file structure (you already generated it earlier)
const fullFileStructureData = JSON.parse(fs.readFileSync('./fullFileStructure.json', 'utf-8'));

// Initialize the result JSON
const result = {
  patient: {},
  guideline: {},
};

// Function to process the full file structure and generate patient and guideline JSON
const generatePatientAndGuidelineData = (fullFileStructure) => {
  // Helper function to recursively process each directory and file
  const processNode = (node) => {
    if (node.type === 'directory') {
      node.children.forEach((child) => processNode(child)); // Process all children recursively
    } else if (node.type === 'file') {
      // Check for patient profiles using regex for patient_profile_<number>.txt
      const patientProfileMatch = node.name.match(/^patient_profile_(\d{3})\.txt$/);
      if (patientProfileMatch) {
        const profileFilePath = node.path;
        const patientProfileData = fs.readFileSync(`./data/${profileFilePath}`, 'utf-8');

        // Extract the patient ID from the file content (assuming it's on the first line)
        const patientIdMatch = patientProfileData.match(/"patient_id":\s*"(.+?)"/);
        if (patientIdMatch) {
          const patientId = patientIdMatch[1]; // Extract patient ID

          const medicalConditionPath = node.path.replace('.txt', '_medical_conditions.txt');
          const recommendationPath = `output/recommendations/${patientId}.json`;
          const retrieveResultPath = `output/retrieve_results/${patientId}.json`;

          // Verify if the associated files exist
          const medicalConditionExists = fs.existsSync(path.join('./data', medicalConditionPath));
          const recommendationExists = fs.existsSync(path.join('./data', recommendationPath));
          const retrieveResultExists = fs.existsSync(path.join('./data', retrieveResultPath));

          // Store patient data using the patient_id as the key
          result.patient[patientId] = {
            patient_profile_file_path: path.join('./data',profileFilePath),
            medical_condition_path: medicalConditionExists ? path.join('./data', medicalConditionPath) : 'Not Found',
            reccomendation_path: recommendationExists ? path.join('./data', recommendationPath) : 'Not Found',
            retrieve_result_path: retrieveResultExists ? path.join('./data', retrieveResultPath): 'Not Found',
          };
        }
      }

      // Check for guidelines (guidelines.txt or guidelines.yaml)
      const guidelineMatch = node.name.match(/^(guidelines\.txt|guidelines\.yaml)$/);
      if (guidelineMatch) {
        const parentFolder = path.basename(path.dirname(node.path));
        const grandParentFolder = path.dirname(path.dirname(node.path)); // One level up from sub_guidelines
        const greatGrandParentFolder = path.dirname(grandParentFolder);  // One more level up (parent of grandparent folder)

        const medicalConditionPath = node.path.replace(/guidelines\.(txt|yaml)$/, 'guidelines_medical_condition.txt');
        const criteriaPath = node.path.replace(/guidelines\.(txt|yaml)$/, 'guidelines_criteria.txt');

        // Verify if the files exist
        const medicalConditionExists = fs.existsSync(path.join('./data', medicalConditionPath));
        const criteriaExists = fs.existsSync(path.join('./data', criteriaPath));

        // Now check for the PDF file at the parent of the grandparent folder
        const greatGrandParentFolderPath = path.join('./data', greatGrandParentFolder);

        let mainGuidelinePath = 'Not Found'; // Default value if no PDF is found

        try {
          // Check if great grandparent folder exists
          if (fs.existsSync(greatGrandParentFolderPath)) {
            // List all files in the great grandparent folder (parent of grandparent folder)
            const filesInGreatGrandParentFolder = fs.readdirSync(greatGrandParentFolderPath);

            // Find the first PDF file
            const pdfFile = filesInGreatGrandParentFolder.find((file) => file.toLowerCase().endsWith('.pdf'));

            if (pdfFile) {
              mainGuidelinePath = path.join(greatGrandParentFolderPath, pdfFile);
            }
          } else {
            console.warn(`Great grandparent folder not found: ${greatGrandParentFolderPath}`);
          }
        } catch (error) {
          console.error(`Error reading great grandparent folder: ${error.message}`);
        }

        result.guideline[parentFolder] = {
          parent_file_name: parentFolder,
          guideline_file_path: path.join('./data', node.path),
          guideline_medical_condition_path: medicalConditionExists ? path.join('./data', medicalConditionPath) : 'Not Found',
          guideline_criteria_path: criteriaExists ? path.join('./data', criteriaPath) : 'Not Found',
          main_guideline_path:  mainGuidelinePath // Path to the main guideline PDF
        };
      }
    }
  };

  // Process the full file structure recursively
  fullFileStructure.forEach((node) => processNode(node));
};

// Generate the patient and guideline data
generatePatientAndGuidelineData(fullFileStructureData);

// Write the result to a JSON file
fs.writeFileSync('./patientAndGuidelineData.json', JSON.stringify(result, null, 2));

console.log('Patient and guideline data generated successfully.');
