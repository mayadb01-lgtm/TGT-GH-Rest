import { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

const EntryFormModal = ({ isOpen, row, onClose, onSave }) => {
  const [formData, setFormData] = useState(row);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
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
        <TextField
          label="Type"
          name="type"
          fullWidth
          margin="normal"
          value={formData?.type || ""}
          onChange={handleChange}
        />
        <TextField
          label="Mode of Payment"
          name="modeOfPayment"
          fullWidth
          margin="normal"
          value={formData?.modeOfPayment || ""}
          onChange={handleChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: "16px" }}
        >
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default EntryFormModal;
