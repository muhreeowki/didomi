"use server";

import { BackendError } from "@/lib/exceptions";
import axios from "axios";

const getDonations = async (id: string) => {
  console.log("fetching donations");
  const { data } = await axios
    .get(`${process.env.API_URL}/projects/${id}/donations`)
    .catch((_) => {
      throw new BackendError();
    });
  return data;
};

export default getDonations;
