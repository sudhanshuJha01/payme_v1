import axios from "axios";
import { getEnv } from "./getEnv";

export const getUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        fullname: "",
        email: "",
      };
    }

    const response = await axios.get(`${getEnv("VITE_BACKEND_URI")}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { success, fullname = "", email = "" } = response?.data || {};

    return {
      success: success === true,
      fullname,
      email,
    };
  } catch (error) {
    console.log("Error in getUser:", error);
    return {
      success: false,
      fullname: "",
      email: "",
    };
  }
};
