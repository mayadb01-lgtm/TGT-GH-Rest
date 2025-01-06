import { Stack, Typography, Paper } from "@mui/material";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {
  const { isAdminAuthenticated } = useSelector((state) => state.admin);

  return (
    <Stack
      spacing={4}
      sx={{
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      {[
        {
          path: isAdminAuthenticated ? "/admin/hotel" : "/hotel",
          title: "Hotel",
          desc: "Luxurious hotels at great prices",
          bg: "#fec86a",
        },
        {
          path: isAdminAuthenticated ? "/admin/restaurant" : "/restaurant",
          title: "Restaurant",
          desc: "Dine at the finest restaurants",
          bg: "#ff6a6a",
        },
      ].map((item, index) => (
        <Paper
          key={index}
          elevation={4}
          sx={{
            p: 4,
            width: "90%",
            maxWidth: "600px",
            borderRadius: 4,
            textAlign: "center",
            bgcolor: item.bg,
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Link
            to={item.path}
            style={{ textDecoration: "none", color: "inherit" }}
            onClick={() => {
              toast.promise(
                new Promise((resolve) => setTimeout(resolve, 500)),
                {
                  loading: "Please wait...",
                  success: "Welcome to the " + item.title + " page",
                  error: "Error accessing the " + item.title + " page",
                }
              );
            }}
          >
            <Typography variant="h4" gutterBottom>
              {item.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {item.desc}
            </Typography>
          </Link>
        </Paper>
      ))}
    </Stack>
  );
};

export default Home;
