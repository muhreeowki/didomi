import axios from "axios";

const getDonations = async (id: string) => {
  const data = await axios.get(
    `http://localhost:8000/projects/${id}/donations`,
  );
  if (data) {
    return data.data;
  }
  return {};
};

export default getDonations;
