import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

const SignupPage = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(form);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! Please log in.");
  };

  return (
    <Box p={4} maxWidth={400} mx="auto">
      <Typography variant="h4" gutterBottom>
        Signup
      </Typography>
      <TextField
        name="username"
        label="Username"
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
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
        onClick={handleSignup}
      >
        Signup
      </Button>
    </Box>
  );
};

export default SignupPage;
