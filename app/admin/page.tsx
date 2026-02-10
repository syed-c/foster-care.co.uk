"use client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminDashboard from "@/_pages/admin/AdminDashboardNew";

export default function Page() {
  return (
    <AdminLayout title="Dashboard" description="Overview of your foster care platform">
      <AdminDashboard />
    </AdminLayout>
  );
}
