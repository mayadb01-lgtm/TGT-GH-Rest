import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const EntryFormModal = ({ isOpen, row, onClose, onSave }) => {
  const [formData, setFormData] = useState(row);

  // Update formData when the row prop changes
  useEffect(() => {
    setFormData(row);
  }, [row]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    setFormData(null);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          p: 4,
          boxShadow: 24,
        }}
      >
        <TextField
          label="Room No"
          name="roomNo"
          fullWidth
          margin="normal"
          value={formData?.roomNo || ""}
          disabled
        />
        <TextField
          label="Rate"
          name="rate"
          fullWidth
          margin="normal"
          value={formData?.rate || ""}
          onChange={handleChange}
        />
        <TextField
          label="No of People"
          name="noOfPeople"
          fullWidth
          margin="normal"
          value={formData?.noOfPeople || ""}
          onChange={handleChange}
        />

        {/* Type Selection List */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            label="Type"
            name="type"
            value={formData?.type || ""}
            onChange={handleChange}
          >
            <MenuItem value="Employee">Employee</MenuItem>
            <MenuItem value="Tourist">Tourist</MenuItem>
            <MenuItem value="Family">Family</MenuItem>
            <MenuItem value="NRI">NRI</MenuItem>
          </Select>
        </FormControl>

        {/* Mode of Payment Selection List */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Mode of Payment</InputLabel>
          <Select
            label="Mode of Payment"
            name="modeOfPayment"
            value={formData?.modeOfPayment || ""}
            onChange={handleChange}
          >
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="Online">Online</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="UnPaid">UnPaid</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: "16px" }}
        >
          Save
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onClose}
          style={{ marginTop: "16px", marginLeft: "16px" }}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default EntryFormModal;
