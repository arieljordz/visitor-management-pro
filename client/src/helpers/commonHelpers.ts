//commonHelper.ts
// ---------------------------
// Helper functions
// ---------------------------
export const toLocalDatetimeString = (utcDate?: string) => {
  if (!utcDate) return "";
  const date = new Date(utcDate);
  const tzOffset = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - tzOffset);
  return local.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
};

export const toUTCISOString = (localDate: string) => {
  const date = new Date(localDate);
  return date.toISOString();
};

// Format full date & time in PH time
export const formatDateTimePH = (date?: string | Date | null) => {
  if (!date) return "-";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "-"; // invalid date

  return new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila", // force PH timezone
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
};

// Format date only in PH time
export const formatDatePH = (date?: string | Date | null) => {
  if (!date) return "-";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";

  return new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila", // force PH timezone
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
};

export const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "status-success";
    case "declined":
      return "status-destructive";
    case "pending":
      return "status-warning";
    default:
      return "status-muted";
  }
};
