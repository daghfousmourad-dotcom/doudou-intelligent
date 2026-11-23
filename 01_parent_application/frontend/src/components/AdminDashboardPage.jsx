import React, { useState, useEffect } from 'react';
import { 
  Upload, Book, LogOut, CheckCircle, AlertTriangle, 
  Sparkles, FileText, PlusCircle, RefreshCw
} from 'lucide-react';

export default function AdminDashboardPage({ adminData, onLogout }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Upload form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [summary, setSummary] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/server/books');
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des livres. Vérifiez la Gateway.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Veuillez sélectionner un fichier (.txt ou .pdf)');
      return;
    }

    setUploading(true);
    setMessage('');
    setError('');

    // Prepare Multipart Form Data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('summary', summary);
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8080/api/server/books/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(`Livre "${title}" téléversé avec succès ! ID attribué : ${data.bookId}`);
        // Reset form
        setTitle('');
        setAuthor('');
        setSummary('');
        setSelectedFile(null);
        // Refresh catalog list
        fetchBooks();
      } else {
        setError(data.message || 'Une erreur est survenue lors de l\'upload.');
      }
    } catch (err) {
      console.error(err);
      setError('Erreur réseau. Assurez-vous que la Gateway et le Server Service sont lancés.');
    } finally {
      setUploading(false);
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
        // Refresh catalog
        fetchBooks();
      }
    } catch (err) {
      alert('Impossible de lancer l\'indexation.');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Header */}
      <header className="glass-panel" style={{
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%)',
            padding: '10px',
            borderRadius: '12px',
            color: 'white'
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Espace Administrateur</h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>
              Connecté en tant que : <strong>{adminData.parent.email}</strong>
            </p>
          </div>
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
      </header>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '450px 1fr',
        gap: '30px'
      }}>
        
        {/* Left Side: Upload Form */}
        <aside className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PlusCircle size={22} style={{ color: 'var(--secondary)' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Ajouter un Nouveau Conte</h3>
          </div>
          
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>
            Le conte textuel sera découpé en chunks de 50 mots et indexé sémantiquement à la demande.
          </p>

          {message && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#a7f3d0',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle size={18} style={{ color: 'var(--success)' }} />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#fca5a5',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={18} style={{ color: 'var(--danger)' }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Titre de l'histoire</label>
              <input 
                type="text" 
                className="input-field" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Ex: Le Vilain Petit Canard"
                required 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Auteur</label>
              <input 
                type="text" 
                className="input-field" 
                value={author} 
                onChange={(e) => setAuthor(e.target.value)} 
                placeholder="Ex: Hans Christian Andersen"
                required 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Résumé / Description</label>
              <textarea 
                className="input-field" 
                rows="3"
                value={summary} 
                onChange={(e) => setSummary(e.target.value)} 
                placeholder="Description succinte pour le parent..."
                style={{ resize: 'none', fontFamily: 'inherit' }}
                required 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Fichier du Conte (.txt ou .pdf sur SSD)</label>
              <div style={{
                border: '1px dashed var(--border-glass)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.01)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}>
                <input 
                  type="file" 
                  accept=".txt,.pdf" 
                  onChange={handleFileChange}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <FileText size={32} style={{ color: selectedFile ? 'var(--primary)' : '#64748b', marginBottom: '8px' }} />
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
                  {selectedFile ? selectedFile.name : 'Cliquez pour sélectionner un fichier (TXT, PDF)'}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>Format .txt ou .pdf requis (illustrations prises en charge)</p>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={uploading}
              style={{
                marginTop: '10px',
                background: 'linear-gradient(135deg, var(--secondary) 0%, #ec4899 100%)',
                boxShadow: '0 4px 14px 0 rgba(236, 72, 153, 0.35)'
              }}
            >
              <Upload size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              {uploading ? 'Téléversement en cours...' : 'Téléverser le Conte'}
            </button>
          </form>
        </aside>

        {/* Right Side: Catalogue List */}
        <main className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Catalogue de Livres</h2>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', marginTop: '2px' }}>
                Liste des contes et état de leur vectorisation RAG dans l'écosystème.
              </p>
            </div>
            <button onClick={fetchBooks} className="btn-secondary" style={{ padding: '8px', borderRadius: '10px' }}>
              <RefreshCw size={16} />
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>Chargement...</div>
          ) : (
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
                  gap: '20px'
                }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '12px',
                      borderRadius: '12px',
                      color: 'var(--secondary)'
                    }}>
                      <Book size={24} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0' }}>{book.title}</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>ID: {book.id} | Par {book.author}</p>
                      <p style={{ margin: '8px 0 0 0', fontSize: '0.88rem', color: '#cbd5e1' }}>{book.summary}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', flexShrink: 0 }}>
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

                    {book.status === 'NOT_INDEXED' && (
                      <button
                        onClick={() => handleIndexBook(book.id)}
                        className="btn-primary"
                        style={{
                          padding: '8px 14px',
                          borderRadius: '10px',
                          fontSize: '0.8rem',
                          background: 'linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)',
                          boxShadow: 'none'
                        }}
                      >
                        Lancer l'Indexation RAG
                      </button>
                    )}
                    
                    {book.status === 'INDEXED' && (
                      <button
                        onClick={() => handleIndexBook(book.id)}
                        className="btn-secondary"
                        style={{
                          padding: '8px 14px',
                          borderRadius: '10px',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          background: 'rgba(255, 255, 255, 0.03)',
                          color: '#cbd5e1'
                        }}
                      >
                        <RefreshCw size={14} />
                        <span>Ré-indexer</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
