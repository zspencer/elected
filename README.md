# Elected

Elected distributes and counts ballots using [Deno], [Mailgun], and [Airtable].

## Get Started

1. Copy the [Election Template Airtable Base].
1. [Install Deno]
1. Create a local `.env` file by using the [.env.example] as a template.
1. Replace the example Candidates and Voters in your Election Airtable Base with
   your own Candidates and Voters.
1. Run `deno run --allow-net --allow-read https://deno.land/x/elected/distribute-ballots.js` and send
   each voter a ballot!
1. Run `deno run --allow-net --allow-read https://deno.land/x/elected/count-votes.js` to see the results!

[Election Template Airtable Base]: https://airtable.com/shrKmhFNlvxShxEtY
[.env.example]: ./.env.example
[Mailgun]: https://www.mailgun.com/
[Airtable]: https://airtable.com/
[Deno]:https://deno.land/
[Install Deno]: https://deno.land/#installation

## Contributing

Submit patches or tickets to [@zspencer@github.com/elected].

I may not have notifications turned on, so a ping at [@zee@wandering.shop] if I
don't get back to you in a few days is not unwelcome.

[@zee@wandering.shop]: https://wandering.shop/@zee
[@zspencer@github.com/elected]: https://github.com/zspencer/elected

## License

Elected is licensed under the [Cooperative Non-Violent Public License], which
places significant constraints regarding the usage of this software. Please
review the [CNPL license authors summary].

[Cooperative Non-Violent Public License]: https://git.pixie.town/thufie/CNPL
[CNPL license authors summary]: https://thufie.lain.haus/NPL.html
