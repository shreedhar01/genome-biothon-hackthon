import { z } from 'zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const processImageSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),  // File uses .type not .mimetype
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export type ProcessImage = z.infer<typeof processImageSchema>



export const processAudioTextSchema = z.object({
  text: z.string().min(10, "Must be more then 50 char")
})
export type ProcessAudio = z.infer<typeof processAudioTextSchema>


export const sendEmailSchema = z.object({
  items: z.array(
    z.object({
      fileName: z.string(),
      result: z.array(
        z.object({
          class_index: z.number().int().nonnegative(),
          plant: z.string(),
          condition: z.string(),
          confidence: z.number().min(0).max(1),
        })
      ).min(1),
    })
  ).min(1),
});

export type SendEmail = z.infer<typeof sendEmailSchema>;