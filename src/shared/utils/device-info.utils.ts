const getBrowserName = (userAgent: string): string => {
  if (userAgent.includes("Edg/")) return "Edge";
  if (userAgent.includes("OPR/") || userAgent.includes("Opera")) return "Opera";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";
  return "Unknown browser";
};

const getOsName = (userAgent: string): string => {
  if (userAgent.includes("Windows")) return "Windows";
  if (userAgent.includes("Mac OS X")) return "macOS";
  if (userAgent.includes("Android")) return "Android";
  if (userAgent.includes("iPhone") || userAgent.includes("iPad")) return "iOS";
  if (userAgent.includes("Linux")) return "Linux";
  return "Unknown OS";
};

export const getDeviceInfo = (): string => {
  const userAgent = navigator.userAgent;
  return `${getBrowserName(userAgent)} on ${getOsName(userAgent)}`;
};