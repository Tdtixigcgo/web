import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const body = await req.json();
  const approvalDashboard = `${process.env.NEXT_PUBLIC_SITE_URL}/ad/requests`;

  await resend.emails.send({
    from: 'Admin Gate <onboarding@resend.dev>',
    to: process.env.ADMIN_APPROVAL_EMAIL!,
    subject: 'Yêu cầu duyệt thiết bị truy cập admin',
    html: `<h2>Thiết bị mới yêu cầu truy cập</h2>
    <p><b>Device ID:</b> ${body.device_id}</p>
    <p><b>Device name:</b> ${body.device_name}</p>
    <p><b>Browser:</b> ${body.browser_info}</p>
    <p>Duyệt tại: <a href="${approvalDashboard}">${approvalDashboard}</a></p>`
  });

  return NextResponse.json({ ok: true });
}
