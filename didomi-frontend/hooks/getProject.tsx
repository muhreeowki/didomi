"use client";
import axios from "axios";

const getProject = async (id: any) => {
  const { data } = await axios.get(`http://localhost:8000/projects/${id}`);
  return data;
};

export default getProject;
