import { encode } from "https://deno.land/std@0.68.0/encoding/base64.ts";
import { deliver } from "./mailgun.js";

// Sends an email to a recipient and logs failures.
export const sendEmail = async ({ body, to, from, subject }) => {
  const response = await deliver(
    { to: `${to.name} <${to.email}>`, text: body, from, subject },
  );

  // We want to know who did not get a ballot enqueued.
  if (!response.ok) {
    console.error(`Failed email ${to.email}!`);
  }
};
