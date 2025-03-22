import { useState, useEffect } from "react";
import { rust_beginner_backend } from "declarations/rust-beginner-backend";

function App() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [sequence, setSequence] = useState("");
  const [ranking, setRanking] = useState([]);

  async function submitNumber(event) {
    event.preventDefault();
    const n = parseInt(number);
    if (!n || n < 1) {
      setSequence("Please enter a valid positive number.");
      return;
    }

    try {
      await rust_beginner_backend.submit_number(name, n);
      const updatedRanking = await rust_beginner_backend.get_ranking();
      setRanking(updatedRanking);
    } catch (error) {
      console.error("Error submitting number:", error);
    }
  }

  useEffect(() => {
    async function fetchRanking() {
      try {
        const rankingData = await rust_beginner_backend.get_ranking();
        setRanking(rankingData);
      } catch (error) {
        console.error("Error fetching ranking:", error);
      }
    }
    fetchRanking();
  }, []);

  return (
    <main style={{ textAlign: "center", padding: "20px" }}>
      <h1>Collatz Ranking Challenge</h1>
      
      <form onSubmit={submitNumber} style={{ marginBottom: "20px" }}>
        <label>
          Name: 
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Number: 
          <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} required />
        </label>
        <button type="submit">Submit</button>
      </form>

      <h2>Leaderboard</h2>
      <table border="1" style={{ margin: "0 auto", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Sequence Length</th>
            <th>Sequence</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map(([username, length, seq], index) => (
            <tr key={index}>
              <td>{username}</td>
              <td>{length}</td>
              <td>{seq.join(" → ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

const styles = {
  container: { textAlign: "center", fontFamily: "Arial, sans-serif", padding: "20px" },
  logo: { width: "100px", marginBottom: "20px" },
  section: { marginBottom: "30px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" },
  form: { display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" },
  input: { padding: "8px", fontSize: "16px", borderRadius: "5px", border: "1px solid #aaa", width: "200px" },
  button: { padding: "10px 15px", fontSize: "16px", cursor: "pointer", border: "none", backgroundColor: "#007bff", color: "#fff", borderRadius: "5px" },
  buttonDisabled: { opacity: 0.5, cursor: "not-allowed" },
  result: { fontSize: "18px", fontWeight: "bold", color: "#333" },
  error: { color: "red", fontSize: "14px", marginBottom: "10px" },
};

export default App;
