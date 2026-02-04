import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        replace: vi.fn(),
        back: vi.fn(),
    }),
}));

// Mock AuthStore to avoid persistence issues in test env if needed
// But we want to test the logic, so let's mock the *hook* implementation if complex,
// or just let it run. The store uses localStorage, jsdom supports that.
// Let's rely on the real store + jsdom's localStorage.

describe('Login Page Integration', () => {
    beforeEach(() => {
        mockPush.mockClear();
        localStorage.clear();
    });

    it('renders login form correctly', () => {
        render(<LoginPage />);
        expect(screen.getByText('SGBGE')).toBeDefined();
        expect(screen.getByPlaceholderText('Usuario ID')).toBeDefined();
        expect(screen.getByPlaceholderText('••••')).toBeDefined();
        expect(screen.getByText('INGRESAR')).toBeDefined();
    });



    it('shows error on invalid credentials', async () => {
        render(<LoginPage />);

        fireEvent.change(screen.getByPlaceholderText('Usuario ID'), { target: { value: 'wronguser' } });
        fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: 'wrongpass' } });

        fireEvent.click(screen.getByText('INGRESAR'));

        await waitFor(() => {
            expect(screen.getByText(/Credenciales inválidas/i)).toBeDefined();
        });
    });

    it('redirects to dashboard on successful login', async () => {
        render(<LoginPage />);

        fireEvent.change(screen.getByPlaceholderText('Usuario ID'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '1234' } }); // Correct mock secret

        fireEvent.click(screen.getByText('INGRESAR'));

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
        });
    });
});
