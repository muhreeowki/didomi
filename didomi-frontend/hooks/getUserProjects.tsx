"use client";
import axios from "axios";

const getUserProjects = async (walletAddress: string) => {
  const { data } = await axios.get(
    `http://localhost:8000/users/projects/${walletAddress}`
  );
  return data ? data : null;
};

export default getUserProjects;
