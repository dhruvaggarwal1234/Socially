import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Widgets from "./components/Widgets";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="grid grid-cols-12 gap-6">

          {/* Sidebar */}
          <aside className="hidden md:block md:col-span-3 lg:col-span-2">
            <Sidebar />
          </aside>

          {/* Main Content */}
          <main className="col-span-12 md:col-span-6 lg:col-span-7">
            <Outlet />
          </main>

          {/* Widgets */}
          <aside className="hidden lg:block lg:col-span-3">
            <Widgets />
          </aside>

        </div>
      </div>
    </div>
  );
};

export default RootLayout;
