import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar style={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component="div"
          style={{ textAlign: "center" }}
        >
          Guest House
        </Typography>
        <div>
          <Button color="inherit" component={Link} to="/signup">
            Signup
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/profile">
            Profile
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
