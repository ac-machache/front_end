import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as AuthProvider from '@/components/auth/AuthProvider';
import * as Firebase from '@/lib/firebase';
import ClientsPage from './page';

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
}));
vi.mock('@/components/auth/AuthProvider');
vi.mock('@/lib/firebase');

describe('ClientsPage', () => {
  const useAuthMock = vi.spyOn(AuthProvider, 'useAuth');
  const listClientsMock = vi.spyOn(Firebase, 'listClientsForUser');
  const addClientMock = vi.spyOn(Firebase, 'addClientForUser');

  beforeEach(() => {
    // Default mock for authenticated user
    useAuthMock.mockReturnValue({ user: { uid: 'u1', email: 'u@example.com' }, loading: false });
    addClientMock.mockResolvedValue('new-client-id');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('redirects to /welcome when not authenticated', async () => {
    // Override mock for this specific test
    useAuthMock.mockReturnValue({ user: null, loading: false });
    const { replace } = (await import('next/navigation')).useRouter();
    render(<ClientsPage />);
    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith('/welcome');
    });
  });

  test('lists clients for current user', async () => {
    const clients = [
      { id: 'c1', name: 'Alice Farm', email: 'alice@farm.com', notes: 'VIP' },
      { id: 'c2', name: 'Bob Ranch', email: 'bob@ranch.com' },
    ];
    listClientsMock.mockResolvedValue(clients);

    render(<ClientsPage />);

    // Wait for the clients to be loaded and displayed
    await waitFor(() => {
      expect(screen.getByText('Alice Farm')).toBeInTheDocument();
      expect(screen.getByText('Bob Ranch')).toBeInTheDocument();
    });

    // Check that each client card has a "Voir les visites" link
    const clientCards = screen.getAllByTestId(/client-card-/);
    expect(clientCards).toHaveLength(2);

    const aliceCard = within(screen.getByTestId('client-card-c1'));
    expect(aliceCard.getByRole('link', { name: /voir les visites/i })).toBeInTheDocument();

    const bobCard = within(screen.getByTestId('client-card-c2'));
    expect(bobCard.getByRole('link', { name: /voir les visites/i })).toBeInTheDocument();
  });

  test('adds a client and refreshes list', async () => {
    listClientsMock
      .mockResolvedValueOnce([]) // Initial empty list
      .mockResolvedValueOnce([{ id: 'c3', name: 'New Client', email: 'new@client.com' }]); // List after adding

    render(<ClientsPage />);
    const user = userEvent.setup();

    // Wait for the initial "Aucun client" message to ensure the component has loaded
    await waitFor(() => {
        expect(screen.getByText(/aucun client/i)).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /ajouter/i });
    expect(addButton).toBeInTheDocument();


    // Fill out and submit the form
    await user.type(screen.getByLabelText(/nom/i), 'New Client');
    await user.type(screen.getByLabelText(/e‑mail/i), 'new@client.com');
    await user.type(screen.getByLabelText(/notes/i), 'A note');

    await waitFor(() => {
        expect(addButton).not.toBeDisabled();
    });

    await user.click(addButton);

    // Check if the add function was called correctly
    await waitFor(() => {
      expect(addClientMock).toHaveBeenCalledWith('u1', {
        name: 'New Client',
        email: 'new@client.com',
        notes: 'A note',
      });
    });

    // Check if the list was refreshed and the new client is displayed
    await waitFor(() => {
      expect(screen.getByText('New Client')).toBeInTheDocument();
    });
  });
});


