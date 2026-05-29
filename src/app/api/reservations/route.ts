import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export interface ReservationPayload {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  notes: string;
}

function validate(data: Partial<ReservationPayload>): string | null {
  if (!data.name?.trim())  return "Name is required";
  if (!data.email?.trim()) return "Email is required";
  if (!data.phone?.trim()) return "Phone is required";
  if (!data.date?.trim())  return "Date is required";
  if (!data.time?.trim())  return "Time is required";
  if (!data.guests)        return "Number of guests is required";
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(data.email)) return "Invalid email address";
  return null;
}

function restaurantEmail(d: ReservationPayload): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Inter, Arial, sans-serif; background: #f9f5ee; margin: 0; padding: 0; }
    .wrap { max-width: 560px; margin: 32px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
    .header { background: #0e0c09; padding: 28px 32px; }
    .header h1 { margin: 0; color: #fff; font-size: 22px; letter-spacing: 0.18em; text-transform: uppercase; }
    .header p  { margin: 4px 0 0; color: #d97706; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; }
    .body { padding: 28px 32px; }
    .label { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #78716c; margin-bottom: 2px; }
    .value { font-size: 15px; color: #1a1612; margin-bottom: 18px; font-weight: 600; }
    .notes { background: #fef9ee; border-left: 3px solid #d97706; padding: 10px 14px; border-radius: 4px; font-size: 13px; color: #57534e; }
    .footer { background: #f5f5f4; padding: 14px 32px; text-align: center; font-size: 11px; color: #a8a29e; }
    .badge { display: inline-block; background: #d97706; color: #fff; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>HENTAK.</h1>
      <p>Nouvelle Manipuri Cuisine</p>
    </div>
    <div class="body">
      <div class="badge">New Reservation</div>

      <div class="label">Guest Name</div>
      <div class="value">${d.name}</div>

      <div class="label">Date &amp; Time</div>
      <div class="value">${d.date} at ${d.time}</div>

      <div class="label">Party Size</div>
      <div class="value">${d.guests} guest${Number(d.guests) !== 1 ? "s" : ""}</div>

      <div class="label">Contact</div>
      <div class="value">${d.email}<br/><span style="font-weight:400;font-size:13px;color:#57534e">${d.phone}</span></div>

      ${d.notes ? `<div class="label">Special Requests</div><div class="notes">${d.notes}</div>` : ""}
    </div>
    <div class="footer">Hentak Restaurant · Imphal, Manipur · hello@hentakrestaurant.com</div>
  </div>
</body>
</html>`;
}

function guestEmail(d: ReservationPayload): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Inter, Arial, sans-serif; background: #f9f5ee; margin: 0; padding: 0; }
    .wrap { max-width: 560px; margin: 32px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
    .header { background: #0e0c09; padding: 36px 32px; text-align: center; }
    .header img { width: 60px; height: 60px; background: #fff; border-radius: 8px; padding: 4px; margin-bottom: 14px; }
    .header h1 { margin: 0; color: #fff; font-size: 26px; letter-spacing: 0.2em; text-transform: uppercase; }
    .header p  { margin: 6px 0 0; color: #d97706; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; }
    .hero { background: #fef9ee; padding: 28px 32px; text-align: center; border-bottom: 1px solid #e7e5e4; }
    .hero h2 { margin: 0 0 6px; font-size: 20px; color: #1a1612; }
    .hero p  { margin: 0; font-size: 13px; color: #57534e; }
    .body { padding: 28px 32px; }
    .row  { display: flex; gap: 16px; margin-bottom: 18px; }
    .cell { flex: 1; }
    .label { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #a8a29e; margin-bottom: 3px; }
    .value { font-size: 15px; color: #1a1612; font-weight: 600; }
    .divider { border: none; border-top: 1px solid #e7e5e4; margin: 20px 0; }
    .note { font-size: 12px; color: #78716c; line-height: 1.6; }
    .btn { display: block; text-align: center; background: #d97706; color: #fff; text-decoration: none; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; padding: 14px 24px; border-radius: 6px; margin: 24px 0 0; }
    .footer { background: #f5f5f4; padding: 14px 32px; text-align: center; font-size: 11px; color: #a8a29e; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>HENTAK.</h1>
      <p>Nouvelle Manipuri Cuisine</p>
    </div>
    <div class="hero">
      <h2>Your table is confirmed, ${d.name.split(" ")[0]}.</h2>
      <p>We look forward to welcoming you at Hentak.</p>
    </div>
    <div class="body">
      <div class="row">
        <div class="cell">
          <div class="label">Date</div>
          <div class="value">${d.date}</div>
        </div>
        <div class="cell">
          <div class="label">Time</div>
          <div class="value">${d.time}</div>
        </div>
        <div class="cell">
          <div class="label">Guests</div>
          <div class="value">${d.guests}</div>
        </div>
      </div>
      <hr class="divider" />
      <p class="note">
        Please arrive a few minutes early. Tables are held for <strong>15 minutes</strong> past your reservation time.
        If your plans change, reply to this email or call us on <strong>+91 98621 00000</strong>.
      </p>
      ${d.notes ? `<hr class="divider"/><div class="label">Your Request</div><p class="note" style="margin-top:6px">${d.notes}</p>` : ""}
      <a class="btn" href="https://www.instagram.com/hentak_restaurant" style="color:#fff">Follow us on Instagram</a>
    </div>
    <div class="footer">Hentak Restaurant · Imphal, Manipur · +91 98621 00000</div>
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  let data: Partial<ReservationPayload>;

  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const validationError = validate(data);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 422 });
  }

  const payload = data as ReservationPayload;

  // ── Email (only when SMTP env vars are set) ───────────────
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, RESTAURANT_EMAIL } = process.env;

  if (SMTP_USER && SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host:   SMTP_HOST  || "smtp.gmail.com",
        port:   Number(SMTP_PORT || 587),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      const restaurantTo = RESTAURANT_EMAIL || SMTP_USER;

      await Promise.all([
        // Notification to restaurant
        transporter.sendMail({
          from:    `"Hentak Reservations" <${SMTP_USER}>`,
          to:      restaurantTo,
          subject: `New Reservation — ${payload.name} · ${payload.date} at ${payload.time} · ${payload.guests} guests`,
          html:    restaurantEmail(payload),
        }),
        // Confirmation to guest
        transporter.sendMail({
          from:    `"Hentak Restaurant" <${SMTP_USER}>`,
          to:      payload.email,
          subject: `Your Hentak reservation is confirmed — ${payload.date} at ${payload.time}`,
          html:    guestEmail(payload),
        }),
      ]);
    } catch (err) {
      console.error("[Reservations] Email error:", err);
      // Return success anyway — booking is accepted, email issue is internal
    }
  }

  return NextResponse.json({
    success: true,
    message: "Reservation confirmed",
    data: {
      name:   payload.name,
      date:   payload.date,
      time:   payload.time,
      guests: payload.guests,
      email:  payload.email,
    },
  });
}
