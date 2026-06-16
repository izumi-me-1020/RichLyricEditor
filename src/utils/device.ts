function isDesktopOperatingSystem(): boolean {
  if (typeof navigator === "undefined") return false;

  const navigatorWithUaData = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };
  const uaDataPlatform =
    typeof navigatorWithUaData.userAgentData?.platform === "string"
      ? navigatorWithUaData.userAgentData.platform
      : "";
  const platform = uaDataPlatform || navigator.platform || "";
  const userAgent = navigator.userAgent || "";

  if (/Android|iPhone|iPad|iPod|Mobile/i.test(userAgent)) return false;
  return /Win|Mac|Linux|X11/i.test(platform);
}

export { isDesktopOperatingSystem };
