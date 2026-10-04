// Privacy-first analytics helper
// Only fires if GA ID is present AND user gave explicit cookie consent

export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>
) => {
  if (typeof window === "undefined") return;

  const consent = localStorage.getItem("blindspot_cookie_consent");
  if (consent !== "accepted") return;

  const win = window as any;
  if (typeof win.gtag === "function") {
    // NEVER track sensitive decision text
    win.gtag("event", eventName, params);
  }
};
