export type PredictionResult = {
  predicted_class: number;
  confidence: number;
  all_probabilities: number[];
};

export type ReportItem = {
  id: string;
  fileName: string;
  preview: string;
  result: PredictionResult;
};

export type UploadItem = {
  id: string;
  file: File;
  preview: string;
  result?: PredictionResult | null;
  analysing?: boolean;
};
