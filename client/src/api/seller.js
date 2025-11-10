import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/seller";



const getApprovedCarsApi = async () => {
  try {
    const response = await axios.get(`${API_URL}/approved/cars`,{withCredentials: true});
   
    
    return response.data;
  } catch (error) {
    console.error("Error fetching approved cars:", error);
    throw error;
  }
};
export { getApprovedCarsApi };