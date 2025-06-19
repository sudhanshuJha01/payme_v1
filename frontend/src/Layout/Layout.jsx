import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../helper/getUser";

const Layout = () => {
  const [hostData, setHostData] = useState({
    fullname: "",
    email: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getUser();
        setHostData({
          fullname: result?.fullname || "",
          email: result?.email || "",
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchData();
  }, []);

  

  return (
    <div className="flex flex-col min-h-screen bg-[#EEEEEE]">
      <NavBar fullname={hostData.fullname} email={hostData.email} />

      <main className="flex-grow w-full p-2">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
