import { useState } from "react";
import { rust_beginner_backend } from "declarations/rust-beginner-backend";

function App() {
  const [greeting, setGreeting] = useState("");
  const [sequence, setSequence] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    rust_beginner_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  }

  async function submitSequence(event) {
    event.preventDefault();
    const n = parseInt(event.target.elements.number.value);
    if (!n || n < 0) {
      setSequence("Please enter a valid number.");
      return;
    }

    try {
      // Await the result from the canister call
      const result = await rust_beginner_backend.collatz(n);
      setSequence(result.join(" → "));
    } catch (error) {
      console.error("Error calling collatz function:", error);
      setSequence("An error occurred while calculating the sequence.");
    }
  }

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      <form action="#" onSubmit={handleSubmit}>
        <label htmlFor="name">Enter your name: &nbsp;</label>
        <input id="name" alt="Name" type="text" />
        <button type="submit">Click Me!</button>
      </form>
      <section id="greeting">{greeting}</section>

      <form action="#" onSubmit={submitSequence}>
        <label htmlFor="number">Enter a number: </label>
        <input id="number" alt="Sequence" type="number" />
        <button type="submit">Calculate here!</button>
      </form>
      <section id="sequence">{sequence}</section>
    </main>
  );
}

export default App;
