export const socialLogin = async (idToken: string, provider: string) => {
    const res = await fetch(`http://localhost:8082/api/auth/social-login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken, provider }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error en el login social');
    return data;
};