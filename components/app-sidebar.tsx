"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronDown,
  Users,
} from "lucide-react"
import { HomeSolid } from "@mynaui/icons-react"

import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { UserCircleSolid, UserPlusSolid } from "@mynaui/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/AuthProvider"
import { listClientsForUser } from "@/lib/firebase"
import type { ClientRecord } from "@/lib/types"
import { ChatPlusSolid, ArchiveSolid } from "@mynaui/icons-react"

const mainNav: Array<{
  title: string
  href: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}> = [
  {
    title: "Accueil",
    href: "/workspace",
    icon: (props) => <HomeSolid {...props} />,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()
  const { user } = useAuth()
  const [clients, setClients] = React.useState<ClientRecord[]>([])
  const [isLoadingClients, setIsLoadingClients] = React.useState(false)
  const [activeClientId, setActiveClientId] = React.useState<string | null>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedClientId')
    }
    return null
  })

  // Persist activeClientId to localStorage
  React.useEffect(() => {
    if (activeClientId) {
      localStorage.setItem('selectedClientId', activeClientId)
    } else {
      localStorage.removeItem('selectedClientId')
    }
  }, [activeClientId])

  React.useEffect(() => {
    let mounted = true
    if (!user?.uid) {
      setClients([])
      setActiveClientId(null)
      return
    }

    async function loadClients() {
      if (!user) return
      setIsLoadingClients(true)
      try {
        const records = (await listClientsForUser(user.uid)) as ClientRecord[]
        if (!mounted) return
        setClients(records)
        if (records.length > 0) {
          setActiveClientId((current) => current ?? records[0].id)
        }
      } finally {
        if (mounted) {
          setIsLoadingClients(false)
        }
      }
    }

    loadClients()

    return () => {
      mounted = false
    }
  }, [user?.uid])

  const handleNavigate = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [isMobile, setOpenMobile])

  const activeClient = clients.find((client) => client.id === activeClientId) ?? null

  return (
    <>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={isLoadingClients || clients.length === 0}>
                <SidebarMenuButton className="justify-between group-data-[collapsible=icon]:hidden">
                  <div className="flex flex-col gap-0.5 text-left">
                    <span className="text-sm font-semibold leading-none">
                      {activeClient?.name ?? "Sélectionner un client"}
                    </span>
                    <span className="text-xs text-sidebar-foreground/70">
                      {activeClient?.email ?? (isLoadingClients ? "Chargement…" : "Aucun client")}
                    </span>
                  </div>
                  <ChevronDown className="size-4 opacity-60" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-(--radix-popper-anchor-width)">
                <DropdownMenuSeparator />
                {clients.length === 0 && !isLoadingClients ? (
                  <DropdownMenuItem disabled className="text-muted-foreground">
                    Aucun client disponible
                  </DropdownMenuItem>
                ) : null}
                {clients.map((client) => (
                  <DropdownMenuItem
                    key={client.id}
                    onSelect={() => setActiveClientId(client.id)}
                    className={cn(
                      "flex flex-col items-start gap-0.5",
                      client.id === activeClientId && "bg-sidebar-accent"
                    )}
                  >
                    <span className="text-sm font-medium">{client.name}</span>
                    <span className="text-xs text-muted-foreground">{client.email}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => {
                // Only highlight Accueil when exactly on /workspace, not on sub-pages
                const isActive = pathname === item.href

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.href} onClick={handleNavigate}>
                        {item.icon ? (
                          <item.icon className="size-4" />
                        ) : (
                          <Users className="size-4" />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {activeClientId && (
          <SidebarGroup>
            <SidebarGroupLabel>Client sélectionné</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={
                      pathname === `/workspace/clients/${activeClientId}` ||
                      pathname === `/workspace/clients/${activeClientId}/edit`
                    }
                    tooltip="Voir le profil du client"
                  >
                    <Link href={`/workspace/clients/${activeClientId}`} onClick={handleNavigate}>
                      <UserCircleSolid className="size-4" />
                      <span>Voir le profil</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Interactions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/workspace/sessions/new")}
                  tooltip="Nouvelle interaction"
                  disabled={!activeClientId}
                >
                  <Link
                    href={activeClientId ? `/workspace/sessions/new?clientId=${activeClientId}` : "/workspace/sessions/new"}
                    onClick={handleNavigate}
                  >
                    <ChatPlusSolid className="size-4" />
                    <span>Nouvelle interaction</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/workspace/sessions/list")}
                  tooltip="Historique des interactions"
                  disabled={!activeClientId}
                >
                  <Link
                    href={activeClientId ? `/workspace/sessions/list?clientId=${activeClientId}` : "/workspace/sessions/list"}
                    onClick={handleNavigate}
                  >
                    <ArchiveSolid className="size-4" />
                    <span>Historique</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="group-data-[collapsible=icon]:hidden space-y-3">
        <div className="space-y-3 rounded-lg border border-sidebar-border/40 bg-sidebar-accent/10 p-3">
          <div className="text-xs font-medium uppercase tracking-wide text-sidebar-foreground/70">
            Gestion des clients
          </div>
          <Separator className="bg-sidebar-border" />
          <div className="space-y-2">
            <Button
              asChild
              variant="default"
              className="w-full justify-start gap-2 rounded-full"
            >
              <Link href="/workspace/create" onClick={handleNavigate}>
                <UserPlusSolid className="h-4 w-4" />
                Créer un client
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start gap-2 rounded-full"
            >
              <Link href="/workspace/clients" onClick={handleNavigate}>
                <UserCircleSolid className="h-4 w-4" />
                Profils clients
              </Link>
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </>
  )
}


