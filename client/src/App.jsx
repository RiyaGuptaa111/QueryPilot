import { useEffect, useState } from "react";
import api from "./api/api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await api.get("/test");
        setMessage(response.data.message);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    testAPI();
  }, []);

  return (
    <div>
      <h1>QueryPilot</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;