import type { Options, Styles } from "react-joyride";

export const joyrideOptions: Partial<Options> = {
  primaryColor: "#6619DE",
  backgroundColor: "#ffffff",
  textColor: "#251F2D",
  arrowColor: "#ffffff",
  overlayColor: "rgba(37, 31, 45, 0.55)",
  zIndex: 9999,
  spotlightRadius: 12,
  spotlightPadding: 8,
};

export const joyrideStyles: Partial<Styles> = {
  tooltip: {
    borderRadius: 12,
    padding: 20,
    fontFamily: "Inter, sans-serif",
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 30px rgba(102, 25, 222, 0.12)",
    maxWidth: 360,
  },
  tooltipContainer: {
    textAlign: "left",
  },
  tooltipTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#251F2D",
    margin: 0,
  },
  tooltipContent: {
    fontSize: 14,
    color: "#4B5563",
    padding: "12px 0 4px",
    lineHeight: 1.5,
  },
  tooltipFooter: {
    marginTop: 12,
  },
  buttonPrimary: {
    backgroundColor: "#6619DE",
    color: "#ffffff",
    borderRadius: 10,
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 600,
    border: "none",
    outline: "none",
  },
  buttonBack: {
    color: "#6B7280",
    fontSize: 13,
    marginRight: 8,
    backgroundColor: "transparent",
  },
  buttonSkip: {
    color: "#9CA3AF",
    fontSize: 13,
    backgroundColor: "transparent",
  },
  buttonClose: {
    color: "#9CA3AF",
    height: 12,
    width: 12,
    top: 12,
    right: 12,
  },
};
