import { createFileRoute, Link } from "@tanstack/react-router";
import {
    Sidebar,
    SidebarProvider,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Home, Calendar, Search, Settings, Clipboard } from "lucide-react";
import LanguageSelect from "@/components/foundation/LanguageSelect";
import ThemeSwitch from "@/components/ThemeSwitch";
import { Button } from "@/components/ui/button";
//import EnsureRole from "@/components/foundation/EnsureRole";

export const Route = createFileRoute("/sidebar")({
    component: RouteComponent,
});

export function AppSidebar() {
    const items = [
        { title: "Home", url: "/", icon: Home },
        { title: "Study Plans", url: "/studyPlans", icon: Clipboard },
        { title: "Internships", url: "/internships", icon: Calendar },
        { title: "Search", url: "#", icon: Search },
        { title: "Preferences", url: "/preferences", icon: Settings },
    ];

    return (
        <>
            <Sidebar>
                <div className="flex flex-col h-full justify-around">
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Application</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <Link to={item.url}>
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                    
                    <div className="p-2 border-t">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    { /** TODO: the centering is kinda fucky, look for better solution than using a padding value */}
                                    <div className="flex py-6 pr-[16px]">
                                        <Button asChild variant="default" className="w-1/2">
                                            <Link to="/login">
                                                Login
                                            </Link> 
                                        </Button>
                                        <Button asChild variant="outline" className="w-1/2">
                                            <Link to="/register">
                                                Register
                                            </Link>
                                        </Button>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </div>
                    
                    <div className="p-2 border-t">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <div className="flex items-center justify-between w-full py-6 pr-[16px]">
                                        <LanguageSelect />
                                        <div className="flex items-center justify-center w-1/2">
                                            <ThemeSwitch />
                                        </div>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </div>
                </div>
            </Sidebar>
        </>
    );
}

function RouteComponent() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="p-4">
                <SidebarTrigger />
            </main>
        </SidebarProvider>
    );
}
