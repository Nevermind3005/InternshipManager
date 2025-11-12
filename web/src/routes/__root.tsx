import AppSidebar from '@/components/foundation/AppSidebar';
import LanguageSelect from '@/components/foundation/LanguageSelect';
import UserBadge from '@/components/foundation/UserBadge';
import ThemeSwitch from '@/components/ThemeSwitch';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@radix-ui/react-separator';
import { createRootRoute, Link, Outlet, useMatches } from '@tanstack/react-router';
import React from 'react';

const RootLayout = () => {
    const matches = useMatches();

    const breadcrumbItems = matches
        .filter((match) => match.loaderData?.crumb)
        .map(({ pathname, loaderData }) => ({
            href: pathname,
            label: loaderData?.crumb,
        }));
        
    return (<>
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                    <div className="flex items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumbItems.map((item, index) => {
                                    const isLast = index === breadcrumbItems.length - 1;
                                    return (
                                        <React.Fragment key={item.label}>
                                            {isLast ? (
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                                </BreadcrumbItem>
                                            ) : (
                                                <>
                                                    <BreadcrumbItem className="hidden md:block">
                                                        <BreadcrumbLink asChild><Link to={item.href}>{item.label}</Link></BreadcrumbLink>
                                                    </BreadcrumbItem>
                                                    <BreadcrumbSeparator className="hidden md:block" />
                                                </>
                                            )}
                                        </React.Fragment>
                                    );})}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="ml-auto px-3">
                        <div className="flex items-center gap-3">
                            <UserBadge />
                            <ThemeSwitch />
                            <LanguageSelect />
                        </div>
                    </div>
                </header>
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    </>);
};

export const Route = createRootRoute({ component: RootLayout });