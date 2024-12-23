import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import logo from '../assets/agri.png';  // Import logo
import { useNavigate } from 'react-router-dom';

const settings = ['My Profile', 'Logout'];

function Navbar() {
  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  // Handle opening/closing of the dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Handle actions on selecting a menu item
  const handleMenuItemClick = (setting) => {
    if (setting === 'My Profile') {
      navigate('/profile');
    } else if (setting === 'Logout') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login', { replace: true });
    }
    setDropdownOpen(false);  // Close the dropdown after selection
  };

  React.useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      navigate('/login'); // Navigate to login if there's no token
    }
  }, [navigate]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      padding: '0px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Logo Section */}
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
          
        }}
       
      >
        <div >
        <img className='cursor-pointer'  onClick={() => navigate('/')} width={'200px'} src={logo} alt="Logo" />
        </div>
      </Box>

      {/* User Profile */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title="Open settings">
          {token && (
            <IconButton
              onClick={toggleDropdown}
              sx={{ p: 0 }}  // Ensures no extra padding
            >
              <Avatar alt="User Profile" src="/static/images/avatar/2.jpg" />
            </IconButton>
          )}
        </Tooltip>

        {/* Custom Dropdown Menu */}
        {dropdownOpen && (
          <div style={{
            position: 'absolute',
            top: '50px',  // Position below the avatar icon
            right: '20px',  // Align to the right of the navbar
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
            padding: '10px',
            zIndex: 2000,
            marginTop:8,
          }}>
            {settings.map((setting) => (
              <div
                key={setting}
                style={{
                  padding: '8px 10px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background-color 0.3s',
                  marginTop:2
                }}
                onClick={() => handleMenuItemClick(setting)}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <Typography>{setting}</Typography>
              </div>
            ))}
          </div>
        )}
      </Box>
    </div>
  );
}

export default Navbar;
