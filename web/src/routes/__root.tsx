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
    return <Outlet />;
};


export const Route = createRootRoute({ component: RootLayout });