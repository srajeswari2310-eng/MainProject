import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../assets/logo.png';
import { logout } from '../feature/userSlice';

const NavBar = ({ onScrollToAbout, onScrollToHow, onScrollToPrice }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { currentUser } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const isHomePage = location.pathname.endsWith("/home");
  const isAdmin = currentUser?.role === "admin";

  // 🔗 Navigation Links
  const navLinks = [
    { name: 'Home', to: '/home', type: 'link' },
    ...(isHomePage
      ? [
          { name: "About", action: onScrollToAbout, type: "button" },
          ...( !isAdmin ? [
            { name: "How It Works", action: onScrollToHow, type: "button" },
            { name: "Our Plan", action: onScrollToPrice, type: "button" },
          ] : [])
        ]
      : []),
    ...(isAdmin
      ? [{ name: 'Manage Lot', to: 'manageSlot', type: 'link' },
        { name: 'Manage Users', to: 'user', type: 'link' }

      ]
      : [
          { name: 'Contact Us', to: 'contact', type: 'link' },
          ...(currentUser?.vehicles?.length > 0
            ? [{ name: 'Find Lot', to: 'parking', type: 'link' }]
            : [{ name: 'Add Vehicle', to: 'vehicles', type: 'link' }])
        ]),
    ...(isMenuOpen
      ? [
          ...(isAdmin
            ? [{ name: "Logout", action: handleLogout, type: "button" }]
            : [
                { name: 'Profile', to: 'profile', type: 'link' },
                { name: 'Vehicles', to: 'vehicles', type: 'link' },
                { name: "Logout", action: handleLogout, type: "button" },
              ]),
        ]
      : []),
  ];

  return (
 <nav className="bg-gradient-to-r from-orange-200 via-orange-400 to-amber-500 shadow-lg p-4 sticky top-0 z-50">
  <div className="container mx-auto flex justify-between items-center">
    
    {/* Logo */}
    <Link to="/" className="flex items-center gap-2">
      <img src={logo} alt="logo" className="h-10 w-40 object-contain drop-shadow-md" />
    </Link>

    {/* Desktop Navigation */}
    <div className="hidden md:flex space-x-6">
      {navLinks.map((link, idx) =>
        link.type === 'link' ? (
          <Link
            key={idx}
            to={link.to}
            className="px-4 py-2 rounded-lg bg-white/20 text-gray-900 font-medium hover:bg-white/30 hover:text-black transition shadow-md backdrop-blur-sm"
          >
            {link.name}
          </Link>
        ) : (
          <button
            key={idx}
            onClick={link.action}
            className="px-4 py-2 rounded-lg bg-white/20 text-gray-900 font-medium hover:bg-white/30 hover:text-black transition shadow-md backdrop-blur-sm"
          >
            {link.name}
          </button>
        )
      )}
    </div>

    {/* User Dropdown */}
    {currentUser?.name && (
      <div className="hidden md:flex items-center gap-2 relative group">
        <FaUserCircle className="text-white text-2xl cursor-pointer drop-shadow" />
        <span className="font-semibold text-white cursor-pointer">{currentUser.name}</span>
        <div className="absolute top-full right-0 mt-2 w-40 bg-white shadow-lg rounded-lg opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-200 ease-in-out z-50">
          <ul className="flex flex-col text-gray-700">
            {!isAdmin && (
              <>
                <li>
                  <Link to="profile" className="block px-4 py-2 hover:bg-orange-100">Profile</Link>
                </li>
                <li>
                  <Link to="vehicles" className="block px-4 py-2 hover:bg-orange-100">Vehicles</Link>
                </li>
              </>
            )}
            <li>
              <button onClick={handleLogout} className="block px-4 py-2 hover:bg-orange-100 w-full text-left">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    )}

    {/* Mobile Toggle */}
    <div className="md:hidden">
      <button onClick={toggleMenu} className="text-white hover:text-gray-200 focus:outline-none">
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </div>
  </div>

  {/* Mobile Menu */}
  {isMenuOpen && (
    <div className="md:hidden mt-4 flex flex-col gap-2 w-[80%] mx-auto transition-all duration-300 ease-in-out">
      {navLinks.map((link, idx) =>
        link.type === 'link' ? (
          <Link
            key={idx}
            to={link.to}
            onClick={() => setIsMenuOpen(false)}
            className="px-4 py-2 rounded-lg bg-white/20 text-gray-900 text-center font-medium hover:bg-white/30 hover:text-black transition shadow-md backdrop-blur-sm"
          >
            {link.name}
          </Link>
        ) : (
          <button
            key={idx}
            onClick={() => {
              link.action();
              setIsMenuOpen(false);
            }}
            className="px-4 py-2 rounded-lg bg-white/20 text-gray-900 font-medium hover:bg-white/30 hover:text-black transition shadow-md backdrop-blur-sm"
          >
            {link.name}
          </button>
        )
      )}
    </div>
  )}
</nav>



  );
};

export default NavBar;
