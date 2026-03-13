import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const createTransporter = async () => {
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    !process.env.SMTP_USER.includes('your-') &&
    !process.env.SMTP_PASS.includes('your-')
  ) {
    try {
      const t = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      await t.verify();
      console.log('✅ SMTP connected:', process.env.SMTP_HOST, '| user:', process.env.SMTP_USER);
      const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
      return { transporter: t, from };
    } catch (err) {
      console.error('❌ SMTP verification failed:', err.message);
    }
  } else {
    console.log('⚠️  No valid SMTP configured — using Ethereal test account');
  }

  const testAccount = await nodemailer.createTestAccount();
  console.log(`📧 Ethereal credentials: ${testAccount.user} / ${testAccount.pass}`);
  const t = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
  return { transporter: t, from: testAccount.user };
};

/**
 * Converts plain-text itinerary into clean HTML paragraphs/sections.
 * If the itinerary already contains HTML tags it is used as-is.
 */
const formatItinerary = (itinerary) => {
  if (!itinerary) return '<p style="color:#94a3b8;">No itinerary available.</p>';

  // Already HTML — use directly
  if (/<[a-z][\s\S]*>/i.test(itinerary)) return itinerary;

  // Plain text — convert line breaks and bold **Day X** headings
  return itinerary
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      // "Day 1:" style headings
      if (/^(day\s*\d+|morning|afternoon|evening|night)/i.test(trimmed)) {
        return `<p style="margin:18px 0 4px;font-weight:700;color:#38bdf8;font-size:14px;">${trimmed}</p>`;
      }
      return `<p style="margin:4px 0;color:#cbd5e1;font-size:14px;line-height:1.7;">${trimmed}</p>`;
    })
    .join('');
};

/**
 * Send the "Vibe Ticket" email with booking details and AI itinerary
 */
