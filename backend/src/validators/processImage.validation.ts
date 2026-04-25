import { z } from 'zod';

// Define maximum file size (e.g., 5MB)
const MAX_FILE_SIZE = 5000000; 

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const processImageSchema = z.object({
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.mimetype),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});
export type ProcessImage = z.infer<typeof processImageSchema>
