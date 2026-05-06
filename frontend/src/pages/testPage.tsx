import axios from "axios";
import { useState } from "react";

export function TestPage() {
  const [dbcData, setDbcData] = useState([]);

  const fetchApi2 = async () => {
    const response2 = await axios.get("http://localhost:8080/api2");
    setDbcData(response2.data);
  };

  return (
    <div className="testPage">
        <button className="body-button" onClick={fetchApi2}> testApi2 </button>
        {
        dbcData[0] && dbcData[0].map( (user, index) =>
            <div key={index}> {user.username} | {user.email} | {user.password_hash}</div>
        )
        }

    </div>
  );
}
