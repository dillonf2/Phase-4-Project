

import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = ({ isLoggedIn, handleLogout }) => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink exact to="/" activeClassName="active">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" activeClassName="active">
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" activeClassName="active">
            Projects
          </NavLink>
        </li>
        {isLoggedIn ? (
          <>
          <li>
              <NavLink to="/claim-ownership" activeClassName="active">
                Claim Ownership
              </NavLink>
            </li>
            <li>
              <NavLink to="/leave-review" activeClassName="active">
                Leave a Review
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-reviews" activeClassName="active">
                My Reviews
              </NavLink>
            </li>
            <li>
              <NavLink to="/submit-project" activeClassName="active">
                Submit a Project
              </NavLink>
            </li>
            <li>
              <NavLink to="/logout" activeClassName="active" onClick={handleLogout}>
                Logout
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login" activeClassName="active">
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" activeClassName="active">
                Sign Up
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
