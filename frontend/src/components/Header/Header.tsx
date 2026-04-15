import './Header.css';

export function Header() {
  return (
    <div className="header">
      <div className="header_container">
        <div className="header_logo">
          <img src="/src/assets/react.svg" alt="Logo" className="header_logo-img" />
        </div>
        <div className="header_text">
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
          <button className="header_login-btn">Login</button>
        </div>
      </div>
    </div>
  );
}



