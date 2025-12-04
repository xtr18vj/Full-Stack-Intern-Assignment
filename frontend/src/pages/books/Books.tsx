import React, { useState, useEffect } from 'react';
import { booksApi, authorsApi } from '../../services/api';
import type { Book, Author, PaginatedResponse } from '../../types';
import { useAuth } from '../../context/AuthContext';
import '../Pages.css';

const Books: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [authorFilter, setAuthorFilter] = useState<number | ''>('');
  const [availableFilter, setAvailableFilter] = useState<boolean | ''>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    description: '',
    publishedAt: '',
    quantity: 1,
    authorId: 0,
  });

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, [search, authorFilter, availableFilter, page]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = { page, limit: 10 };
      if (search) params.search = search;
      if (authorFilter) params.authorId = authorFilter;
      if (availableFilter !== '') params.available = availableFilter;

      const response = await booksApi.getAll(params as Parameters<typeof booksApi.getAll>[0]);
      const data: PaginatedResponse<Book> = response.data;
      setBooks(data.data);
      setTotalPages(data.meta.totalPages);
    } catch {
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await authorsApi.getAll();
      setAuthors(response.data);
    } catch {
      console.error('Failed to fetch authors');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingBook) {
        await booksApi.update(editingBook.id, formData);
        setSuccess('Book updated successfully');
      } else {
        await booksApi.create(formData);
        setSuccess('Book created successfully');
      }
      resetForm();
      fetchBooks();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      isbn: book.isbn,
      description: book.description || '',
      publishedAt: book.publishedAt ? book.publishedAt.split('T')[0] : '',
      quantity: book.quantity,
      authorId: book.authorId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await booksApi.delete(id);
      setSuccess('Book deleted successfully');
      fetchBooks();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingBook(null);
    setFormData({
      title: '',
      isbn: '',
      description: '',
      publishedAt: '',
      quantity: 1,
      authorId: 0,
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📚 Books</h1>
        {isAuthenticated && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Book
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          value={authorFilter}
          onChange={(e) => { setAuthorFilter(e.target.value ? Number(e.target.value) : ''); setPage(1); }}
        >
          <option value="">All Authors</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
        <select
          value={availableFilter === '' ? '' : String(availableFilter)}
          onChange={(e) => { 
            setAvailableFilter(e.target.value === '' ? '' : e.target.value === 'true'); 
            setPage(1); 
          }}
        >
          <option value="">All Availability</option>
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
      </div>

      {/* Book Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>ISBN</label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Author</label>
                <select
                  value={formData.authorId}
                  onChange={(e) => setFormData({ ...formData, authorId: Number(e.target.value) })}
                  required
                >
                  <option value={0}>Select Author</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Published Date</label>
                  <input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBook ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Books List */}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>ISBN</th>
                  <th>Author</th>
                  <th>Available</th>
                  <th>Total</th>
                  {isAuthenticated && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.isbn}</td>
                    <td>{book.author?.name}</td>
                    <td>
                      <span className={`badge ${book.available > 0 ? 'badge-success' : 'badge-danger'}`}>
                        {book.available}
                      </span>
                    </td>
                    <td>{book.quantity}</td>
                    {isAuthenticated && (
                      <td>
                        <button className="btn btn-sm btn-outline" onClick={() => handleEdit(book)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(book.id)}>
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-sm btn-outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-sm btn-outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Books;
