import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Outlet,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  CalendarCheck2,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import axios from "../config/axios";

const Logo = ({ expanded }) => (
  <div className="flex items-center pb-6">
    <div className="bg-blue-500 p-2 rounded-lg">
      <svg
        width="24"
        height="24"
        viewBox="0 0 136 112"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M67.9991 0L0 111.667H135.998L67.9991 0Z" fill="#A4D8FF" />
        <path
          d="M67.9991 44.6667L33.9996 111.667H102L67.9991 44.6667Z"
          fill="#007BFF"
        />
      </svg>
    </div>
    {expanded && (
      <h1 className="text-xl font-bold text-gray-800 ml-3">BRI Finder</h1>
    )}
  </div>
);

// SearchBar Component
const SearchBar = ({ expanded, onSearch }) => (
  <div className="relative mb-4">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      type="text"
      placeholder="Search"
      className={`transition-all w-full py-2 border border-gray-200 rounded-lg bg-gray-50 ${
        expanded ? "pl-10" : "pl-9"
      }`}
      onChange={onSearch}
    />
  </div>
);

const NavItem = ({ item, expanded }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const IconComponent = item.icon;

  return (
    <Link to={item.path}>
      <li
        className={`
                    flex items-center py-3 px-3 my-1 font-medium rounded-md cursor-pointer
                    transition-colors group
                    ${
                      isActive
                        ? "bg-gradient-to-tr from-blue-500 to-blue-600 text-white shadow-md"
                        : "hover:bg-gray-100 text-gray-600"
                    }
                `}
      >
        <IconComponent size={20} />
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-40 ml-3" : "w-0"
          }`}
        >
          {item.name}
        </span>
        {item.count && expanded && (
          <div
            className={`
                        ml-auto text-xs font-semibold px-2 py-0.5 rounded-full
                        ${
                          isActive
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-200 text-gray-700"
                        }
                    `}
          >
            {item.count}
          </div>
        )}
        {!expanded && (
          <div
            className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-blue-100 text-blue-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
          >
            {item.name}
          </div>
        )}
      </li>
    </Link>
  );
};

const UserProfile = ({ expanded }) => {
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      const response = await axios.get("auth/profile");
      console.log(response.data, "response.data");
      setProfile(response.data?.data);
    } catch (error) {
      console.error("Error fetching ATM data:", error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="border-t border-gray-200 flex p-3 items-center">
      <img
        src="https://placehold.co/40x40/007BFF/FFFFFF?text=R"
        alt="User avatar"
        className="w-10 h-10 rounded-full"
      />
      <div
        className={`flex justify-between items-center overflow-hidden transition-all ${
          expanded ? "w-40 ml-3" : "w-0"
        }`}
      >
        <div className="leading-4">
          <h4 className="font-semibold text-gray-800">{profile?.name}</h4>
          <span className="text-xs text-gray-600">{profile?.email}</span>
        </div>
        <LogOut
          onClick={() => {
            localStorage.removeItem("authToken");
            navigate("/login");
            window.location.reload();
          }}
          size={20}
          className="text-gray-600 hover:text-red-500 cursor-pointer"
        />
      </div>
    </div>
  );
};

// --- Main Sidebar Component ---
const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [navItems, setNavitems] = useState([
    { name: "Lokasi", icon: LayoutDashboard, path: "/" },
    { name: "Komentar", icon: FileText, count: 5, path: "/comment" },
  ]);

  const onSearch = (e) => {
    if (e.target.value.trim() === "") {
      setNavitems([
        { name: "Lokasi", icon: LayoutDashboard, path: "/" },
        { name: "Komentar", icon: FileText, count: 5, path: "/comment" },
      ]);
    } else {
      setNavitems((prevItems) =>
        prevItems.filter((item) =>
          item.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  return (
    <aside
      className={`h-screen transition-all duration-300 ease-in-out ${
        expanded ? "w-72" : "w-20"
      }`}
    >
      <div className="h-full flex flex-col bg-white border-r border-gray-200 shadow-sm p-4">
        <div
          className={`flex items-center ${
            expanded ? "justify-between" : "justify-center"
          }`}
        >
          {expanded && <Logo expanded={expanded} />}
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <SearchBar expanded={expanded} onSearch={onSearch} />

        <nav className="flex-1">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.name} item={item} expanded={expanded} />
            ))}
          </ul>
        </nav>

        <UserProfile expanded={expanded} />
      </div>
    </aside>
  );
};

export default Sidebar;
