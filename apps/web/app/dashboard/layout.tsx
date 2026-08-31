import DashboardMain from "@shared/components/layout/DashboardMain";
import PrivateRoute from "@shared/components/layout/PrivateRoute";
import Sidebar from "@shared/components/layout/Sidebar";
import type { Children } from "@shared/types/children.types";

export default function DashboardLayout({ children }: Children) {
  return (
    <PrivateRoute>
      <div dir="ltr" className="flex min-h-screen">
        <Sidebar />
        <DashboardMain>{children}</DashboardMain>
      </div>
    </PrivateRoute>
  );
}
