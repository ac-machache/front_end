"use client"

import * as React from "react"

import { AuthProvider } from "@/components/auth/AuthProvider"
import AppNavbar from "@/components/layout/AppNavbar"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

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
            <AppNavbar leading={<SidebarTrigger />} />
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


