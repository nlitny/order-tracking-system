import AdminDashboard from "@/components/dashboards/AdminDashboard";
import CustomerDashboard from "@/components/dashboards/CustomerDashboard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

async function page() {
  const session = await getServerSession(authOptions);
  if (session?.user.role === "ADMIN" || session?.user.role === "STAFF") {
    return <AdminDashboard />;
  } else {
    return <CustomerDashboard />;
  }
}

export default page;
