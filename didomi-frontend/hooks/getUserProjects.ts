"use client";
import axios from "axios";
import { useRouter } from "next/navigation";

const getUserProjects = async (walletAddress: string) => {
  const router = useRouter();
  const { data } = await axios.get(
    `http://localhost:8000/users/projects/${walletAddress}`,
  );
  if (data) return data;
};

export default getUserProjects;
