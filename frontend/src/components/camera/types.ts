export type PredictionResult = {
  class_index: number;
  plant: string;
  condition: string;
  confidence: number;
};

export type ReportItem = {
  id: string;
  fileName: string;
  preview: string;
  result: PredictionResult[];
};

export type UploadItem = {
  id: string;
  file: File;
  preview: string;
  result?: PredictionResult[] | null;
  analysing?: boolean;
};
