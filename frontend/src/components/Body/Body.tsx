import axios from "axios";
import "./Body.css"
import { useState } from "react";


export function Body() {

  const [FruitArray, setFruitArray] = useState([]);

  const fetchApi = async () => {
    const response = await axios.get("http://localhost:8080/api");
    setFruitArray(response.data.fruits);
  };


  return (
    <footer>
      <div className='body'>
        <div className='body_container'>
          <button className="body-button" onClick={fetchApi}> testApi </button>
          {
            FruitArray.map( (fruit, index) =>
              <div key={index}> {fruit} </div>
              )
          }
        </div>
      </div>
    </footer>
  );
}