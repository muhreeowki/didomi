"use server"

import { z } from "zod";
import { CreateProjectFormSchema } from "./schema";
import * as anchor from "@coral-xyz/anchor"

type Inputs = z.infer<typeof CreateProjectFormSchema>;

export const create = async (data: Inputs) => {
    const projectData = {
        accountAddress: ,
        title: data.title,
        story: data.story,
        category: data.category,
        targetAmount: data.targetAmount,
        ownerId: 1,
        ownerAddress: string,
        youtubeURL: data.imageOrYoutubeURL,
        accepted_coins: [data.acceptedCoin]
    }
}
