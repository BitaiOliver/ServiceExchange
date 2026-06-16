import './Header.css';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider';

export function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuth();

  return (
    <div className="header">
      <div className="header_container">
        <div className="header_logo">
          <img src="/src/assets/react.svg" alt="Logo" className="header_logo-img" onClick={() => navigate('/')} />
        </div>
        <div className="header_text" onClick={() => navigate('/')}>
          BursaDeConstructii
        </div>
        <div className="header_search">
          <input
            type="text"
            className="header_search-input"
            placeholder="Search..."
          />
        </div>
        <div className="header_login">
          {user ? (
            <>
              <button className="header_login-btn" onClick={() => navigate('/articles/new')}>
                Create Article
              </button>
              <button className="header_login-btn" onClick={() => navigate('/my-articles')}>
                My Articles
              </button>
              <span className="header_user-email">{user.email}</span>
              <button
                className="header_login-btn"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="header_login-btn"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}



