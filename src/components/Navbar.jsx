import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions/userAction";
import { logoutAdmin } from "../redux/actions/adminAction";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isAdminAuthenticated, admin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const handleLogout = () => {
    if (isAuthenticated) dispatch(logoutUser());
    if (isAdminAuthenticated) dispatch(logoutAdmin());
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
          {isAuthenticated || isAdminAuthenticated ? (
            <Stack direction="row" spacing={2}>
              <Typography variant="h6" component="div">
                Role = {user?.role.toUpperCase() || admin?.role.toUpperCase()}
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
