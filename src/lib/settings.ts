import settings from "../content/pages/settings.json";

export function getSettings() {
  return settings as {
    programName: string;
    email: string;
    instagram: string;
    linkedin: string;
    waitlist: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
}
