import { Sidebar } from "@/components/common/sidebar";
import { Header } from "@/components/common/header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden">
            <div className="hidden md:block w-64">
                <Sidebar className="w-64" />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto bg-background p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
