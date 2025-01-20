import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { roomCosts } from "./utils";
import TableComponent from "../components/TableComponent";
import SummaryTable from "../components/SummaryTable";
import { useState } from "react";
import {
  setDayData,
  setExtraDayData,
  setExtraNightData,
  setNightData,
} from "../redux/actions/entryAction";
import { useSelector } from "react-redux";

export const EntryAccordion = ({
  title,
  period,
  selectedDate,
  roomCosts,
  onSubmit,
  bgColor,
  panel,
}) => {
  const [expanded, setExpanded] = useState(false);
  const handleChange = (currentPanel) => (event, isExpanded) => {
    setExpanded(isExpanded ? currentPanel : false);
  };
  return (
    <Accordion expanded={expanded === panel} onChange={handleChange(panel)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        style={{
          backgroundColor: bgColor,
          border: "1px solid #e0e0e0",
          minHeight: "0",
          height: "40px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          flex={1}
          justifyContent="space-between"
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 500, fontSize: "14px" }}
          >
            {title}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails style={{ margin: 0, padding: 0 }}>
        <TableComponent
          selectedDate={selectedDate}
          period={period}
          title={`${title} Table`}
          rowsLength={11}
          roomCosts={roomCosts}
          onSubmit={onSubmit}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export const DatePickerComponent = ({
  selectedDate,
  handleDateChange,
  isAdminAuthenticated,
}) => (
  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
    <DatePicker
      views={["year", "month", "day"]}
      value={dayjs(selectedDate, "DD-MM-YYYY")}
      onChange={handleDateChange}
      slots={{
        textField: (params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            error={false}
            helperText={null}
          />
        ),
      }}
      sx={{ "& .MuiInputBase-input": { padding: 1 } }}
      disableFuture={!isAdminAuthenticated}
      disablePast={!isAdminAuthenticated}
    />
  </LocalizationProvider>
);

export const EntrySection = () => {
  const { selectedDate } = useSelector((state) => state.entry);
  return (
    <>
      {[
        {
          title: "Day Entries",
          period: "Day",
          onSubmit: setDayData,
          bgColor: "#FAC172",
          panel: "panel1",
        },
        {
          title: "Night Entries",
          period: "Night",
          onSubmit: setNightData,
          bgColor: "#89D5C9",
          panel: "panel2",
        },
        {
          title: "Extra Day Entries",
          period: "extraDay",
          onSubmit: setExtraDayData,
          bgColor: "#FAC172",
          panel: "panel3",
        },
        {
          title: "Extra Night Entries",
          period: "extraNight",
          onSubmit: setExtraNightData,
          bgColor: "#89D5C9",
          panel: "panel4",
        },
      ].map(({ title, period, onSubmit, bgColor, panel }) => (
        <EntryAccordion
          key={title}
          title={title}
          period={period}
          selectedDate={selectedDate}
          roomCosts={roomCosts}
          onSubmit={onSubmit}
          bgColor={bgColor}
          panel={panel}
        />
      ))}
    </>
  );
};

export const SummaryGrid = ({ entries, columns, colors }) => (
  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
    <Box>
      <Stack direction="column" spacing={0.5} sx={{ padding: "4px" }}>
        {entries.map((entry, index) => (
          <SummaryTable
            key={index}
            title={entry.title}
            dayRows={entry.dayRows}
            nightRows={entry.nightRows}
            extraDayRows={entry.extraDayRows}
            extraNightRows={entry.extraNightRows}
            pendingJamaCash={entry.pendingJamaCash}
            pendingJamaCard={entry.pendingJamaCard}
            pendingJamaPPS={entry.pendingJamaPPS}
            pendingJamaPPC={entry.pendingJamaPPC}
            columns={columns}
            color={colors[entry.colorKey]}
          />
        ))}
      </Stack>
    </Box>
  </Grid>
);

export const PaymentSummary = ({
  processedEntries,
  columns,
  paymentColors,
  modeRows,
  modeColumns,
  handleEntryEdit,
  handleEntrySubmit,
  handleCancelClick,
}) => (
  <Grid size={{ xs: 12, sm: 12, md: 12, lg: 5, xl: 5 }}>
    <Grid size={{ xs: 12 }} display="flex">
      <SummaryGrid
        entries={[
          {
            title: "Cash Entries Summary",
            dayRows: processedEntries.cash.day,
            nightRows: processedEntries.cash.night,
            extraDayRows: processedEntries.cash.extraDay,
            extraNightRows: processedEntries.cash.extraNight,
            pendingJamaCash: processedEntries.cash.pendingJamaCash,
            colorKey: "Cash",
          },
          {
            title: "Card Entries Summary",
            dayRows: processedEntries.card.day,
            nightRows: processedEntries.card.night,
            extraDayRows: processedEntries.card.extraDay,
            extraNightRows: processedEntries.card.extraNight,
            pendingJamaCard: processedEntries.card.pendingJamaCard,
            colorKey: "Card",
          },
        ]}
        columns={columns}
        colors={paymentColors}
      />
      <SummaryGrid
        entries={[
          {
            title: "PPS Entries Summary",
            dayRows: processedEntries.pps.day,
            nightRows: processedEntries.pps.night,
            extraDayRows: processedEntries.pps.extraDay,
            extraNightRows: processedEntries.pps.extraNight,
            pendingJamaPPS: processedEntries.pps.pendingJamaPPS,
            colorKey: "PPS",
          },
          {
            title: "PPC Entries Summary",
            dayRows: processedEntries.ppc.day,
            nightRows: processedEntries.ppc.night,
            extraDayRows: processedEntries.ppc.extraDay,
            extraNightRows: processedEntries.ppc.extraNight,
            pendingJamaPPC: processedEntries.ppc.pendingJamaPPC,
            colorKey: "PPC",
          },
        ]}
        columns={columns}
        colors={paymentColors}
      />
    </Grid>

    <Grid size={{ xs: 12 }} display="flex">
      <SummaryGrid
        entries={[
          {
            title: "UnPaid Entries Summary",
            dayRows: processedEntries.unpaid.day,
            nightRows: processedEntries.unpaid.night,
            extraDayRows: processedEntries.unpaid.extraDay,
            extraNightRows: processedEntries.unpaid.extraNight,
            colorKey: "UnPaid",
          },
        ]}
        columns={columns}
        colors={paymentColors}
      />
      <SummaryGrid
        entries={[
          {
            title: "Revenue Summary",
            dayRows: modeRows || [],
            nightRows: [],
            extraDayRows: [],
            extraNightRows: [],
            colorKey: "Summary",
          },
        ]}
        columns={modeColumns}
        colors={paymentColors}
      />
    </Grid>

    <Grid item xs={12}>
      <Box
        sx={{ px: 2 }}
        flexDirection="row"
        display="flex"
        alignItems="center"
        gap={2}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Submit Entries
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            onClick={handleEntryEdit}
            variant="contained"
            color="secondary"
            sx={{ px: 3, "&:hover": { backgroundColor: "secondary" } }}
          >
            Edit
          </Button>
          <Button
            onClick={handleEntrySubmit}
            variant="contained"
            color="success"
            sx={{ px: 3, "&:hover": { backgroundColor: "#81c784" } }}
          >
            Submit
          </Button>
          <Button
            onClick={handleCancelClick}
            variant="contained"
            color="error"
            sx={{ px: 3, "&:hover": { backgroundColor: "#e57373" } }}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Grid>
  </Grid>
);

const accordionStyles = {
  borderBottom: "1px solid #e0e0e0",
  minHeight: "0",
  height: "40px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
};

const titleStyles = {
  fontWeight: 500,
  fontSize: "14px",
};

export const AccordionSection = ({ bgColor, title, subtitle, children }) => (
  <Accordion>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      style={{ ...accordionStyles, backgroundColor: bgColor }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        flex={1}
        justifyContent="space-between"
      >
        <Typography variant="h6" sx={titleStyles}>
          {title}
        </Typography>
        <Typography variant="h6" sx={titleStyles}>
          {subtitle}
        </Typography>
      </Stack>
    </AccordionSummary>
    <AccordionDetails style={{ margin: 0, padding: 0 }}>
      {children}
    </AccordionDetails>
  </Accordion>
);

// Loader
const GradientSpinner = styled("div")({
  width: "80px",
  height: "80px",
  border: "8px solid",
  borderColor: "rgba(255, 255, 255, 0.3) transparent transparent transparent",
  borderRadius: "50%",
  animation: "spin 1.2s linear infinite",
  background: "linear-gradient(135deg, #6e8efb, #a777e3)",
  maskImage: "radial-gradient(circle, transparent 60%, black 61%)",
  WebkitMaskImage: "radial-gradient(circle, transparent 60%, black 61%)",
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
});

const ModernLoader = ({
  userLoading,
  adminLoading,
  entryLoading,
  restEntryLoading,
}) => {
  if (userLoading || adminLoading || entryLoading || restEntryLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "transparent",
        }}
      >
        {entryLoading ? "Loading Entries..." : null}
        <GradientSpinner />
      </Box>
    );
  }
  return null;
};

export default ModernLoader;
