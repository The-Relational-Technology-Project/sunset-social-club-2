// Server-only helpers for public form submissions.
// Never import from client code — this file uses the service-role client.
import * as React from "react";
import { render } from "@react-email/render";
import { TEMPLATES } from "@/lib/email-templates/registry";
import { template as memberWelcomeTemplate, renderTokens } from "@/lib/email-templates/member-welcome";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const FROM = "Sunset Social Club <notifications@sunsetsocialclub.org>";
const REPLY_TO = "oursunsetsocialclub@gmail.com";
const SITE_NAME = "Sunset Social Club";
const SENDER_DOMAIN = "notify.sunsetsocialclub.org";
const FROM_DOMAIN = "notify.sunsetsocialclub.org";

import { adminNotifyEmails } from "./private-emails.server";

const CONTACT_INBOX = "oursunsetsocialclub@gmail.com";

async function sendAdminNotification(
  type: string,
  fields: Array<{ label: string; value: string }>,
  recipients: string[],
) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) throw new Error("RESEND_API_KEY missing");
  const template = TEMPLATES["admin-notification"];
  const templateData = { type, fields };
  const element = React.createElement(template.component, templateData);
  const html = await render(element);
  const text = await render(element, { plainText: true });
  const subject =
    typeof template.subject === "function"
      ? template.subject(templateData)
      : template.subject;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: recipients,
      reply_to: REPLY_TO,
      subject,
      html,
      text,
      tags: [{ name: "template", value: "admin-notification" }],
    }),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Resend ${res.status}: ${errBody}`);
  }
}


async function sendWelcomeEmail(email: string, firstName: string | null) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) throw new Error("RESEND_API_KEY missing");
  const { data: tpl } = await supabaseAdmin
    .from("email_templates")
    .select("subject, heading, body_markdown, cta_label, cta_url")
    .eq("slug", "member-welcome")
    .maybeSingle();
  const subjectRaw = tpl?.subject ?? (memberWelcomeTemplate.subject as string);
  const subject = renderTokens(String(subjectRaw), firstName);
  const element = React.createElement(memberWelcomeTemplate.component, {
    firstName,
    heading: tpl?.heading,
    bodyText: tpl?.body_markdown,
    ctaLabel: tpl?.cta_label,
    ctaUrl: tpl?.cta_url,
  });
  const html = await render(element);
  const text = await render(element, { plainText: true });
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: [email],
      reply_to: REPLY_TO,
      subject,
      html,
      text,
      tags: [{ name: "template", value: "member-welcome" }],
    }),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Resend ${res.status}: ${errBody}`);
  }
}

export type SubmissionInput =
  | { type: "signup"; email: string; firstName: string | null; crossStreets: string | null }
  | { type: "idea"; idea: string; name: string }
  | { type: "contact"; name: string; email: string; message: string };

export async function processSubmission(input: SubmissionInput): Promise<{ ok: true }> {
  let fields: Array<{ label: string; value: string }> = [];
  let notifyType = "";
  let welcome: { email: string; firstName: string | null } | null = null;

  if (input.type === "signup") {
    const { error } = await supabaseAdmin.from("email_signups").insert({
      email: input.email,
      first_name: input.firstName,
      cross_streets: input.crossStreets,
    });
    if (error) throw new Error(error.message);
    fields = [
      { label: "Email", value: input.email },
      { label: "First name", value: input.firstName ?? "" },
      { label: "Cross streets", value: input.crossStreets ?? "" },
    ];
    notifyType = "club member signup";
    welcome = { email: input.email, firstName: input.firstName };
  } else if (input.type === "idea") {
    const { error } = await supabaseAdmin
      .from("ideas")
      .insert({ idea: input.idea, name: input.name });
    if (error) throw new Error(error.message);
    fields = [
      { label: "Name", value: input.name },
      { label: "Idea", value: input.idea },
    ];
    notifyType = "idea submission";
  } else {
    const { error } = await supabaseAdmin
      .from("contact_messages")
      .insert({ name: input.name, email: input.email, message: input.message });
    if (error) throw new Error(error.message);
    fields = [
      { label: "Name", value: input.name },
      { label: "Email", value: input.email },
      { label: "Message", value: input.message },
    ];
    notifyType = "contact message";
  }

  const recipients =
    input.type === "contact"
      ? [...adminNotifyEmails(), CONTACT_INBOX]
      : adminNotifyEmails();
  try {
    await sendAdminNotification(notifyType, fields, recipients);
  } catch (e) {
    console.warn("admin notification failed", e);
  }

  if (welcome) {
    try {
      await sendWelcomeEmail(welcome.email, welcome.firstName);
    } catch (e) {
      console.warn("welcome email failed", e);
    }
  }

  return { ok: true };
}
