import { FormControl, Select } from "@mui/material";
import { paymentColors } from "../utils/utils";

const DropdownCell = ({ value, options, onChange }) => (
  <FormControl
    size="small"
    style={{
      height: "100%",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: paymentColors[value],
    }}
  >
    <Select
      native
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      style={{
        fontSize: "12px",
        padding: "0px",
        height: "100%",
        width: "100%",
        lineHeight: "normal",
        "&:hover": {
          backgroundColor: "transparent",
        },
      }}
    >
      {options.map((option) => (
        <option
          key={option}
          value={option}
          style={{
            color: option === "Select" ? "black" : "white",
            backgroundColor: paymentColors[option] || "black",
          }}
        >
          {option}
        </option>
      ))}
    </Select>
  </FormControl>
);

export default DropdownCell;
