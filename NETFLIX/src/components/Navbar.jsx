import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between p-4 z-[100] w-full absolute">
      <Link to="/">
        <h1 className="text-red-600 text-4xl font-bold cursor-pointer">
          NETFLIX
        </h1>
      </Link>
      <div>
        <NavLink to="/account" activeClassName="text-red-600">
          <button className="text-white pr-4">Account</button>
        </NavLink>
        <button className="bg-red-600 px-6 py-2 rounded cursor-pointer text-white">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
