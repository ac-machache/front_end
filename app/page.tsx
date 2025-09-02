"use client";
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Config, Session } from '@/lib/types';
import { useLocalStorage, useApiClient } from '@/lib/hooks';
import Link from 'next/link';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export default function Home() {
  const [config, setConfig] = useLocalStorage<Config>('app-config', { scheme: 'ws', host: 'localhost', port: '8080', appName: 'app', userId: 'user', sessionId: '' });
  const [environment, setEnvironment] = useLocalStorage<'local' | 'cloud'>('app-environment', 'local');
  const [apiResult, setApiResult] = useState<Session[] | null>(null); // Sessions list or other API responses
  const [isCreating, setIsCreating] = useState(false);
  const [isListing, setIsListing] = useState(false);
  const [sessionsCurrentPage, setSessionsCurrentPage] = useState(1);
  const [createFields, setCreateFields] = useState({ nom_tc: '', nom_agri: '' });
  const sessionsPerPage = 5;

  const apiClient = useApiClient(config);

  const handleApiResponse = (title: string, data: Session[] | Session | null) => {
    if (!data) return;
    if (Array.isArray(data)) {
      setApiResult(data);
    } else {
      setApiResult(prev => (prev ? [...prev, data] : [data]));
    }
    if (title.startsWith('Create Session') && 'id' in data && data.id) {
      setConfig(prev => ({ ...prev, sessionId: data.id }));
    }
  };

  const create = async (fields: { nom_tc?: string; nom_agri?: string }) => {
    setIsCreating(true);
    try {
      const result = await apiClient.createSession({ nom_tc: fields.nom_tc || '', nom_agri: fields.nom_agri || '' }) as Session | null;
      handleApiResponse('Create Session (Auto-ID)', result);
      if (result?.id) {
        const updated = await apiClient.listSessions();
        handleApiResponse('Session List', updated);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const formatTs = (ts?: string) => {
    if (!ts) return 'N/A';
    const n = typeof ts === 'string' ? parseFloat(ts) : Number(ts);
    if (!isFinite(n)) return ts;
    const d = new Date(n * 1000);
    return d.toLocaleString();
  };

  // Keep config in sync with environment selection
  React.useEffect(() => {
    setConfig(prev => {
      if (environment === 'local') {
        // For local, we don't need host/port as we use the proxy.
        // Set sane defaults, but they won't be used for the URL.
        const next = { ...prev, scheme: 'ws' as const, host: 'localhost', port: '8080', appName: 'app' };
        return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
      }
      // For cloud, set a default port but allow user to override host.
      const next = { ...prev, scheme: 'wss' as const, port: '443', appName: 'app' };
      return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
    });
  }, [environment, setConfig]);

  return (
    <div className="container max-w-6xl p-4">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Label>Nom TC</Label>
                <Input id="nom_tc" placeholder="e.g. Jean Dupont" className="mt-1" onChange={(e) => setCreateFields(prev => ({ ...prev, nom_tc: e.target.value }))} />
              </div>
              <div>
                <Label>Nom Agri</Label>
                <Input id="nom_agri" placeholder="e.g. Marie Martin" className="mt-1" onChange={(e) => setCreateFields(prev => ({ ...prev, nom_agri: e.target.value }))} />
              </div>
              <Button className="w-full" disabled={isCreating} onClick={() => create(createFields)}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isCreating ? 'Creating...' : 'Create'}
              </Button>
              <Button className="w-full" disabled={isListing} onClick={async () => {
                setIsListing(true);
                try {
                  const data = await apiClient.listSessions();
                  handleApiResponse('Session List', data);
                } finally {
                  setIsListing(false);
                }
              }}>
                {isListing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isListing ? 'Listing...' : 'List Sessions'}
              </Button>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" className="w-full">Configuration</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Configuration</DrawerTitle>
                    <DrawerDescription>
                      Configure your connection settings.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="environment">Environment</Label>
                          <select id="environment" name="environment" value={environment} onChange={(e) => setEnvironment(e.target.value as 'local' | 'cloud')} className="mt-1 block w-full bg-background border border-input rounded-md px-3 py-2 text-sm">
                            <option value="local">Local (Proxied)</option>
                            <option value="cloud">Cloud Run</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="userId">User ID</Label>
                          <Input id="userId" value={config.userId} onChange={(e) => setConfig(prev => ({ ...prev, userId: e.target.value }))} className="mt-1" />
                        </div>
                      </div>
                      {environment === 'cloud' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cloudHost">Cloud Run Host</Label>
                            <Input id="cloudHost" placeholder="your-service-xxxx-xx.run.app" value={config.host} onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))} className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="cloudPort">Port</Label>
                            <Input id="cloudPort" value={config.port} onChange={(e) => setConfig(prev => ({ ...prev, port: e.target.value }))} className="mt-1" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.isArray(apiResult) && apiResult.length > 0 ? (
                apiResult
                  .slice(
                    (sessionsCurrentPage - 1) * sessionsPerPage,
                    sessionsCurrentPage * sessionsPerPage
                  )
                  .map((s: Session) => (
                    <div key={s.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                      <span className="font-mono text-sm truncate">{formatTs(s.lastUpdateTime) !== 'N/A' ? formatTs(s.lastUpdateTime) : s.id}</span>
                      <Link href={`/session/${s.id}`} passHref>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-muted-foreground">No sessions loaded. Click &quot;List Sessions&quot;.</p>
              )}
            </div>
            {Array.isArray(apiResult) && apiResult.length > sessionsPerPage && (
              <div className="flex justify-between mt-4">
                <Button
                  onClick={() => setSessionsCurrentPage(p => Math.max(1, p - 1))}
                  disabled={sessionsCurrentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setSessionsCurrentPage(p => Math.min(Math.ceil(apiResult.length / sessionsPerPage), p + 1))}
                  disabled={sessionsCurrentPage === Math.ceil(apiResult.length / sessionsPerPage)}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
