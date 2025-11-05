import { ClipboardCheckIcon, FingerprintIcon, GalleryVerticalEnd, Home, Lock, type LucideProps } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "../ui/sidebar";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { PermissionGuard } from "./PermissionGuard";
import { FormattedMessage } from "react-intl";
import { Roles_All, type Role } from "@/store/useAuthStore";

interface ISidebarNav {
    title: string;
    url: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    roles: Role[];
}

const navMain : ISidebarNav[] = [
    {
        title: "Sidebar.Home",
        url: "/",
        icon: Home,
        roles: Roles_All
    },
    {
        title: "Internships",
        url: "/internships",
        icon: ClipboardCheckIcon,
        roles: ["Student", "InternshipHandler", "Company"]
    },
    {
        title: "Account",
        url: "/account",
        icon: FingerprintIcon,
        roles: ["Student", "InternshipHandler", "Company"]
    },
    {
        title: "Admin Only",
        url: "#",
        icon: Lock,
        roles: ["InternshipHandler"]
    },
    {
        title: "Sidebar.CompanyForm",
        url: "/companyForm",
        icon: Lock,
        roles: ["Student"]
    }
];

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
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
            <SidebarRail />
        </Sidebar>
    );
};

export default AppSidebar;