import { Link } from "react-router-dom";
import { AuthedUserContext } from "../../App";
import { useContext } from "react";
import {
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaSignOutAlt,
  FaPlus,
  FaCalendarAlt,
  FaHome,
  FaInfoCircle,
} from "react-icons/fa";
import "./NavBar.css";

const NavBar = ({ handleSignout }) => {
  const user = useContext(AuthedUserContext);

  return (
    <nav>
      <ul>
        <li className="welcome">Welcome, {user?.username || "Guest"}</li>

        {user && user.role === "admin" && (
          <>
            <li>
              <Link to="/admin/users">
                <FaTachometerAlt title="Dashboard" />
              </Link>
            </li>
            <li>
              <Link to="/admin/class/new">
                <FaPlus title="New Class" />
              </Link>
            </li>
            <li>
              <Link to="/admin/users/teacher">
                <FaChalkboardTeacher title="Manage Teachers" />
              </Link>
            </li>
            <li>
              <Link to="/admin/users/student">
                <FaUserGraduate title="Manage Students" />
              </Link>
            </li>
            <li>
              <Link to="/admin/class">
                <FaCalendarAlt title="List Class" />
              </Link>
            </li>
          </>
        )}

        {user && user.role === "teacher" && (
          <>
            <li>
              <Link to="/">
                <FaTachometerAlt title="My Classes" />
              </Link>
            </li>
            <li>
              <Link to="/class">
                <FaChalkboardTeacher title="Mark Attendance" />
              </Link>
            </li>
          </>
        )}

        {user && user.role === "student" && (
          <>
            <li>
              <Link to="/class">
                <FaTachometerAlt title="My Classes" />
              </Link>
            </li>
            <li>
              <Link to="/class">
                <FaCalendarAlt title="View Schedule" />
              </Link>
            </li>
          </>
        )}

        {!user && (
          <li>
            <Link to="/">
              <FaHome title="Home" />
            </Link>
          </li>
        )}

        <li>
          <Link to="/about">
            <FaInfoCircle title="About" />
          </Link>
        </li>

        {user && (
          <li>
            <Link to="" onClick={handleSignout}>
              <FaSignOutAlt title="Sign Out" />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
