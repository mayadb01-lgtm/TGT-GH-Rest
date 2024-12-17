import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions/userAction";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <AppBar position="static">
      <Toolbar
        style={{
          justifyContent: "space-between",
          minHeight: "auto",
          padding: "0 8px",
        }}
      >
        <Typography variant="h6" component="div">
          Guest House
        </Typography>
        <div>
          {isAuthenticated ? (
            <Stack direction="row" spacing={2}>
              <Typography variant="h6" component="div">
                Role = {user?.role === "Admin" ? "Admin" : "Employee"}
              </Typography>
              <Button
                color="inherit"
                component={Link}
                to="/"
                onClick={handleLogout}
              >
                Logout
              </Button>
              {user?.role === "Admin" && (
                <Button color="inherit" component={Link} to="/dashboard">
                  Dashboard
                </Button>
              )}
            </Stack>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
