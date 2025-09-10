import { describe, test, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Hoisted spies so mocks can reference them
const { replaceMock, pushMock, listClientsMock, addClientMock } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  pushMock: vi.fn(),
  listClientsMock: vi.fn(),
  addClientMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock, push: pushMock }),
}));

vi.mock('@/components/auth/AuthProvider', () => ({
  useAuth: () => ({ user: { uid: 'u1', email: 'u@example.com' }, loading: false }),
}));

vi.mock('@/lib/firebase', () => ({
  listClientsForUser: (...args: unknown[]) => listClientsMock(...args),
  addClientForUser: (...args: unknown[]) => addClientMock(...args),
}));

// Import the component under test after mocks
import ClientsPage from './page';

describe('ClientsPage', () => {
  beforeEach(() => {
    replaceMock.mockReset();
    pushMock.mockReset();
    listClientsMock.mockReset();
    addClientMock.mockReset();
  });

  test('redirects to /welcome when not authenticated', async () => {
    vi.doMock('@/components/auth/AuthProvider', () => ({ useAuth: () => ({ user: null, loading: false }) }));
    const { default: Page } = await import('./page');
    render(<Page />);
    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/welcome'));
  });

  test('lists clients for current user', async () => {
    listClientsMock.mockResolvedValueOnce([
      { id: 'c1', name: 'Alice Farm', email: 'alice@farm.com', notes: 'VIP' },
      { id: 'c2', name: 'Bob Ranch', email: 'bob@ranch.com' },
    ]);
    render(<ClientsPage />);
    expect(await screen.findByText('Vos clients')).toBeInTheDocument();
    expect(await screen.findByText('Alice Farm')).toBeInTheDocument();
    expect(screen.getByText('Bob Ranch')).toBeInTheDocument();
    // Clicking "Voir les visites" uses a Link; ensure it renders
    expect(screen.getByRole('link', { name: /voir les visites/i })).toBeInTheDocument();
  });

  test('adds a client and refreshes list', async () => {
    listClientsMock
      .mockResolvedValueOnce([]) // initial
      .mockResolvedValueOnce([{ id: 'c3', name: 'New Client', email: 'new@client.com' }]); // after add
    addClientMock.mockResolvedValueOnce('c3');
    render(<ClientsPage />);

    const name = await screen.findByLabelText(/nom/i);
    const email = screen.getByLabelText(/e‑mail/i);
    const notes = screen.getByLabelText(/notes/i);
    await userEvent.type(name as HTMLInputElement, 'New Client');
    await userEvent.type(email as HTMLInputElement, 'new@client.com');
    await userEvent.type(notes as HTMLInputElement, 'note');

    await userEvent.click(screen.getByRole('button', { name: /ajouter/i }));

    await waitFor(() => expect(addClientMock).toHaveBeenCalledWith('u1', { name: 'New Client', email: 'new@client.com', notes: 'note' }));
    await screen.findByText('New Client');
  });
});


