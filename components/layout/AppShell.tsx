"use client"

import * as React from "react"

import { AuthProvider } from "@/components/auth/AuthProvider"
import AppNavbar from "@/components/layout/AppNavbar"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { PanelLeftIcon } from "lucide-react"

function SidebarToggleBadge({ className }: { className?: string }) {
  const { toggleSidebar, state } = useSidebar()

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-expanded={state === "expanded"}
      className={cn(
        "flex items-center gap-2 rounded-lg bg-sidebar px-3 py-2 text-sm font-semibold text-sidebar-foreground transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-accent text-sidebar-foreground">
        <PanelLeftIcon className="size-4" />
      </div>
      <div className="hidden flex-col leading-tight sm:flex">
        <span className="truncate">IAdvisor</span>
        <span className="text-xs font-normal text-sidebar-foreground/70">
          Conseil agricole
        </span>
      </div>
      <span className="sr-only">
        {state === "collapsed" ? "Agrandir la barre latérale" : "Réduire la barre latérale"}
      </span>
    </button>
  )
}

type AppShellProps = {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <AppSidebar />
        </Sidebar>
        <SidebarInset>
          <div className="flex min-h-svh flex-col">
            <AppNavbar leading={<SidebarToggleBadge />} />
            <div className="flex-1 overflow-hidden">
              <main className="h-full overflow-y-auto p-4 md:p-6">
                {children}
              </main>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  )
}


