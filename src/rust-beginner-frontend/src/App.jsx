import { useState } from "react";
import { rust_beginner_backend } from "declarations/rust-beginner-backend";

function App() {
  const [greeting, setGreeting] = useState("");
  const [sequence, setSequence] = useState("");
  const [loadingGreeting, setLoadingGreeting] = useState(false);
  const [loadingSequence, setLoadingSequence] = useState(false);
  const [error, setError] = useState("");

  async function handleGreet(event) {
    event.preventDefault();
    setLoadingGreeting(true);
    setError("");

    const name = event.target.elements.name.value.trim();
    if (!name) {
      setError("Please enter your name.");
      setLoadingGreeting(false);
      return;
    }

    try {
      const response = await rust_beginner_backend.greet(name);
      setGreeting(response);
    } catch (err) {
      setError("Failed to fetch greeting.");
    } finally {
      setLoadingGreeting(false);
    }
    
  }

  async function handleCollatz(event) {
    event.preventDefault();
    setLoadingSequence(true);
    setError("");

    const input = event.target.elements.number.value.trim();
    const n = parseInt(input, 10);

    if (isNaN(n) || n < 1) {
      setError("Please enter a valid number.");
      setLoadingSequence(false);
      return;
    }

    try {
      // Await the result from the canister call
      const result = await rust_beginner_backend.collatz(n);
      setSequence(result.join(" → "));
    } catch (error) {
      setSequence("An error occurred while calculating the sequence.");
    } finally {
      setLoadingSequence(false);
    }
  }

  return (
    <main style={styles.container}>
      <img src="/logo2.svg" alt="DFINITY logo" style={styles.logo} />
      
      {error && <p style={styles.error}>{error}</p>}

      {/* Greeeting section */}
      <section style={styles.section}>
        <h2>Say Hello!</h2>
        <form onSubmit={handleGreet} style={styles.form}>
          <input id="name" type="text" placeholder="Enter your name" style={styles.input} />
          <button type="submit" style={styles.button} disabled={loadingGreeting}>
            {loadingGreeting ? "Loading..." : "Greet"}
          </button>
      </form>
      {greeting && <p style={styles.result}>{greeting}</p>}
      </section>

      {/* Collatz sequence section */}
      <section style={styles.section}>
        <h2>Collatz Sequence Calculator</h2>
        <form onSubmit={handleCollatz} style={styles.form}>
          <input id="number" type="number" placeholder="Enter a number" style={styles.input} />
          <button type="submit" style={styles.button} disabled={loadingSequence}>
            {loadingSequence ? "Calculating..." : "Generate Sequence"}
          </button>
        </form>
        {sequence && <p style={styles.result}>{sequence}</p>}
      </section>
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
