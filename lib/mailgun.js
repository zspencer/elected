import { config } from "https://deno.land/x/dotenv/mod.ts";
// We use Mailgun to handle the fiddly bits about sending email, since I'm not
// particularly keen on running an SMTP server just yet.

// Enquees an email to be sent via the Mailgun API
export function deliver({ to, text, from, subject }) {
  // The mailgun API expects messages to come in as web forms
  // See:
  // https://documentation.mailgun.com/en/latest/api-sending.html#sending
  // See: https://developer.mozilla.org/en-US/docs/Web/API/FormData
  const formData = new FormData();
  formData.append("to", to);
  formData.append("from", from);
  formData.append("subject", subject);
  formData.append("text", text);

  // POST to the the Mailgun API's Messages endpoint
  // See: https://documentation.mailgun.com/en/latest/api-sending.html#sending
  return request(endpointUrl("/messages"), {
    method: "POST",
    body: formData,
  });
}

// URL for a given resource in the Mailgun API
const endpointUrl = (resource) => `${baseUrl}${resource}`;

// The Mailgun API uses the sender domain as the base for making API requests
// See: https://documentation.mailgun.com/en/latest/api-intro.html#base-url
const baseUrl = `https://api.mailgun.net/v3${config()["MAILGUN_DOMAIN"]}`;

// Makes an authenticated request with the Mailgun credentials
// See https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
function request(url, options = {}, headers = {}) {
  // HTTP Basic Credentials are Base 64 Encoded
  // See: https://en.wikipedia.org/wiki/Basic_access_authentication
  const credentials = encode(`api:${config()["MAILGUN_API_KEY"]}`);

  // Call the JavaScripts built in Fetch API with the credentials and other
  // provided headers and options.
  return fetch(url, {
    headers: {
      "Authorization": `Basic ${credentials}`,
      // Merge in the provided headers
      ...headers,
    },
    // Merge in the provided options
    ...options,
  });
}
