import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./nav.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faImage,
  faPlus,
  faSignOutAlt,
  faGamepad,
} from "@fortawesome/free-solid-svg-icons";
import logo from "./Photo.jpg";

const navItems = [
  { icon: faHome, label: "Home", path: "/Feed" },
  { icon: faGamepad, label: "Games", path: "/gamepage" },
  { icon: faPlus, label: "Create Post", path: "/createPost" },
  { icon: faUser, label: "Profile", path: "/MyProfile" },
  { icon: faSignOutAlt, label: "Log Out", path: "#" },
];

const Navigation = () => {
  const [active, setActive] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const activeItemIndex = navItems.findIndex((item) => item.path === location.pathname);
    setActive(activeItemIndex !== -1 ? activeItemIndex : 0);
  }, [location.pathname]);

  const handleNavigation = (index, path) => {
    setActive(index);
    if (path !== "#") navigate(path);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navigation">
      <div className="left-side">
        <div className="logo">
          <Link to="/feed">
            <img src={logo} alt="Logo" />
          </Link>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>
        </div>
      </div>

      <div className="right-side">
        <ul>
          {navItems.map((item, index) => (
            <li
            key={index}
            className={active === index ? "active" : ""}
            onClick={() => (item.label === "Log Out" ? handleLogout() : handleNavigation(index, item.path))}
          >
            <Link to={item.path === "#" ? "#" : item.path}>
              <FontAwesomeIcon icon={item.icon} className="icon" />
              <span className="text">{item.label}</span>
            </Link>
          </li>
          
          ))}
          <div className="indicator" style={{ left: `${active * 80 + 20}px` }}></div>
        </ul>
      </div>

      <div className="burger-menu" onClick={() => setIsBurgerOpen(!isBurgerOpen)}>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
      </div>

      {isBurgerOpen && (
        <div className={`burger-dropdown ${isBurgerOpen ? "active" : ""}`}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>
          <Link to="/feed" onClick={() => setIsBurgerOpen(false)}>Home</Link>
          <Link to="/MyProfile" onClick={() => setIsBurgerOpen(false)}>Profile</Link>
          <Link to="/createPost" onClick={() => setIsBurgerOpen(false)}>NewPost</Link>
          <Link to="/gamepage" onClick={() => setIsBurgerOpen(false)}>Games</Link>
          <Link to="/#" onClick={() => setIsBurgerOpen(false)}>Log Out</Link>
        </div>
      )}

    </nav>
  );
};

export default Navigation;
