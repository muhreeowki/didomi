import { z } from "zod";
import { categories, tokens } from "./enums";

export const CreateProjectFormSchema = z.object({
  title: z
    .string({ required_error: "Please provide a title." })
    .min(10, "Give a more descriptive title."),
  story: z
    .string({ required_error: "Please tell us about your project." })
    .min(100, "Give abit more detail about your project."),
  category: z
    .string({ required_error: "Please select a category." })
    .min(1, "Please select a category."),
  targetAmount: z.coerce
    .number({
      required_error: "Enter your target amount.",
    })
    .gt(0, "Enter a value larger than 0."),
  imageURL: z.string({ required_error: "Please provide an image url" }).url(),
  websiteURL: z.string().url().optional().or(z.literal("")),
  acceptedCoins: z.string({ required_error: "Please select a coin." }),
  ownerAddress: z.string(),
  accountAddress: z.string(),
  escrowAddress: z.string(),
});

export const UpdateProjectFormSchema = z.object({
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
  imageURL: z.string().url(),
  acceptedCoins: z.string({ required_error: "Please select a coin." }),
  projectStatus: z.string(),
});
