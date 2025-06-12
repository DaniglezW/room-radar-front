'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser, registerUser } from '../lib/api';
import { LoginRequest, RegisterRequest } from '../types/Auth';
import toast from 'react-hot-toast';

interface AuthFormProps {
  type: 'login' | 'register';
}

export default function AuthForm({ type }: Readonly<AuthFormProps>) {
  const [form, setForm] = useState<LoginRequest | RegisterRequest>({
    email: '',
    password: '',
    ...(type === 'register' ? { fullName: '' } : {}),
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response =
        type === 'login'
          ? await loginUser(form as LoginRequest)
          : await registerUser(form as RegisterRequest);

      if (response.code !== 0) {
        toast.error(response.message || 'Error desconocido');
        setLoading(false);
        return;
      }

      toast.success(response.message || 'Éxito');
      setTimeout(() => {
        window.location.href = '/app';
      }, 800);
    } catch (err: any) {
      toast.error(err?.message ?? 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-8 border border-blue-100">
      <h1 className="text-2xl font-bold text-center mb-6">
        {type === 'login' ? 'Iniciar sesión' : 'Registrarse'}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {type === 'register' && (
          <input
            type="text"
            name="fullName"
            placeholder="Nombre completo"
            value={(form as RegisterRequest).fullName || ''}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-200 shadow flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            type === 'login' ? 'Iniciar sesión' : 'Registrarse'
          )}
        </button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>

      <p className="text-sm text-center mt-6">
        {type === 'login' ? (
          <>
            ¿No tienes cuenta?{' '}
            <Link href="/app/register" className="text-blue-500 hover:underline">
              Regístrate aquí
            </Link>
          </>
        ) : (
          <>
            ¿Ya tienes una cuenta?{' '}
            <Link href="/app/login" className="text-blue-500 hover:underline">
              Inicia sesión aquí
            </Link>
          </>
        )}
      </p>
    </div>
  );
}