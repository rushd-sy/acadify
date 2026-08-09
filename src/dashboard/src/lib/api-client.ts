const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
    const defaultOptions: RequestInit = {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(`${API_URL}${endpoint}`, defaultOptions);

    if (response.status === 401) {
        window.location.href = '/login';
        throw new Error('Unautherized');
    }
    return response;
}