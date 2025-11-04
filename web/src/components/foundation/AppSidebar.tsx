import { GalleryVerticalEnd, Home, Lock,LogOut, type LucideProps } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "../ui/sidebar";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { PermissionGuard } from "./PermissionGuard";
import { FormattedMessage } from "react-intl";
import { Roles_All, useAuthStore, type Role } from "@/store/useAuthStore";
import { authHttpClient } from "@/api/http";
import { API } from "@/api/api";
import router from "@/lib/router";

interface ISidebarNav {
    title: string;
    url: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    roles: Role[];
}

const navMain : ISidebarNav[] = [
    {
        title: "Home",
        url: "/",
        icon: Home,
        roles: Roles_All
    },
    {
        title: "Admin Only",
        url: "#",
        icon: Lock,
        roles: ["InternshipHandler"]
    }
];

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    // Get role and clearStore from auth store
    const role = useAuthStore((state) => state.role);
    const clearStore = useAuthStore((state) => state.clearStore);
    
    // User is authenticated if role is NOT "None"
    const isAuthenticated = role !== "None";

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        await authHttpClient.post(API.Endpoints.Auth.Logout());
        // Delete accessToken, refreshToken and set role to "None"
        clearStore();
        
        // Redirect to home page
        router.navigate({ to: '/' });
    };
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-medium">Internship Manager</span>
                                    <span className="">v1.0.0</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {navMain.map((item) => (
                            <PermissionGuard roles={item.roles} key={item.title}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            {item.title}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </PermissionGuard>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <PermissionGuard roles={["None"]}>
                <div className="border-t">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <div className="flex justify-between max-w-full p-4">
                                <Button asChild variant="default" className="w-[48%]">
                                    <Link to="/login">
                                        <FormattedMessage id="SignIn.SignIn" />
                                    </Link> 
                                </Button>
                                <Button asChild variant="outline" className="w-[48%]">
                                    <Link to="/register">
                                        <FormattedMessage id="SignUp.SignUp" />
                                    </Link>
                                </Button>
                            </div>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </div>
            </PermissionGuard>
            <PermissionGuard roles={["Student", "Company", "InternshipHandler"]}>
                <div className="border-t">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <div className="flex max-w-full p-4">
                                <Button variant="destructive" onClick={(e) => handleLogout(e)} className="w-[95%] hover:bg-destructive/70 focus:bg-destructive/70 dark:hover:bg-destructive/80 dark:focus:bg-destructive/80">
                                    <LogOut className="h-7 w-7" />
                                    <FormattedMessage id="Auth.Logout" />
                                </Button>
                            </div>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </div>
            </PermissionGuard>
            <SidebarRail />
        </Sidebar>
    );
};

export default AppSidebar;