"use client";
import { BackendError } from "@/lib/exceptions";
import axios from "axios";

const getUserProjects = async (walletAddress: string) => {
  const { data } = await axios
    .get(`http://localhost:8000/users/projects/${walletAddress}`)
    .catch((_) => {
      throw new BackendError();
    });
  return data;
};

export default getUserProjects;
