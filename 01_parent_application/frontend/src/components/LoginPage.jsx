import React, { useState } from 'react';
import { Mail, Lock, ShieldAlert, CheckCircle } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Appel direct au microservice Spring Boot RESTful (Port 8080)
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Callback avec informations de session sécurisée
        onLoginSuccess(data);
      } else {
        setError(data.message || 'Identifiants invalides ou service indisponible.');
      }
    } catch (err) {
      console.error(err);
      setError('Impossible de joindre le backend Spring Boot (port 8080).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '40px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 style={{
            margin: 0,
            fontSize: '2.2rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Jouet Conteur IA
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>
            Espace Parent - Contrôle & Paramétrage
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#fca5a5',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>
              Adresse Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} />
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} />
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '10px' }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '12px',
          fontSize: '0.85rem',
          color: '#94a3b8',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <span style={{ fontWeight: 600, color: '#e2e8f0' }}>Accès de Démonstration (Rôles) :</span>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Rôle PARENT :</span><br/>
            <span>Email : <strong>test@test.com</strong> / Pass : <strong>test</strong></span>
          </div>
          <div>
            <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>Rôle ADMIN (Upload SSD) :</span><br/>
            <span>Email : <strong>admin@admin.com</strong> / Pass : <strong>admin</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
