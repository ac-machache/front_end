import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as AuthProvider from '@/components/auth/AuthProvider';
import * as Firebase from '@/lib/firebase';
import * as Hooks from '@/lib/hooks';
import SessionsPage from './page';

// Mocks
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: (k: string) => (k === 'clientId' ? 'c1' : null),
  }),
}));
vi.mock('@/components/auth/AuthProvider');
vi.mock('@/lib/firebase');
vi.mock('@/lib/hooks');

describe('SessionsPage', () => {
  const useAuthMock = vi.spyOn(AuthProvider, 'useAuth');
  const getClientByIdMock = vi.spyOn(Firebase, 'getClientById');
  const listSessionsForClientMock = vi.spyOn(Firebase, 'listSessionsForClient');
  const updateClientSessionDocMock = vi.spyOn(Firebase, 'updateClientSessionDoc');
  const setClientSessionDocMock = vi.spyOn(Firebase, 'setClientSessionDoc');
  const useApiClientMock = vi.spyOn(Hooks, 'useApiClient');

  const mockApiClient = {
    createSession: vi.fn().mockResolvedValue({ id: 's-new' }),
    getSession: vi.fn(),
    listSessions: vi.fn(),
  };

  beforeEach(() => {
    // Default mocks for a happy path
    useAuthMock.mockReturnValue({ user: { uid: 'u1', displayName: 'Tech C' }, loading: false });
    getClientByIdMock.mockResolvedValue({ id: 'c1', name: 'Client X' });
    useApiClientMock.mockReturnValue(mockApiClient as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('redirects to /welcome if no user is authenticated', async () => {
    useAuthMock.mockReturnValue({ user: null, loading: false });
    const { replace } = (await import('next/navigation')).useRouter();
    render(<SessionsPage />);
    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith('/welcome');
    });
  });

  test('fetches and displays sessions, then updates report status', async () => {
    listSessionsForClientMock.mockResolvedValue([
      { id: 's1', is_report_done: false, nom_agri: 'Client X', nom_tc: 'Tech C' },
      { id: 's2', is_report_done: false, nom_agri: 'Client X', nom_tc: 'Tech C' },
    ]);
    mockApiClient.listSessions.mockResolvedValue([]);
    // S2 has a report ready on the backend, s1 does not.
    mockApiClient.getSession.mockImplementation(async (id: string) =>
      id === 's2' ? { id, state: { RapportDeSortie: { main_report: { title: 'Test Report' } } } } : { id, state: {} }
    );

    render(<SessionsPage />);

    // Wait for initial list render
    const card2 = await screen.findByTestId('session-card-s2');
    expect(screen.getByTestId('session-card-s1')).toBeInTheDocument();
    expect(card2).toBeInTheDocument();

    // Check that the button to check for reports is there
    const checkButton = within(card2).getByRole('button', { name: /vérifier le rapport/i });
    expect(checkButton).toBeInTheDocument();

    // Click the button and wait for the state to update
    await userEvent.click(checkButton);
    await waitFor(() => {
      expect(mockApiClient.getSession).toHaveBeenCalledWith('s2');
      expect(updateClientSessionDocMock).toHaveBeenCalledWith('u1', 'c1', 's2', { is_report_done: true });
    });

    // The UI should now show that the report is available
    expect(await within(card2).findByText(/rapport disponible/i)).toBeInTheDocument();
  });

  test('starts a new visit and navigates to the session page', async () => {
    listSessionsForClientMock.mockResolvedValue([]); // No initial sessions
    mockApiClient.listSessions.mockResolvedValue([]);
    render(<SessionsPage />);

    const startButton = await screen.findByRole('button', { name: /commencer une visite/i });
    await userEvent.click(startButton);

    await waitFor(() => {
      expect(mockApiClient.createSession).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(setClientSessionDocMock).toHaveBeenCalledWith(
        'u1',
        'c1',
        's-new',
        expect.objectContaining({
          nom_agri: 'Client X',
          nom_tc: 'Tech C',
          is_report_done: false,
        })
      );
    });

    const { push } = (await import('next/navigation')).useRouter();
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/session/s-new?clientId=c1');
    });
  });
});


