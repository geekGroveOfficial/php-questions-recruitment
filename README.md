# PHP Interview Questions Recruitment

A JSON-driven static page of PHP interview questions in Persian, written for quick review before a technical interview.

## Content source

All page content now lives in `src/content.json`:

- hero text and stats
- interview sections and questions
- answers, notes, and wide cards
- contact section
- footer copy

To add or edit questions, update the JSON file and refresh the page.

## Local development

Because the page reads data from a JSON file, open it through a local server instead of `file://`.

1. Install dependencies with `npm install`
2. Run `npm run dev` to rebuild Tailwind during edits
3. Start a simple server, for example: `python3 -m http.server 4173`
4. Open `http://localhost:4173`

## Build

Run `npm run build` to regenerate `src/output.css`.

## Demo

https://geekgroveofficial.github.io/php-questions-recruitment/
