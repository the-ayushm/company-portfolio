import "server-only";
import { siteConfig } from "@/config/site";
import { budgetOptions, labelFor, timelineOptions } from "@/config/contact";
import { errorMeta, logger } from "@/lib/utils/logger";

type InquiryForEmail = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  companyName: string | null;
  projectType: string;
  estimatedBudget: string;
  projectTimeline: string;
  description: string;
};

/** True only when every required SMTP variable is present. */
export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.NOTIFY_EMAIL_TO,
  );
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Optional: sends a notification email for a new inquiry via SMTP.
 * Never throws — a failed email must not fail the form submission
 * (the inquiry is already safely stored in PostgreSQL).
 */
export async function notifyNewInquiry(inquiry: InquiryForEmail): Promise<void> {
  if (!isEmailConfigured()) return;
  try {
    const nodemailer = await import("nodemailer");
    const port = Number(process.env.SMTP_PORT ?? 587);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });

    const rows: [string, string][] = [
      ["Name", inquiry.fullName],
      ["Email", inquiry.email],
      ["Phone / WhatsApp", inquiry.phone || "—"],
      ["Company", inquiry.companyName || "—"],
      ["Project type", inquiry.projectType],
      ["Budget", labelFor(budgetOptions, inquiry.estimatedBudget)],
      ["Timeline", labelFor(timelineOptions, inquiry.projectTimeline)],
    ];
    const adminUrl = `${siteConfig.url}/admin/inquiries/${inquiry.id}`;

    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.NOTIFY_EMAIL_TO,
      replyTo: inquiry.email,
      subject: `New project inquiry — ${inquiry.projectType} — ${inquiry.fullName}`,
      text: [...rows.map(([k, v]) => `${k}: ${v}`), "", inquiry.description, "", `Open in admin: ${adminUrl}`].join("\n"),
      html: `<div style="font-family:system-ui,sans-serif;font-size:14px;color:#111">
        <h2 style="margin:0 0 12px">New project inquiry</h2>
        <table cellpadding="6" style="border-collapse:collapse">${rows
          .map(([k, v]) => `<tr><td style="color:#666">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`)
          .join("")}</table>
        <p style="white-space:pre-wrap;border-left:3px solid #8FB514;padding-left:12px">${esc(inquiry.description)}</p>
        <p><a href="${esc(adminUrl)}">Open in admin</a></p></div>`,
    });
  } catch (err) {
    logger.error("Failed to send inquiry notification email", { inquiryId: inquiry.id, ...errorMeta(err) });
  }
}
