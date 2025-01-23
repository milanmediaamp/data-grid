import { Button } from "@progress/kendo-react-buttons";
import { DateRangePicker } from "@progress/kendo-react-dateinputs"
import { Dialog } from "@progress/kendo-react-dialogs";
import { useEffect } from "react";
import { useState } from "react";


const dateRangeOptions = [
  { label: "Last 7 Days", days: 7 },
  { label: "Last 30 Days", days: 30 },
  { label: "Last 90 Days", days: 90 },
  { label: "Last Quarter", days: 90 },
  { label: "Last 180 Days", days: 180 },
  { label: "Last Year", days: 365 },
  // { label: "Year to Date", days: "ytd" },
  // { label: "All Time", days: "all" },
];

const DateSelector = ({onDateRangeChange}) => {//eslint-disable-line
  const [value, setValue] = useState({
    start: null,
    end: null,
  });
  useEffect(() => {
    onDateRangeChange(value);
  }, [value, onDateRangeChange]);
  const calculateRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    return { start, end };
  };
  const handleRangeSelection = (days) => {
    setValue(calculateRange(days));
  };
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="k-card k-rounded-md" style={{ width: "300px" }}>
      <div style={{ padding: "20px" }}>
        <h2 className="k-card-title">Date Range</h2>
        {value.start && ("Showing Data from:-")}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          look="outline"
          style={{ width: "100%", marginTop: "12px" }}
        >
          {value.start
            ? String(value.start.toLocaleDateString())
            : "Select Date Range"}
        </Button>
        {isExpanded && (
          <Dialog
            title="Select Date Range"
            onClose={() => setIsExpanded(false)}
            width={800}
          >
            <div
              style={{
                display: "flex",
                gap: "24px",
                padding: "20px",
                height: "400px",
              }}
            >
              <div style={{ flex: "1" }}>
                <h3 className="k-card-title" style={{ marginBottom: "16px" }}>
                  Select Custom Range
                </h3>
                <DateRangePicker
                  value={value}
                  onChange={(e) => setValue(e.value)}
                  format="MM/dd/yyyy"
                  style={{ width: "100%" }}
                  show={true}
                />
              </div>
              <div
                style={{
                  borderLeft: "1px solid #e0e0e0",
                  paddingLeft: "24px",
                  width: "240px",
                }}
              >
                <h3 className="k-card-title" style={{ marginBottom: "16px" }}>
                  Preset Ranges
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {dateRangeOptions.map((option) => (
                    <Button
                      key={option.label}
                      onClick={() => handleRangeSelection(option.days)}
                      look="flat"
                      style={{
                        justifyContent: "flex-start",
                        padding: "8px 16px",
                        width: "100%",
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default DateSelector