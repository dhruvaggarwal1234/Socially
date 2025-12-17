import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="pt-20 md:ml-64">
        <div className="max-w-7xl mx-auto px-4 flex gap-6">

          {/* Main Content */}
          <main className="flex-1">
            <Outlet />
          </main>

       

        </div>
      </div>
    </div>
  );
};

export default RootLayout;
