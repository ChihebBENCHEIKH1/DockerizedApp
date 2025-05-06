import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [counts, setCounts] = useState({ postgres: 0, redis: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const res = await axios.get('/api/');
      setCounts(res.data);
    };
    fetchCounts();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Counter Demo  'Ignore'</h1>
      <p><strong>PostgreSQL Count:</strong> {counts.postgres}</p>
      <p><strong>Redis Count:</strong> {counts.redis}</p>
    </div>
  );
}

export default App;

