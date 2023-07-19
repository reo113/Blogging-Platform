import { useContext } from "react";
import { Link, Outlet, useNavigation, redirect, Form } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import classNames from "classnames";
import { AuthContext } from "../contexts/AuthContext";

function Root() {

  const { currentUser, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const outletClasses = classNames(
    "mx-auto max-w-4xl sm:px-12 px-4 transition-opacity",
    {
      "opacity-100": navigation.state !== "loading",
      "opacity-50": navigation.state === "loading",
    }
  );
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    alert("You have been logged out");
    redirect("/login");
  };
  return (
    <div>
      <nav className="bg-blue-900 h-14 flex items-center justify-between">
        <h2 className="flex items-center">
          <Link className="text-2xl flex items-center gap-1 px-2 text-white" to="/">
            <FaHome />
            @Blog
          </Link>
        </h2>
        <div className="flex items-center pr-2">
        <Link to="/login" className="text-lg text-white flex items-center gap-1 px-2">
                  Login
                </Link>
          {currentUser ?(
          <Form method="post" onSubmit={handleLogout}>
            <button type="submit" className="text-white text-lg bg-red-500 hover:bg-red-600 rounded px-4 py-2">
              Logout
            </button>
          </Form>
          ):(
            <>
            <Link className="text-white text-lg flex items-center gap-1 px-2" to="/signup">
                Signup
              </Link>
             </>
              )}
        </div>
      </nav>
      <div className={outletClasses}>
        <Outlet />
      </div>
    </div>
  );
}

export default Root;
