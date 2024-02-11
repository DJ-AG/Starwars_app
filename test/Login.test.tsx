import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider } from '../src/context/authContext';
import { MemoryRouter } from 'react-router-dom';
import Login from '../src/pages/Login/Login';

describe('Login component with MemoryRouter', () => {
  test('renders correctly and allows user input', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    // Check for input fields
    const usernameInput = screen.getByLabelText(
      /username/i
    ) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      /password/i
    ) as HTMLInputElement;

    // Simulate user typing
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    // Check values
    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password');

    // Check for the presence of the login button
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
