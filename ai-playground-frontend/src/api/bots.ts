import axios from 'axios';

export const getBots = async () => {
  const res = await axios.get("/api/v1/bots")
  return res.data.bots
}