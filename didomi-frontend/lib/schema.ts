import { z } from "zod";
import { categories, tokens } from "./enums";

export const CreateProjectFormSchema = z.object({
  title: z
    .string({ required_error: "Please provide a title." })
    .min(10, "Give a more descriptive title."),
  story: z
    .string({ required_error: "Please tell us about your project." })
    .min(100, "Give abit more detail about your project."),
  category: z.string({ required_error: "Please select a category." }),
  targetAmount: z.coerce.number({
    required_error: "Enter your target amount.",
  }),
  imageOrYoutubeURL: z.string().url(),
  acceptedCoin: z.string({ required_error: "Please select a coin." }),
});
