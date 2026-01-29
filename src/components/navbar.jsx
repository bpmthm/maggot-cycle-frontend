import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      padding: "1rem",
      background: "#1e293b",
      color: "white"
    }}>
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
        WasteApp
      </Link>
    </nav>
  );
}
