export const updateUserProfile = async (data: {
    fullName?: string;
    phoneNumber?: string;
    profilePicture?: string; // base64
}) => {
    const res = await fetch(`http://localhost:8082/api/user/v1`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const response = await res.json();
    if (!res.ok) throw new Error(response.message || 'Error al actualizar perfil');
    return response;
};