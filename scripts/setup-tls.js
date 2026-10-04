// Setup local TLS fallback for Windows machines behind certificate proxies/antivirus
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
