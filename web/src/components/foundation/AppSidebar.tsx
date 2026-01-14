import { ClipboardCheckIcon, FingerprintIcon, LogOut, Lock, Settings, type LucideProps } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "../ui/sidebar";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { PermissionGuard } from "./PermissionGuard";
import { FormattedMessage } from "react-intl";
import { type Role } from "@/store/useAuthStore";
import { useLogout } from "@/hooks/useLogout";

interface ISidebarNav {
    title: string;
    url: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    roles: Role[];
}

const navMain : ISidebarNav[] = [
    {
        title: "Sidebar.Internships",
        url: "/dashboard/internships",
        icon: ClipboardCheckIcon,
        roles: ["Student", "InternshipHandler", "CompanyRepresentative"]
    },
    {
        title: "Sidebar.Account",
        url: "/dashboard/account",
        icon: FingerprintIcon,
        roles: ["Student", "InternshipHandler", "CompanyRepresentative"]
    },
    {
        title: "Sidebar.Applications",
        url: "/dashboard/applications",
        icon: Lock,
        roles: ["InternshipHandler"]
    },
    {
        title: "Sidebar.Settings",
        url: "/dashboard/settings",
        icon: Settings,
        roles: ["InternshipHandler"]
    }
];

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const { userLogout } = useLogout();

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/">
                                <div className="flex">
                                    <span className="text-white font-[Space_Grotesk] font-black text-2xl xl:p-8 md:p-6 p-4"><FormattedMessage id="App.Title"/></span>
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
                                            <FormattedMessage id={item.title} />
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
            <PermissionGuard roles={["Student", "CompanyRepresentative", "InternshipHandler"]}>
                <div className="border-t">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <div className="flex max-w-full p-4">
                                <Button variant="destructive" onClick={userLogout} className="w-[95%] hover:bg-destructive/70 focus:bg-destructive/70 dark:hover:bg-destructive/80 dark:focus:bg-destructive/80">
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