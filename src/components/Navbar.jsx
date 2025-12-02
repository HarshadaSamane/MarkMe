import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button,
} from "@mui/material";
import { AccountCircle, ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

function Navbar() {
  const storedUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
    handleMenuClose();
  };

  const handleUpdateProfile = () => {
    navigate("/update-profile");
    handleMenuClose();
  };

  const dashboardRoute =
    storedUser && storedUser.role === "Teacher"
      ? "/teacher-dashboard"
      : "/student-dashboard";

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ color: "inherit", textDecoration: "none", mr: 2 }}
        >
          MarkME
        </Typography>
        <Button component={Link} to="/about-us" color="inherit" sx={{ mr: 2 }}>
          About Us
        </Button>
        <Box sx={{ flexGrow: 1 }} />

        {storedUser && (
          <Button
            component={Link}
            to={dashboardRoute}
            color="inherit"
            sx={{ mr: 2 }}
          >
            {storedUser.role === "Teacher" ? "Teacher " : "Student "}Dashboard
          </Button>
        )}

        <Box sx={{ flexGrow: 1 }} />
        {storedUser ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <AccountCircle fontSize="large" />
              {open ? <ArrowDropUp /> : <ArrowDropDown />}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleUpdateProfile}>Update Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button
            component={Link}
            to="/signin"
            color="inherit"
            startIcon={<AccountCircle style={{ fontSize: 35 }} />}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
