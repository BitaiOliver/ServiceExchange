import "./Footer.css"

export function Footer() {
  return (
    <footer>
      <div className='footer'>
        <div className='footer_container'>
          <div className="footer_logo">
            <img src="/src/assets/react.svg" alt="Logo" className="footer_logo-img" />
          </div>
          <div className="footer_text">
            BursaDeConstructii
          </div>
        </div>
      </div>
    </footer>
  );
}