export const sendVibeTicketEmail = async (booking, destination, hotel, itinerary) => {
  const { transporter, from } = await createTransporter();

  // ── Safe value helpers ────────────────────────────────────────────────────
  const totalAmount = booking?.pricing?.totalAmount ?? 0;
  const formattedTotal = `$${Number(totalAmount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const guestLine = booking?.guests?.adults
    ? `${booking.guests.adults} Adult${booking.guests.adults !== 1 ? 's' : ''}${booking.guests.children ? `, ${booking.guests.children} Child${booking.guests.children !== 1 ? 'ren' : ''}` : ''}`
    : '1 Adult';

  const checkInFmt = booking?.checkIn
    ? new Date(booking.checkIn).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';
  const checkOutFmt = booking?.checkOut
    ? new Date(booking.checkOut).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  const itineraryHTML = formatItinerary(itinerary);

  // ── Email HTML ────────────────────────────────────────────────────────────
  const emailHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Vibe Ticket</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0e1a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0e1a;padding:32px 16px;">
    <tr>
      <td align="center">

        <!-- Main card -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:linear-gradient(160deg,#0d1117 0%,#161b22 100%);border:1px solid rgba(56,189,248,0.2);border-radius:16px;overflow:hidden;">

          <!-- ── Header ── -->
          <tr>
            <td style="background:linear-gradient(135deg,#0369a1,#0ea5e9,#38bdf8);padding:40px 30px;text-align:center;">
              <p style="margin:0 0 4px;font-size:32px;color:#ffffff;font-weight:800;letter-spacing:3px;">✈️ VIBE TICKET</p>
              <p style="margin:0 0 16px;color:rgba(255,255,255,0.85);font-size:14px;letter-spacing:1px;">Your journey begins now</p>
              <span style="display:inline-block;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.35);border-radius:24px;padding:6px 22px;font-size:12px;color:#fff;letter-spacing:1.5px;font-weight:700;">BOOKING CONFIRMED</span>
            </td>
          </tr>

          <!-- ── Booking Reference ── -->
          <tr>
            <td style="padding:28px 30px 0;text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#64748b;">Booking Reference</p>
              <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:26px;font-weight:700;color:#38bdf8;letter-spacing:4px;">${booking.bookingReference}</p>
            </td>
          </tr>

          <!-- ── Your Stay ── -->
          <tr>
            <td style="padding:24px 30px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(56,189,248,0.14);border-radius:12px;overflow:hidden;">
                <!-- Card header -->
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(56,189,248,0.12);">
                    <p style="margin:0;font-size:16px;font-weight:700;color:#38bdf8;">🏨 Your Stay</p>
                  </td>
                </tr>
                <!-- Rows -->
                <tr>
                  <td style="padding:0 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">

                      <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                        <td style="padding:10px 0;font-size:13px;color:#94a3b8;width:40%;">Destination</td>
                        <td style="padding:10px 0;font-size:13px;color:#f1f5f9;font-weight:600;text-align:right;">${destination.city}, ${destination.country}</td>
                      </tr>

                      <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                        <td style="padding:10px 0;font-size:13px;color:#94a3b8;">Hotel</td>
                        <td style="padding:10px 0;font-size:13px;color:#f1f5f9;font-weight:600;text-align:right;">${hotel.name}</td>
                      </tr>

                      <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                        <td style="padding:10px 0;font-size:13px;color:#94a3b8;">Room Type</td>
                        <td style="padding:10px 0;font-size:13px;color:#f1f5f9;font-weight:600;text-align:right;">${booking.roomType?.name ?? 'N/A'}</td>
                      </tr>

                      <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                        <td style="padding:10px 0;font-size:13px;color:#94a3b8;">Check-in</td>
                        <td style="padding:10px 0;font-size:13px;color:#f1f5f9;font-weight:600;text-align:right;">${checkInFmt}</td>
                      </tr>

                      <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                        <td style="padding:10px 0;font-size:13px;color:#94a3b8;">Check-out</td>
                        <td style="padding:10px 0;font-size:13px;color:#f1f5f9;font-weight:600;text-align:right;">${checkOutFmt}</td>
                      </tr>

                      <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                        <td style="padding:10px 0;font-size:13px;color:#94a3b8;">Duration</td>
                        <td style="padding:10px 0;font-size:13px;color:#f1f5f9;font-weight:600;text-align:right;">${booking.nights} Night${booking.nights !== 1 ? 's' : ''}</td>
                      </tr>

                      <tr>
                        <td style="padding:10px 0;font-size:13px;color:#94a3b8;">Guests</td>
                        <td style="padding:10px 0;font-size:13px;color:#f1f5f9;font-weight:600;text-align:right;">${guestLine}</td>
                      </tr>

                    </table>
                  </td>
                </tr>
                <!-- Total paid -->
                <tr>
                  <td style="padding:16px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.18);border-radius:8px;">
                      <tr>
                        <td style="padding:14px 18px;font-size:14px;color:#94a3b8;font-weight:600;">Total Paid</td>
                        <td style="padding:14px 18px;font-size:22px;color:#38bdf8;font-weight:800;text-align:right;letter-spacing:-0.5px;">${formattedTotal}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── AI Itinerary ── -->
          <tr>
            <td style="padding:20px 30px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(56,189,248,0.14);border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(56,189,248,0.12);">
                    <p style="margin:0;font-size:16px;font-weight:700;color:#38bdf8;">🗺️ Your AI-Curated Itinerary</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 20px;">
                    ${itineraryHTML}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Hotel Policies ── -->
          <tr>
            <td style="padding:20px 30px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(56,189,248,0.14);border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(56,189,248,0.12);">
                    <p style="margin:0;font-size:16px;font-weight:700;color:#38bdf8;">📋 Hotel Policies</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">

                      <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                        <td style="padding:10px 0;font-size:13px;color:#94a3b8;width:40%;">Check-in Time</td>
                        <td style="padding:10px 0;font-size:13px;color:#f1f5f9;font-weight:600;text-align:right;">${hotel.policies?.checkIn ?? '3:00 PM'}</td>
                      </tr>

                      <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                        <td style="padding:10px 0;font-size:13px;color:#94a3b8;">Check-out Time</td>
                        <td style="padding:10px 0;font-size:13px;color:#f1f5f9;font-weight:600;text-align:right;">${hotel.policies?.checkOut ?? '11:00 AM'}</td>
                      </tr>

                      <tr>
                        <td style="padding:10px 0;font-size:13px;color:#94a3b8;">Cancellation</td>
                        <td style="padding:10px 0;font-size:13px;color:#f1f5f9;font-weight:600;text-align:right;">${hotel.policies?.cancellation ?? 'Free cancellation'}</td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Footer ── -->
          <tr>
            <td style="padding:28px 30px;text-align:center;border-top:1px solid rgba(56,189,248,0.08);margin-top:24px;">
              <p style="margin:0 0 6px;font-size:13px;color:#475569;font-weight:600;">Voyage ✈️ — Curated by AI, crafted for you</p>
              <p style="margin:0;font-size:12px;color:#334155;">Questions? Reply to this email or visit vibevoyage.elite</p>
            </td>
          </tr>

        </table>
        <!-- End main card -->

      </td>
    </tr>
  </table>

</body>
</html>`;

  // ── Plain-text fallback ───────────────────────────────────────────────────
  const textBody = `
VIBE TICKET — Booking Confirmed
================================
Booking Reference : ${booking.bookingReference}

TRIP DETAILS
------------
Destination  : ${destination.city}, ${destination.country}
Hotel        : ${hotel.name}
Room         : ${booking.roomType?.name ?? 'N/A'}
Check-in     : ${checkInFmt}
Check-out    : ${checkOutFmt}
Duration     : ${booking.nights} night${booking.nights !== 1 ? 's' : ''}
Guests       : ${guestLine}
Total Paid   : ${formattedTotal}

HOTEL POLICIES
--------------
Check-in Time  : ${hotel.policies?.checkIn ?? '3:00 PM'}
Check-out Time : ${hotel.policies?.checkOut ?? '11:00 AM'}
Cancellation   : ${hotel.policies?.cancellation ?? 'Free cancellation'}

YOUR AI-CURATED ITINERARY
--------------------------
${itinerary ?? 'No itinerary available.'}

---
Voyage — Curated by AI, crafted for you
  `.trim();

  const mailOptions = {
    from: `"Voyage ✈️" <${from}>`,
    to: booking.guestInfo.email,
    subject: `🎫 Your Vibe Ticket to ${destination.city} — ${booking.bookingReference}`,
    html: emailHTML,
    text: textBody,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Vibe Ticket sent to ${booking.guestInfo.email}: ${info.messageId}`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) console.log(`📧 Preview URL: ${previewUrl}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error.message);
    return { success: false, error: error.message };
  }
};

export default { sendVibeTicketEmail };