// components/Sidebar.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Use styled-components to define styled elements
const SidebarContainer = styled.aside`
  width: 250px;
  height: 100vh;
  background-color: #f0f0f0;
  padding: 20px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #333;
  display: block;
  padding: 10px 0;
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <nav>
        <ul>
          <li><StyledLink to="/">Home</StyledLink></li>
          <li><StyledLink to="/about">About</StyledLink></li>
          <li><StyledLink to="/contact">Contact</StyledLink></li>
          {/* Add more navigation links as needed */}
        </ul>
      </nav>
    </SidebarContainer>
  );
};

export default Sidebar;
