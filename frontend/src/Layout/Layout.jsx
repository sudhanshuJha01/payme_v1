import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Outlet } from "react-router";
const Layout = () => {
  return (
    <div className="overflow-hidden">
        <NavBar />
        <main className="w-screen relative">
          <div className="w-screen  border-2 bg-[#EEEEEE]">
            <Outlet />
          </div>
          <div className="absolute bottom-0 w-screen">
          <Footer />
          </div>
        </main>
    </div>
  );
};

export default Layout;