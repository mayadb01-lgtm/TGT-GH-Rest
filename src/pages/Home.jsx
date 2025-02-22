import { Stack, Typography, Paper } from "@mui/material";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {
  const { isAdminAuthenticated, admin } = useSelector((state) => state.admin);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const services = [
    {
      path: isAdminAuthenticated ? "/admin/hotel" : "/hotel",
      title: "Hotel Management",
      bg: "#fec86a",
    },
    {
      path: isAdminAuthenticated ? "/admin/restaurant" : "/restaurant",
      title: "Restaurant Management",
      bg: "#ff6a6a",
    },
    // Add more services as needed
  ];

  return (
    <Stack
      spacing={4}
      sx={{
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f4f4f9",
      }}
    >
      {/* Welcome Section */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ textAlign: "center" }}
      >
        {isAdminAuthenticated || isAuthenticated ? (
          <Typography variant="h5">
            Welcome, {isAdminAuthenticated ? admin?.name : user?.name}!
          </Typography>
        ) : (
          <Typography variant="h5">Welcome!</Typography>
        )}
      </Stack>
      <Typography variant="body1" color="text.secondary">
        Welcome to the TGT Business Management System. Choose a service to
        manage your operations efficiently.
      </Typography>

      {/* Service Cards */}
      {services.map((service, index) => (
        <Paper
          key={index}
          elevation={4}
          sx={{
            p: 4,
            width: "90%",
            maxWidth: "600px",
            borderRadius: 4,
            textAlign: "center",
            bgcolor: service.bg,
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Link
            to={service.path}
            style={{ textDecoration: "none", color: "inherit" }}
            onClick={() => {
              toast.promise(
                new Promise((resolve) => setTimeout(resolve, 500)),
                {
                  loading: "Redirecting...",
                  success: `Welcome to the ${service.title} page!`,
                  error: `Error accessing the ${service.title} page.`,
                }
              );
            }}
          >
            <Typography variant="h4" gutterBottom>
              {service.title}
            </Typography>
          </Link>
        </Paper>
      ))}
    </Stack>
  );
};

export default Home;
