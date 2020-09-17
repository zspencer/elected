import { config } from "https://deno.land/x/dotenv/mod.ts";

export class Airtable {
  url(table) {
    return `https://api.airtable.com/v0/${
      config()["AIRTABLE_BASE"]
    }/${table}?maxRecords=100`;
  }

  fetch(url, options = {}, headers = {}) {
    return fetch(url, {
      headers: {
        "Authorization": `Bearer ${config()["AIRTABLE_API_KEY"]}`,
        "Content-Type": "application/json",
        ...headers,
      },
      ...options,
    });
  }

  get(table) {
    return this.fetch(this.url(table))
      .then((result) => result.json())
      .then((json) => json["records"]);
  }

  post(table, records) {
    return this.fetch(this.url(table), {
      method: "POST",
      body: JSON.stringify({ records }),
    }).then((result) => result.json())
      .then((json) => json["records"]);
  }
}

export default Airtable;
export const airtable = new Airtable();
