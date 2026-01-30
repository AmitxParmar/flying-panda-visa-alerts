"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bell, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

interface HeaderProps {
    children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
    const pathname = usePathname();
    const getTitle = () => {
        if (pathname === "/") return "Alerts Dashboard";
        if (pathname === "/settings") return "Settings";
        return "Visa Alerts";
    };

    return (
        <header className="flex h-16 items-center border-b bg-background px-6 justify-between">
            <div className="flex items-center gap-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <Sidebar />
                    </SheetContent>
                </Sheet>
                <h1 className="text-lg font-semibold">{getTitle()}</h1>
            </div>
            <div className="flex items-center gap-4">
                {children}
                <Button variant="ghost" size="icon" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                </Button>
            </div>
        </header>
    );
}
