// src/types.ts

export interface PatientData {
  patient_profile_file_path: string;
  medical_condition_path: string;
  reccomendation_path: string;
  retrieve_result_path: string;
}

export interface GuidelineData {
  parent_file_name: string;
  guideline_file_path: string;
  guideline_medical_condition_path: string;
  guideline_criteria_path: string;
  main_guideline_path: string;
}

export interface JsonData {
  patient: {
    [patientId: string]: PatientData;
  };
  guideline: {
    [guidelineId: string]: GuidelineData;
  };
}
