// Pause advertising during the editorial refresh. Re-enable only after the
// AdSense account is configured to avoid anchor, vignette and auto-inserted ads.
export const advertisingEnabled =
  process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
