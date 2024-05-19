import { BackendError } from "@/lib/exceptions";
import axios from "axios";

const getDonations = async (id: string) => {
  const { data } = await axios
    .get(`http://localhost:8000/projects/${id}/donations`)
    .catch((_) => {
      throw new BackendError();
    });
  return data;
};

export default getDonations;
