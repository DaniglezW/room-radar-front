'use client';

import React from 'react';

interface FullScreenLoaderProps {
    loading: boolean;
    message?: string;
}

export default function FullScreenLoader({ loading, message }: Readonly<FullScreenLoaderProps>) {
    if (!loading) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            textAlign: 'center',
        }}>
            <div className="loader-spinner" />
            <p style={{ marginTop: '20px', fontSize: '18px', color: '#333' }}>
                {message ?? 'Cargando, por favor espera...'}
            </p>

            <style jsx>{`
        .loader-spinner {
          border: 8px solid #f3f3f3;
          border-top: 8px solid #3498db;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
        </div>
    );
}