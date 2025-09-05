import { AppSidebar } from "@/components/ui/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("user");
      navigate("/login");
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
          <Link to={"/"}>
            <h1 className="text-2xl bg-gradient-to-br from-foreground via-primary-glow to-primary bg-clip-text text-transparent leading-tight font-bold">
              Q&A
            </h1>
          </Link>
          <Link to={"/login"} className="ml-auto">
          <Button >Login</Button>
          </Link>
          <Button onClick={handleLogout}>Logout</Button>
        </header>

        {/* Routed content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
