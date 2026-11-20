/** Example automation events shown as notification pills over the pine panels. */
export type Notification = { text: string; tag: string };

export const notifications: Notification[] = [
  { text: "New lead from Instagram → assigned to Ritesh", tag: "3s" },
  { text: "Salary slips generated for 42 staff", tag: "auto" },
  { text: "Low stock → supplier notified", tag: "09:12" },
  { text: "Invoice sent on WhatsApp", tag: "09:41" },
  { text: "Daily report ready", tag: "08:00" },
];
