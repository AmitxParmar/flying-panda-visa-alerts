import { Sidebar } from "@/components/common/sidebar";
import { Header } from "@/components/common/header";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            {/* ROOT CONTAINER: h-screen and hidden overflow to prevent body scroll */}
            <div className="flex h-screen w-full overflow-hidden bg-background">

                {/* SIDEBAR: Fixed width, static in flex container */}
                <div className="hidden md:flex md:w-64 md:flex-col border-r bg-background">
                    <Sidebar className="w-full h-full" />
                </div>

                {/* MAIN CONTENT AREA: Flex 1 to take remaining width */}
                <div className="flex flex-col flex-1 h-full min-w-0">
                    {/* TOP HEADER */}
                    <Header />

                    {/* SCROLLABLE CONTENT: Flex 1 to take remaining height, overflow-y-auto to scroll internally */}
                    <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                        <div className="mx-auto max-w-7xl">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
