import PrivateRoute from "@shared/components/layout/PrivateRoute";
import type { Children } from "@shared/types/children.types";

export default function DashboardLayout({ children }: Children) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
