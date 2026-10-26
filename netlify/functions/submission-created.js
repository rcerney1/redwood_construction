// netlify/functions/submission-created.js
export default async (req) => {
  const { payload } = await req.json();
  const d = payload.data;

  const body = `New ${payload.form_name} submission:\n${d.name || ""} ${d.email || ""}\n${(d.message || "").slice(0, 300)}`;

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const auth = Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");

  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      To: process.env.NOTIFY_PHONE,     // your cell, e.g. +14085551234
      From: process.env.TWILIO_FROM,    // your Twilio number
      Body: body,
    }),
  });

  return new Response("ok");
};