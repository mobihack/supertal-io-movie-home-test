import { useAuth } from "@/hooks/useAuth/useAuth";
import { DashboardMain } from "@/views/dashboard";

export default function DashboardHome() {
  const auth = useAuth();

  auth.logOut();

  return <div />;
}
