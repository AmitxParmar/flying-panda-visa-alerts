"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Settings,
    Bell,
    User,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
];

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <div className={cn("pb-12 h-screen border-r bg-background flex flex-col justify-between", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center gap-2 mb-2 px-4 h-14">
                        <Bell className="h-6 w-6 text-primary" />
                        <h2 className="text-lg font-semibold tracking-tight">
                            Visa Alerts
                        </h2>
                    </div>
                    <Separator className="mb-4" />
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.href}
                                variant={pathname === item.href ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                asChild
                            >
                                <Link href={item.href}>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="px-4 py-4">
                <Separator className="mb-4" />
                <div className="flex items-center gap-2 px-2">
                    <div className="rounded-full bg-secondary p-2">
                        <User className="h-4 w-4" />
                    </div>
                    <div className="text-sm">
                        <p className="font-medium">Admin User</p>
                        <p className="text-xs text-muted-foreground">admin@example.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
