import type { LoginDto } from 'dtos';

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  login: async (credentials: LoginDto): Promise<{ message: string}> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      let errorMessage = 'Can not login in.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.log(e);
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  },

  // TODO: Placeholder for logout implementation

  logout: async () => {
    // TODO: Implement logout logic(clear tokens)
    return Promise.resolve();
  },
};
