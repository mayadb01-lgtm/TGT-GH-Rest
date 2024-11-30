import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === form.email && u.password === form.password
    );

    if (user) {
      alert("Login successful!");
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <Box p={4} maxWidth={400} mx="auto">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField
        name="email"
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
      >
        Login
      </Button>
    </Box>
  );
};

export default LoginPage;
