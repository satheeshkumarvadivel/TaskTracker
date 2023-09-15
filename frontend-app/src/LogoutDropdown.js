import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'

const LogoutDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Perform logout logic here
    navigate('/');
  };

  const dropdownStyles = {
      position: 'relative',
    };

  const menuStyles = {
        position: 'absolute',
      };

  return (
    <div className="dropdown-container" style={dropdownStyles}>
      <a
      className="dropdown-toggle"
      role="button"
      aria-expanded={isOpen ? 'true' : 'false'}
      onClick={toggleDropdown}
      >
      {JSON.parse(localStorage.getItem("user")).fname}
      </a>

      {isOpen && (
              <ul className="menu" style={menuStyles}>
                <li className="menu-item">
                  <a className="dropdown-item" role="button" style={{ textDecoration: 'none !important', position: 'relative', left: -50, backgroundColor: 'aliceblue'  }} onClick={handleLogout}>
                              Logout
                            </a>
                </li>
              </ul>
            )}
    </div>
  );
};

export default LogoutDropdown;
