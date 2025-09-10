import { describe, test, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { replaceMock, pushMock, getClientMock, listSessionsMock, updateSessionMock, setSessionMock, getSessionApiMock } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  pushMock: vi.fn(),
  getClientMock: vi.fn(),
  listSessionsMock: vi.fn(),
  updateSessionMock: vi.fn(),
  setSessionMock: vi.fn(),
  getSessionApiMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock, push: pushMock }),
  useSearchParams: () => ({ get: (k: string) => (k === 'clientId' ? 'c1' : null) }),
}));

vi.mock('@/components/auth/AuthProvider', () => ({
  useAuth: () => ({ user: { uid: 'u1', displayName: 'Tech C', email: 'tc@example.com' }, loading: false }),
}));

vi.mock('@/lib/firebase', () => ({
  getClientById: (...args: unknown[]) => getClientMock(...args),
  listSessionsForClient: (...args: unknown[]) => listSessionsMock(...args),
  updateClientSessionDoc: (...args: unknown[]) => updateSessionMock(...args),
  setClientSessionDoc: (...args: unknown[]) => setSessionMock(...args),
}));

vi.mock('@/lib/hooks', async () => {
  const actual = await vi.importActual<typeof import('@/lib/hooks')>('@/lib/hooks');
  return {
    ...actual,
    useApiClient: () => ({
      createSession: async () => ({ id: 's-new' }),
      createSessionWithId: async () => ({ id: 's-new' }),
      listSessions: async () => [],
      getSession: async (id: string) => getSessionApiMock(id),
    }),
  };
});

import SessionsPage from './page';

describe('SessionsPage', () => {
  beforeEach(() => {
    replaceMock.mockReset();
    pushMock.mockReset();
    getClientMock.mockReset();
    listSessionsMock.mockReset();
    updateSessionMock.mockReset();
    setSessionMock.mockReset();
    getSessionApiMock.mockReset?.();
  });

  test('redirects to /welcome if no user', async () => {
    vi.doMock('@/components/auth/AuthProvider', () => ({ useAuth: () => ({ user: null, loading: false }) }));
    const { default: Page } = await import('./page');
    render(<Page />);
    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/welcome'));
  });

  test('refresh lists sessions and toggles report status', async () => {
    getClientMock.mockResolvedValueOnce({ id: 'c1', name: 'Client X' });
    listSessionsMock.mockResolvedValueOnce([
      { id: 's1', is_report_done: false },
      { id: 's2', is_report_done: false },
    ]);
    getSessionApiMock.mockImplementation(async (id: string) => (id === 's2' ? { id: 's2', state: { RapportDeSortie: {} } } : { id }));
    render(<SessionsPage />);

    // Wait for listing
    expect(await screen.findByText(/vos visites/i)).toBeInTheDocument();
    expect(await screen.findByText('s1')).toBeInTheDocument();
    expect(await screen.findByText('s2')).toBeInTheDocument();
    // s2 should show "Rapport disponible"
    expect(await screen.findAllByText(/rapport disponible/i)).toHaveLength(1);
    // Firestore should be updated for s2
    await waitFor(() => expect(updateSessionMock).toHaveBeenCalled());
  });

  test('startVisit creates session and navigates to realtime page', async () => {
    getClientMock.mockResolvedValueOnce({ id: 'c1', name: 'Client X' });
    listSessionsMock.mockResolvedValueOnce([]);
    render(<SessionsPage />);
    const startButton = await screen.findByRole('button', { name: /commencer une visite/i });
    await userEvent.click(startButton);
    await waitFor(() => expect(setSessionMock).toHaveBeenCalledWith('u1', 'c1', 's-new', expect.objectContaining({ nom_tc: expect.any(String), nom_agri: 'Client X', is_report_done: false })));
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/session/s-new?clientId=c1'));
  });
});


