import fs from 'fs';
import path from 'path';

// Specify the directory containing the data
const dataDir = path.resolve('./data');

// Function to recursively get all files and directories in a folder
const getFullFileStructure = (dir, relativeTo = '') => {
  const files = fs.readdirSync(dir);

  return files.map((file) => {
    const filePath = path.join(dir, file);
    const relativePath = path.join(relativeTo, file);
    const isDirectory = fs.lstatSync(filePath).isDirectory();

    if (isDirectory) {
      return {
        name: file,
        type: 'directory',
        path: relativePath,
        children: getFullFileStructure(filePath, relativePath), // Recursively get children
      };
    } else {
      return {
        name: file,
        type: 'file',
        path: relativePath,
      };
    }
  });
};

// Get the full file structure of the 'data' folder
const fullFileStructure = getFullFileStructure(dataDir);

// Write the structure to a JSON file
fs.writeFileSync('./fullFileStructure.json', JSON.stringify(fullFileStructure, null, 2));

console.log('Full file structure generated successfully.');

// Function to process the full file structure and generate patient and guideline JSON
const generatePatientAndGuidelineData = (fullFileStructure) => {
  const result = {
    patient: {},
    guideline: {},
  };

  // Helper function to recursively process each directory and file
  const processNode = (node) => {
    if (node.type === 'directory') {
      node.children.forEach((child) => processNode(child)); // Process all children recursively
    } else if (node.type === 'file') {
      // Check for patient profiles using regex for patient_profile_<number>.txt
      const patientProfileMatch = node.name.match(/^patient_profile_(\d{3})\.txt$/);
      if (patientProfileMatch) {
        const patientNumber = patientProfileMatch[1]; // Get the patient number from the file name
        const profilePath = node.path;
        const medicalConditionPath = profilePath.replace('.txt', '_medical_conditions.txt');

        // Verify if the medical condition file exists
        const medicalConditionExists = fs.existsSync(path.join('./src/data', medicalConditionPath));

        // Create a unique key for the patient based on their profile number
        result.patient[patientNumber] = {
          patient_profile_file_path: profilePath,
          medical_condition_path: medicalConditionExists ? medicalConditionPath : 'Not Found',
        };

        console.log(`Processed patient profile: patient_profile_${patientNumber}`);
      }

      // Check for guidelines (guidelines.txt or guidelines.yaml)
      const guidelineMatch = node.name.match(/^(guidelines\.txt|guidelines\.yaml)$/);
      if (guidelineMatch) {
        const parentFolder = path.basename(path.dirname(node.path));
        const grandParentFolder = path.basename(path.dirname(path.dirname(node.path)));

        const medicalConditionPath = node.path.replace(/guidelines\.(txt|yaml)$/, 'medical_conditions.txt');
        const criteriaPath = node.path.replace(/guidelines\.(txt|yaml)$/, 'criteria.txt');

        // Verify if the files exist
        const medicalConditionExists = fs.existsSync(path.join('./src/data', medicalConditionPath));
        const criteriaExists = fs.existsSync(path.join('./src/data', criteriaPath));

        result.guideline[parentFolder] = {
          parent_file_name: grandParentFolder,
          guideline_file_path: node.path,
          guideline_medical_condition_path: medicalConditionExists ? medicalConditionPath : 'Not Found',
          guideline_criteria_path: criteriaExists ? criteriaPath : 'Not Found',
          main_guideline_path: '', // Placeholder for main guideline if necessary
        };

        console.log(`Processed guideline: ${parentFolder}`);
      }
    }
  };

  // Process the full file structure recursively
  fullFileStructure.forEach((node) => processNode(node));

  return result;
};

// Read the previously generated full file structure
const fullFileStructureData = JSON.parse(fs.readFileSync('./fullFileStructure.json', 'utf-8'));

// Generate patient and guideline data
const patientAndGuidelineData = generatePatientAndGuidelineData(fullFileStructureData);

// Write the patient and guideline data to a JSON file
fs.writeFileSync('./patientAndGuidelineData.json', JSON.stringify(patientAndGuidelineData, null, 2));

console.log('Patient and guideline data generated successfully.');
