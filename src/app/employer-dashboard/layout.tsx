import { getCurrentUser } from "@/features/auth/server/auth.queries";
import EmployerSidebar from "@/features/employers/components/employer-sidebar";
import { redirect } from "next/navigation";

export default async function EmployerDashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    if (!user) return redirect("/login");

    if (user.role !== "employer") return redirect("/dashboard");

    return <>
        <div className="flex min-h-screen bg-background ">
            <EmployerSidebar />
            <main className="container mx-auto mt-5 ml-70 mr-5">{children}</main>
        </div>
    </>;
}