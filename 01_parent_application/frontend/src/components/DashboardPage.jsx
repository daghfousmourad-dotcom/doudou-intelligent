import React, { useState, useEffect, useRef } from 'react';
import { 
  Book, User, ShieldAlert, Wifi, Battery, HardDrive, 
  LogOut, CheckCircle, AlertTriangle, Play, Sparkles, Languages
} from 'lucide-react';

export default function DashboardPage({ parentData, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Real-time toy status from WebSockets
  const [toyStatus, setToyStatus] = useState({
    status: 'OFFLINE',
    currentBook: 'Aucun',
    currentPage: 0,
    battery: 100,
    storage: 0
  });
  
  const [alerts, setAlerts] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef(null);

  // Fetch initial profile & catalog data
  const fetchData = async () => {
    try {
      // 1. Fetch user/child profile
      const profRes = await fetch('http://localhost:8080/api/users/profile?parentId=1');
      if (profRes.ok) {
        const profData = await profRes.json();
        setProfile(profData);
        // Set initial toy details from profile data
        setToyStatus(prev => ({
          ...prev,
          status: profData.toy.status,
          battery: profData.toy.batteryLevel,
          storage: profData.toy.storageUsedPercent
        }));
      }

      // 2. Fetch server books list
      const booksRes = await fetch('http://localhost:8080/api/server/books');
      if (booksRes.ok) {
        const booksData = await booksRes.json();
        setBooks(booksData);
      }
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des données. Vérifiez la Gateway.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // 3. Connect to real-time WebSockets through the gateway
    connectWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const connectWebSocket = () => {
    const wsUrl = 'ws://localhost:8083/ws/toy'; // Direct connection to Toy Service for stability
    console.log('[DASHBOARD WS] Connecting to:', wsUrl);
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[DASHBOARD WS] Connected!');
      setWsConnected(true);
      setToyStatus(prev => ({ ...prev, status: 'ONLINE' }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[DASHBOARD WS] Received event:', data);

        if (data.type === 'READING_PAGE') {
          setToyStatus(prev => ({
            ...prev,
            status: 'ONLINE',
            currentBook: data.bookTitle,
            currentPage: data.page
          }));
        } else if (data.type === 'CHILD_QUESTION') {
          setToyStatus(prev => ({
            ...prev,
            status: 'INTERACTIVE',
            currentBook: data.bookTitle
          }));
        } else if (data.type === 'TOXICITY_ALERT') {
          setToyStatus(prev => ({
            ...prev,
            status: 'ALERT'
          }));
          
          // Add new safety alert to state list
          const newAlert = {
            id: Date.now(),
            text: data.text,
            severity: data.severity,
            time: new Date().toLocaleTimeString()
          };
          setAlerts(prev => [newAlert, ...prev]);
        }
      } catch (e) {
        console.warn('[DASHBOARD WS] Non-JSON message:', event.data);
      }
    };

    ws.onclose = () => {
      console.log('[DASHBOARD WS] Disconnected.');
      setWsConnected(false);
      setToyStatus(prev => ({ ...prev, status: 'OFFLINE' }));
      // Retry connection after 5 seconds
      setTimeout(connectWebSocket, 5000);
    };
  };

  const handleToggleBook = async (bookId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/server/books/toggle?bookId=${bookId}`, {
        method: 'POST'
      });
      if (res.ok) {
        // Refresh catalog list
        fetchData();
      }
    } catch (err) {
      alert('Impossible d\'associer le livre. Vérifiez la Gateway.');
    }
  };

  const handleIndexBook = async (bookId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/server/books/index?bookId=${bookId}`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        alert(data.message);
        // Refresh catalog list
        fetchData();
      }
    } catch (err) {
      alert('Impossible de lancer l\'indexation.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Chargement du Dashboard...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Top Header */}
      <header className="glass-panel" style={{
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            padding: '10px',
            borderRadius: '12px',
            color: 'white'
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Dashboard Conteur IA</h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>
              Parent connecté : <strong>{parentData.parent.name}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* WebSocket Status Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: wsConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${wsConnected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            padding: '8px 14px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            color: wsConnected ? '#a7f3d0' : '#fecaca',
            fontWeight: 500
          }}>
            <Wifi size={16} />
            <span>{wsConnected ? 'Liaison temps réel active' : 'Liaison interrompue'}</span>
          </div>

          <button onClick={onLogout} className="btn-secondary" style={{
            padding: '8px 16px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem'
          }}>
            <LogOut size={16} />
            <span>Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Grid Dashboard */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '350px 1fr',
        gap: '30px'
      }}>
        
        {/* Left Side: Child profile and Toy State */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Child Card */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} /> Profil de l'Enfant
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Prénom :</span>
                <span style={{ fontWeight: 600 }}>{profile?.child?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Âge :</span>
                <span style={{ fontWeight: 600 }}>{profile?.child?.age} ans</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8' }}>Langue Active :</span>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Languages size={14} /> {profile?.child?.language.toUpperCase()} (Français)
                </span>
              </div>
            </div>
          </div>

          {/* Toy State Card */}
          <div className={`glass-panel ${toyStatus.status === 'ALERT' ? 'alert-pulse' : ''}`} style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Play size={18} /> État Physique du Jouet
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* State Badge */}
              <div style={{
                padding: '12px',
                borderRadius: '12px',
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
                background: 
                  toyStatus.status === 'ALERT' ? 'rgba(239, 68, 68, 0.2)' :
                  toyStatus.status === 'INTERACTIVE' ? 'rgba(245, 158, 11, 0.2)' :
                  toyStatus.status === 'ONLINE' || toyStatus.status === 'READING' ? 'rgba(16, 185, 129, 0.2)' :
                  'rgba(100, 116, 139, 0.2)',
                color:
                  toyStatus.status === 'ALERT' ? '#fca5a5' :
                  toyStatus.status === 'INTERACTIVE' ? '#fde68a' :
                  toyStatus.status === 'ONLINE' || toyStatus.status === 'READING' ? '#a7f3d0' :
                  '#cbd5e1',
                border: `1px solid ${
                  toyStatus.status === 'ALERT' ? 'rgba(239, 68, 68, 0.3)' :
                  toyStatus.status === 'INTERACTIVE' ? 'rgba(245, 158, 11, 0.3)' :
                  toyStatus.status === 'ONLINE' || toyStatus.status === 'READING' ? 'rgba(16, 185, 129, 0.3)' :
                  'rgba(100, 116, 139, 0.3)'
                }`
              }}>
                {toyStatus.status === 'ALERT' && '⚠️ ALERTE SÉCURITÉ DE L\'ENFANT'}
                {toyStatus.status === 'INTERACTIVE' && '✨ DIALOGUE IA EN COURS'}
                {toyStatus.status === 'ONLINE' && '📖 PRÊT À LIRE'}
                {toyStatus.status === 'OFFLINE' && '📴 JOUET ÉTEINT / OFFLINE'}
              </div>

              {/* Status details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Livre en cours :</span>
                  <span style={{ fontWeight: 600 }}>{toyStatus.currentBook}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Page active :</span>
                  <span style={{ fontWeight: 600 }}>{toyStatus.currentPage > 0 ? `Page ${toyStatus.currentPage}` : 'Aucune'}</span>
                </div>
                
                {/* Hardware indicators */}
                <hr style={{ border: '0', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Battery size={16} /> Batterie :
                  </span>
                  <span style={{ fontWeight: 600 }}>{toyStatus.battery}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <HardDrive size={16} /> Stockage :
                  </span>
                  <span style={{ fontWeight: 600 }}>{toyStatus.storage}% utilisé</span>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Alerts Logs */}
          <div className="glass-panel" style={{ padding: '24px', flex: '1', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} /> Journal d'Alertes
            </h3>
            
            {alerts.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem', padding: '20px 0' }}>
                Aucune alerte de sécurité. Le jouet est sain.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeights: '220px' }}>
                {alerts.map(alert => (
                  <div key={alert.id} style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.15)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f87171', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={14} /> DANGER {alert.severity}
                      </span>
                      <span style={{ color: '#94a3b8', fontWeight: 400 }}>{alert.time}</span>
                    </div>
                    <p style={{ margin: 0, color: '#fca5a5' }}>
                      Mots détectés : <em>"{alert.text}"</em>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </aside>

        {/* Right Side: Books Catalog and Indexing */}
        <main className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>Catalogue & Association de Livres</h2>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
              Associez des livres au jouet de votre enfant ou lancez l'indexation RAG en arrière-plan.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {books.map(book => (
              <div key={book.id} style={{
                background: 'rgba(255, 255, 255, 0.015)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '20px',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    background: book.associatedToToy ? 'rgba(91, 124, 250, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${book.associatedToToy ? 'rgba(91, 124, 250, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                    padding: '12px',
                    borderRadius: '12px',
                    color: book.associatedToToy ? 'var(--primary)' : '#64748b'
                  }}>
                    <Book size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0' }}>{book.title}</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Par {book.author}</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: '#cbd5e1' }}>{book.summary}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 }}>
                  {/* Indexation status badge */}
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background:
                      book.status === 'INDEXED' ? 'rgba(16, 185, 129, 0.1)' :
                      book.status === 'INDEXING' ? 'rgba(245, 158, 11, 0.1)' :
                      'rgba(239, 68, 68, 0.1)',
                    color:
                      book.status === 'INDEXED' ? '#34d399' :
                      book.status === 'INDEXING' ? '#fbbf24' :
                      '#fca7a7'
                  }}>
                    {book.status === 'INDEXED' && '✓ INDEXÉ RAG'}
                    {book.status === 'INDEXING' && '⚙ EN COURS...'}
                    {book.status === 'NOT_INDEXED' && '✗ NON INDEXÉ'}
                  </span>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {/* Indexing button for not-indexed books */}
                    {book.status === 'NOT_INDEXED' && (
                      <button 
                        onClick={() => handleIndexBook(book.id)} 
                        className="btn-secondary" 
                        style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '0.8rem' }}
                      >
                        Lancer l'Indexation RAG
                      </button>
                    )}

                    {/* Toggle association button */}
                    {book.status === 'INDEXED' && (
                      <button
                        onClick={() => handleToggleBook(book.id)}
                        className={book.associatedToToy ? 'btn-primary' : 'btn-secondary'}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '10px',
                          fontSize: '0.85rem',
                          minWidth: '150px',
                          background: book.associatedToToy ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${book.associatedToToy ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                          color: book.associatedToToy ? '#34d399' : 'white',
                          boxShadow: 'none'
                        }}
                      >
                        {book.associatedToToy ? '★ Associé au Jouet' : 'Associer au Jouet'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
