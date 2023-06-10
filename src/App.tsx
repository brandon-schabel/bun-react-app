import "./index.css";

function App() {
  return (
    <div className="app" role="main">
      <article>
        <img src={"/bunlogo.svg"} alt="logo" />
        <div></div>
        <h3>Welcome to Bun!</h3>
        <div></div>
        <a href="https://bun.sh/docs" target="_blank" rel="noopener noreferrer">
          Read the docs →
        </a>
      </article>
    </div>
  );
}

export default App;
