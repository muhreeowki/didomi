"use server";

import { z } from "zod";
import { CreateProjectFormSchema } from "./schema";
import * as anchor from "@coral-xyz/anchor";

type Inputs = z.infer<typeof CreateProjectFormSchema>;

export const createFunction = async (data: Inputs) => {
  // Call Backend Server to store project data in db.
  // Call Blockchain instruction to store project data on chain.
  const projectData = {
    accountAddress: data.accountAddress,
    title: data.title,
    story: data.story,
    category: data.category,
    targetAmount: data.targetAmount,
    ownerId: 1,
    ownerAddress: data.ownerAddress,
    youtubeURL: data.imageOrYoutubeURL,
    acceptedCoins: [data.acceptedCoin],
  };
};
