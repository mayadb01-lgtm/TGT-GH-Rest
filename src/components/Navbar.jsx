import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions/userAction";
import { logoutAdmin } from "../redux/actions/adminAction";
import { ThemeSwitcher } from "@toolpad/core";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);
  const { isAdminAuthenticated } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const handleLogout = () => {
    if (isAuthenticated) dispatch(logoutUser());
    if (isAdminAuthenticated) dispatch(logoutAdmin());
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks =
    isAuthenticated || isAdminAuthenticated ? (
      <>
        {isAdminAuthenticated && (
          <Button color="inherit" component={Link} to="/dashboard">
            Dashboard
          </Button>
        )}
        <Button color="inherit" component={Link} to="/" onClick={handleLogout}>
          Logout
        </Button>
      </>
    ) : (
      <>
        <Button color="inherit" component={Link} to="/signup">
          Signup
        </Button>
        <Button color="inherit" component={Link} to="/login">
          Login
        </Button>
      </>
    );

  const drawerLinks =
    isAuthenticated || isAdminAuthenticated ? (
      <>
        {isAdminAuthenticated && (
          <ListItem button component={Link} to="/dashboard">
            <ListItemText primary="Dashboard" />
          </ListItem>
        )}
        <ListItem button component={Link} to="/" onClick={handleLogout}>
          <ListItemText primary="Logout" />
        </ListItem>
      </>
    ) : (
      <>
        <ListItem button component={Link} to="/signup">
          <ListItemText primary="Signup" />
        </ListItem>
        <ListItem button component={Link} to="/login">
          <ListItemText primary="Login" />
        </ListItem>
      </>
    );

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: isAdminAuthenticated ? "#f44336" : "#1976d2",
        height: 40,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" component="div">
          <Link
            to="/"
            style={{ color: "white", textDecoration: "none", fontWeight: 600 }}
          >
            Guest House
          </Link>
        </Typography>
        <Stack
          direction="row"
          sx={{
            display: { xs: "none", md: "flex" },
          }}
        >
          {navLinks}
          <ThemeSwitcher />
        </Stack>
        <IconButton
          color="inherit"
          edge="start"
          sx={{
            display: { xs: "flex", md: "none" },
          }}
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: 250,
          },
        }}
      >
        <List>{drawerLinks}</List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
