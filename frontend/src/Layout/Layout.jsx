import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { getUser } from "../helper/getUser";
import { useUserStore } from "../store/userStore.js";


const Layout = () => {
  const setUser = useUserStore((state) => state.setUser);

 useEffect(() => {
    getUser().then((result) => {
      if (result.success) {
        setUser({ fullname: result.fullname, email: result.email ,accountNumber:result.accountNumber  });
      }
    });
  }, []);
  

  return (
    <div className="flex flex-col min-h-screen bg-slate-900]">
      <NavBar />

      <main className=" w-full p-2">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
