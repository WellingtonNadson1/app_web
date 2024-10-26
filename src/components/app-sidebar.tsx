"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { HandHeart, House, Plus, SignOut, Users } from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ThemeImage from "./theme-image";
import { Button } from "./ui/button";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: House,
  },
  {
    title: "Célula",
    url: "#",
    icon: Users,
  },
  {
    title: "Discipulado",
    url: "#",
    icon: HandHeart,
  },
]

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { open, isMobile } = useSidebar()
  const route = useRouter();
  const pathAtual = usePathname()
  return (
    <div className="flex">
      <Sidebar
        data-collapsed={isCollapsed}
        variant="sidebar"
        collapsible="icon"
        className={cn("transition-all duration-300", isCollapsed && isMobile ? "w-16" : "w-56")}
      >
        <SidebarHeader>
          <div className={cn("p-2", !open ? 'flex items-center justify-center' : 'flex items-center justify-center')}>
            <ThemeImage
              alt="Logo IBB"
              srcLight="images/logo-ibb-1.svg"
              srcDark="images/logo-mini-dark.svg"
              onClick={() => route.push(pathAtual)}
              width={isCollapsed ? 32 : 54}
              height={isCollapsed ? 32 : 54}
            />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarSeparator />
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupAction className="peer-data-[active=true]/menu-button:opacity-100">
              <Plus /> <span className="sr-only">Add Project</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="transition duration-150 ease-in-out hover:scale-105 hover:bg-[#1D70B6] hover:rounded-md hover:fill-current hover:text-gray-200 focus:outline-none">
                      <a href={item.url} className="text-gray-500 p-2">
                        <item.icon className={cn('h-6 w-6')} />
                        {!isCollapsed && (
                          <span className="ml-2">{item.title}</span>
                        )}
                        {isCollapsed && (
                          <span className="absolute left-12 m-2 w-auto min-w-max origin-left scale-0 rounded-md bg-white p-2 text-xs font-bold text-gray-700 shadow-md transition-all duration-100 group-hover:scale-100">
                            {item.title}
                          </span>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />

        <SidebarFooter>
          <SidebarMenu>
            <Button
              className="focus:outline-none group z-50 flex transform cursor-pointer items-center gap-x-2 rounded-sm bg-red-400/90 py-2 pl-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out hover:scale-105 hover:bg-red-400 hover:fill-current hover:text-white"
              // onClick={() => handleLogout()}
              type="button"
            >
              <SignOut size={26} />
              {!isCollapsed && (
                <span className="ml-2">Sair</span>
              )}
              {isCollapsed && (
                <span className="absolute left-12 m-2 w-auto min-w-max origin-left scale-0 rounded-md bg-white p-2 text-xs font-bold text-gray-700 shadow-md transition-all duration-100 group-hover:scale-100">
                  Sair
                </span>
              )}
            </Button>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarTrigger onClick={() => setIsCollapsed(!isCollapsed)} className={cn("z-50 mt-6 p-2", isCollapsed ? "ml-2" : "ml-4")} />
    </div>
  )
}
