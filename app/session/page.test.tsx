import { describe, test, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SessionsPage from './page';
import * as firebase from '@/lib/firebase';
import * as AuthProvider from '@/components/auth/AuthProvider';
import * as nav from 'next/navigation';
import * as hooks from '@/lib/hooks';
import { NextRouter } from 'next/router';

vi.mock('@/lib/firebase');
vi.mock('@/components/auth/AuthProvider');
vi.mock('next/navigation');
vi.mock('@/lib/hooks');

const mockedFirebase = vi.mocked(firebase);
const mockedAuth = vi.mocked(AuthProvider);
const mockedNav = vi.mocked(nav);
const mockedHooks = vi.mocked(hooks);

describe('SessionsPage', () => {
  const mockSessions = [
    { id: '1', is_report_done: true, saved: false },
    { id: '2', is_report_done: false, saved: false },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    const pushMock = vi.fn();
    mockedNav.useRouter.mockReturnValue({ replace: vi.fn(), push: pushMock } as unknown as NextRouter);
    mockedHooks.useApiClient.mockReturnValue({
        getSession: vi.fn().mockResolvedValue({ ok: true, value: { id: 's1', state: {} } }),
        listSessions: vi.fn().mockResolvedValue([]),
        createSession: vi.fn().mockResolvedValue({ id: 's3' }),
        deleteSession: vi.fn().mockResolvedValue({ ok: true }),
        ingestSessionMemoryFor: vi.fn().mockResolvedValue({ ok: true }),
    } as unknown as ReturnType<typeof hooks.useApiClient>);
    mockedFirebase.setClientSessionDoc.mockResolvedValue();
  });

  test('renders loading state initially', () => {
    mockedAuth.useAuth.mockReturnValue({ user: null, loading: true });
    mockedNav.useSearchParams.mockReturnValue({ get: () => 'c1' } as unknown as URLSearchParams);
    render(<SessionsPage />);
    expect(screen.getByText('Chargement…')).toBeInTheDocument();
  });

  test('redirects to welcome page if not authenticated', () => {
    mockedAuth.useAuth.mockReturnValue({ user: null, loading: false });
    mockedNav.useSearchParams.mockReturnValue({ get: () => 'c1' } as unknown as URLSearchParams);
    render(<SessionsPage />);
    expect(mockedNav.useRouter().replace).toHaveBeenCalledWith('/welcome');
  });

  test('displays message if no client is selected', () => {
    mockedAuth.useAuth.mockReturnValue({ user: { uid: 'u1' }, loading: false });
    mockedNav.useSearchParams.mockReturnValue({ get: () => '' } as unknown as URLSearchParams);
    render(<SessionsPage />);
    expect(screen.getByText('Ouvrez cette page depuis vos clients (aucun client sélectionné).')).toBeInTheDocument();
  });

  test('displays sessions when authenticated and client is selected', async () => {
    mockedAuth.useAuth.mockReturnValue({ user: { uid: 'u1' }, loading: false });
    mockedNav.useSearchParams.mockReturnValue({ get: () => 'c1' } as unknown as URLSearchParams);
    mockedFirebase.getClientById.mockResolvedValue({ id: 'c1', name: 'Test Client' });
    mockedFirebase.listSessionsForClient.mockResolvedValue(mockSessions);
    const listSessionsMock = vi.fn().mockResolvedValue([
        { id: '1', state: { RapportDeSortie: {} } },
    ]);
    mockedHooks.useApiClient.mockReturnValue({
        listSessions: listSessionsMock,
    } as unknown as ReturnType<typeof hooks.useApiClient>);
    render(<SessionsPage />);
    await screen.findByText(/gérez vos sessions pour: test client/i);
    await screen.findByText(/Rapport disponible/i);
  });

  test('allows creating a new session', async () => {
    mockedAuth.useAuth.mockReturnValue({ user: { uid: 'u1' }, loading: false });
    mockedNav.useSearchParams.mockReturnValue({ get: () => 'c1' } as unknown as URLSearchParams);
    mockedFirebase.getClientById.mockResolvedValue({ id: 'c1', name: 'Test Client' });
    mockedFirebase.listSessionsForClient.mockResolvedValue(mockSessions);
    const createSessionMock = vi.fn().mockResolvedValue({ id: 's3' });
    const listSessionsMock = vi.fn().mockResolvedValue([]);
    mockedHooks.useApiClient.mockReturnValue({
        createSession: createSessionMock,
        listSessions: listSessionsMock,
    } as unknown as ReturnType<typeof hooks.useApiClient>);

    render(<SessionsPage />);
    await userEvent.click(screen.getByRole('button', { name: /commencer une visite/i }));
    await vi.waitFor(() => expect(createSessionMock).toHaveBeenCalled());
  });
});