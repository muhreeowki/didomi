"use client";
import { BackendError } from "@/lib/exceptions";
import axios from "axios";

const getProject = async (id: any) => {
  const { data } = await axios
    .get(`http://localhost:8000/projects/${id}`)
    .catch((_) => {
      throw new BackendError();
    });
  return data;
};

export default getProject;
