import { AppSidebar } from "@/components/ui/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';
import img1 from '../assets/byteflow_no_bg_refined1.png'

export default function MainLayout() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");


  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("user");
      navigate("/");
      console.log("done")
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <SidebarProvider>
      {/* Sidebar */}
      <AppSidebar />

      {/* Page content with inset */}
      <SidebarInset>
        {/* Top bar */}
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Link to={"/home"}>
            <img src={img1} className="max-w-[20%]"/>
          </Link>
          {user ? (
            <Button onClick={handleLogout} className="ml-auto">Logout</Button>
          ) : (
            <Link to={"/login"} className="ml-auto">
              <Button>Login</Button>
            </Link>
          )}
        </header>
        
        {/* Routed content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
