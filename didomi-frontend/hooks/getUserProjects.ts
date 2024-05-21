import { BackendError } from "@/lib/exceptions";
import axios from "axios";

const getUserProjects = async (walletAddress: string) => {
  console.log("fetching user project");
  const data = await axios
    .get(`http://localhost:8000/users/projects/${walletAddress}`)
    .catch((_) => {
      throw new BackendError();
    });
  if (data.data.length != 0) return data.data[0];
  return undefined;
};

export default getUserProjects;
