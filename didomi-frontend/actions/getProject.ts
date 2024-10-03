"use server";

import { BackendError } from "@/lib/exceptions";
import axios from "axios";

const getProject = async (id: string) => {
  const { data } = await axios
    .get(`${process.env.API_URL}/projects/${id}`)
    .catch((_) => {
      throw new BackendError();
    });
  return data;
};

export default getProject;
