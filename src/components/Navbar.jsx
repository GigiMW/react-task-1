
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-500 p-4">
      <ul className="flex space-x-4 text-white">
        <li>
          <Link to="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link to="/tasks" className="hover:underline">
            Tasks
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;