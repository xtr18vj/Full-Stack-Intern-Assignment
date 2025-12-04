import React, { useState, useEffect } from 'react';
import { authorsApi } from '../../services/api';
import type { Author } from '../../types';
import { useAuth } from '../../context/AuthContext';
import '../Pages.css';

const Authors: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState({ name: '', bio: '' });

  useEffect(() => {
    fetchAuthors();
  }, [search]);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await authorsApi.getAll(search || undefined);
      setAuthors(response.data);
    } catch {
      setError('Failed to fetch authors');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingAuthor) {
        await authorsApi.update(editingAuthor.id, formData);
        setSuccess('Author updated successfully');
      } else {
        await authorsApi.create(formData);
        setSuccess('Author created successfully');
      }
      resetForm();
      fetchAuthors();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setFormData({ name: author.name, bio: author.bio || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this author?')) return;

    try {
      await authorsApi.delete(id);
      setSuccess('Author deleted successfully');
      fetchAuthors();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingAuthor(null);
    setFormData({ name: '', bio: '' });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>✍️ Authors</h1>
        {isAuthenticated && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Author
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Search */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search authors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Author Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingAuthor ? 'Edit Author' : 'Add New Author'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  minLength={2}
                />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  placeholder="Author biography..."
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAuthor ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Authors List */}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : authors.length === 0 ? (
        <div className="empty-state">
          <h3>No authors found</h3>
          <p>Add your first author to get started</p>
        </div>
      ) : (
        <div className="cards-grid">
          {authors.map((author) => (
            <div key={author.id} className="card">
              <div className="card-header">
                <h3 className="card-title">{author.name}</h3>
                <span className="badge badge-info">{author._count?.books || 0} books</span>
              </div>
              <div className="card-content">
                <p>{author.bio || 'No biography available'}</p>
              </div>
              {isAuthenticated && (
                <div className="card-actions">
                  <button className="btn btn-sm btn-outline" onClick={() => handleEdit(author)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(author.id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Authors;
