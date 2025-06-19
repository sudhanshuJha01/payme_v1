import axios from "axios";
import { getEnv } from "./getEnv";

export const isLoggedIn = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const response = await axios.get(`${getEnv("VITE_BACKEND_URI")}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.success===true) {
      return true;
    }

    return false;
  } catch (error) {
    console.log("error in isLoggedIn check", error);
    return false;
  }
};

