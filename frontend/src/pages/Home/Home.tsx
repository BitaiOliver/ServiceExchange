import "./Home.css"

export function Home() {

  return (
    <div className='home'>
      <div className='home_container'>
        <div className='home_content'>
          <div className='home_sidebar'>
            <h3>Categories</h3>
            <ul className='category_list'>
              <li className='category_item'>Category 1</li>
              <li className='category_item'>Category 2</li>
              <li className='category_item'>Category 3</li>
              <li className='category_item'>Category 4</li>
              <li className='category_item'>Category 5</li>
            </ul>
          </div>
          <div className='home_main'>
            <h2>Main Content</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            <button onClick={() => alert('Button clicked!')}>Click Me</button>
          </div>
        </div>
      </div>
    </div>
  );
}