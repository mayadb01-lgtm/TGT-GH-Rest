import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";

const Navbar = () => {
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
