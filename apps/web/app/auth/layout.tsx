import PublicRoute from "@shared/components/layout/PublicRoute";
import type { Children } from "@shared/types/children.types";

export default function AuthLayout({ children }: Children) {
  return <PublicRoute>{children}</PublicRoute>;
}
