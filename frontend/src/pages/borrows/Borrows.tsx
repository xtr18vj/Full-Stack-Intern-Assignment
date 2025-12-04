import React, { useState, useEffect } from 'react';
import { borrowsApi, booksApi, usersApi } from '../../services/api';
import type { Borrow, Book, User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import '../Pages.css';

const Borrows: React.FC = () => {
  const { isAuthenticated, user: currentUser } = useAuth();
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [includeReturned, setIncludeReturned] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ userId: 0, bookId: 0, dueAt: '' });

  useEffect(() => {
    if (isAuthenticated) {
      fetchBorrows();
      fetchBooks();
      fetchUsers();
    }
  }, [includeReturned, isAuthenticated]);

  const fetchBorrows = async () => {
    try {
      setLoading(true);
      const response = await borrowsApi.getAll(includeReturned);
      setBorrows(response.data);
    } catch {
      setError('Failed to fetch borrowings');
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await booksApi.getAll({ available: true, limit: 100 });
      setBooks(response.data.data);
    } catch {
      console.error('Failed to fetch books');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await usersApi.getAll();
      setUsers(response.data);
    } catch {
      console.error('Failed to fetch users');
    }
  };

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await borrowsApi.borrow({
        userId: formData.userId,
        bookId: formData.bookId,
        dueAt: formData.dueAt || undefined,
      });
      setSuccess('Book borrowed successfully');
      resetForm();
      fetchBorrows();
      fetchBooks();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Borrow failed');
    }
  };

  const handleReturn = async (borrowId: number) => {
    try {
      setError('');
      await borrowsApi.return(borrowId);
      setSuccess('Book returned successfully');
      fetchBorrows();
      fetchBooks();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Return failed');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({ userId: 0, bookId: 0, dueAt: '' });
  };

  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  };

  const isOverdue = (dueAt: string, returnedAt?: string) => {
    if (returnedAt) return false;
    return new Date(dueAt) < new Date();
  };

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>Access Denied</h3>
          <p>Please login to view borrowings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📖 Borrowings</h1>
        <button className="btn btn-primary" onClick={() => {
          setFormData({ ...formData, dueAt: getDefaultDueDate() });
          setShowForm(true);
        }}>
          + Borrow Book
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Filters */}
      <div className="filters">
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={includeReturned}
            onChange={(e) => setIncludeReturned(e.target.checked)}
          />
          Show returned books
        </label>
      </div>

      {/* Borrow Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Borrow a Book</h2>
            <form onSubmit={handleBorrow}>
              <div className="form-group">
                <label>User</label>
                <select
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: Number(e.target.value) })}
                  required
                >
                  <option value={0}>Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Book</label>
                <select
                  value={formData.bookId}
                  onChange={(e) => setFormData({ ...formData, bookId: Number(e.target.value) })}
                  required
                >
                  <option value={0}>Select Book</option>
                  {books.filter(b => b.available > 0).map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} ({book.available} available)
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={formData.dueAt}
                  onChange={(e) => setFormData({ ...formData, dueAt: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Borrow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Borrows List */}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : borrows.length === 0 ? (
        <div className="empty-state">
          <h3>No borrowings found</h3>
          <p>Borrow a book to get started</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>User</th>
                <th>Borrowed</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((borrow) => (
                <tr key={borrow.id}>
                  <td>{borrow.book?.title}</td>
                  <td>{borrow.user?.name}</td>
                  <td>{new Date(borrow.borrowedAt).toLocaleDateString()}</td>
                  <td>{new Date(borrow.dueAt).toLocaleDateString()}</td>
                  <td>
                    {borrow.returnedAt ? (
                      <span className="badge badge-success">Returned</span>
                    ) : isOverdue(borrow.dueAt) ? (
                      <span className="badge badge-danger">Overdue</span>
                    ) : (
                      <span className="badge badge-warning">Borrowed</span>
                    )}
                  </td>
                  <td>
                    {!borrow.returnedAt && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleReturn(borrow.id)}
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* My Borrowed Books Section */}
      {currentUser && (
        <div style={{ marginTop: '2rem' }}>
          <h2>My Borrowed Books</h2>
          <MyBorrowedBooks userId={currentUser.id} />
        </div>
      )}
    </div>
  );
};

// Sub-component for user's borrowed books
const MyBorrowedBooks: React.FC<{ userId: number }> = ({ userId }) => {
  const [myBorrows, setMyBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBorrows();
  }, [userId]);

  const fetchMyBorrows = async () => {
    try {
      const response = await borrowsApi.getByUser(userId, false);
      setMyBorrows(response.data);
    } catch {
      console.error('Failed to fetch user borrows');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (myBorrows.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '1rem' }}>
        <p>You have no borrowed books</p>
      </div>
    );
  }

  return (
    <div className="cards-grid">
      {myBorrows.map((borrow) => (
        <div key={borrow.id} className="card">
          <h3 className="card-title">{borrow.book?.title}</h3>
          <div className="card-content">
            <p><strong>Borrowed:</strong> {new Date(borrow.borrowedAt).toLocaleDateString()}</p>
            <p><strong>Due:</strong> {new Date(borrow.dueAt).toLocaleDateString()}</p>
            {new Date(borrow.dueAt) < new Date() && (
              <span className="badge badge-danger">Overdue!</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Borrows;
