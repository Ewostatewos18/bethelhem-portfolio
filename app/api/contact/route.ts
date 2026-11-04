import { NextResponse } from "next/server";
import { CONTACT_EMAIL } from "@/lib/site";

type ContactBody = {
  name?: string;
  email?: string;
  project?: string;
  message?: string;
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: Request) {
  let body: ContactBody;

  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const project = String(body.project || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !email || !project || !message) {
    return NextResponse.json({ ok: false, error: "Please fill in every field." }, { status: 400 });
  }

  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }

  if (name.length > 80 || email.length > 120 || project.length > 80 || message.length > 2000) {
    return NextResponse.json({ ok: false, error: "One of the fields is too long." }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const web3Key = process.env.WEB3FORMS_ACCESS_KEY;

  if (resendKey) {
    const from = process.env.CONTACT_FROM_EMAIL || "Bethelhem Portfolio <onboarding@resend.dev>";
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [CONTACT_EMAIL],
        reply_to: email,
        subject: `Portfolio inquiry from ${name}`,
        text: [`Name: ${name}`, `Email: ${email}`, `Need: ${project}`, "", message].join("\n"),
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1a202c">
            <h2 style="margin:0 0 12px">New portfolio inquiry</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Need:</strong> ${escapeHtml(project)}</p>
            <p style="white-space:pre-wrap;margin-top:16px">${escapeHtml(message)}</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const err = (await response.json().catch(() => null)) as { message?: string } | null;
      return NextResponse.json(
        { ok: false, error: err?.message || "Could not send the message. Try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  }

  if (web3Key) {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: web3Key,
        subject: `Portfolio inquiry from ${name}`,
        from_name: name,
        email,
        project,
        message,
        to: CONTACT_EMAIL,
      }),
    });

    const result = (await response.json().catch(() => null)) as { success?: boolean; message?: string } | null;
    if (!response.ok || !result?.success) {
      return NextResponse.json(
        { ok: false, error: result?.message || "Could not send the message. Try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    {
      ok: false,
      error: "Email is not configured yet. Add RESEND_API_KEY or WEB3FORMS_ACCESS_KEY in .env.local.",
    },
    { status: 503 }
  );
}
