# OutScout — Business Logic

## What is OutScout?

OutScout is a geo-targeted B2B lead generation and outreach platform built for freelancers, agencies, and sales teams who need to find, qualify, and contact local businesses fast. It is designed specifically for markets where WhatsApp is the dominant communication channel (Pakistan, Gulf countries, and similar regions).

---

## Core Problem

Finding local business leads manually is time-consuming:

- Searching Google Maps one by one
- Copying names, phones, and websites into a spreadsheet
- Manually crafting individual outreach messages
- Switching between tools to send emails and WhatsApp messages

OutScout eliminates all of this into a single workflow.

---

## Core Workflow

1. **Define Target** — The user selects a region (city, area, or radius) and a business category (e.g. restaurants, software houses, hotels, clinics).
2. **Fetch Leads** — OutScout queries the Google Places API and returns a list of matching businesses with name, address, phone number, website, rating, and opening hours.
3. **Review & Filter** — The user reviews the leads table, filters by rating, presence of phone/email/website, and selects which leads to pursue.
4. **Outreach** — For each selected lead, the user can:
   - **WhatsApp** — One click opens WhatsApp Web with a personalised, pre-filled message ready to send. The user reviews and hits Send. No WhatsApp API is used.
   - **Email** — One click sends a personalised cold email via the configured SMTP provider.
   - **Cold Call** — Phone number is displayed and can be copied or dialled directly.
5. **Track** — Each lead has a status (New → Contacted → Replied → Converted / Not Interested). The user can add notes.

---

## Key Differentiators

| Feature                 | OutScout                 | Apollo.io / Hunter.io     |
| ----------------------- | ------------------------ | ------------------------- |
| Geo-targeted search     | ✅ City / area level     | ❌ Domain / industry only |
| WhatsApp outreach       | ✅ Semi-automated        | ❌ Not supported          |
| Pakistan / Gulf focus   | ✅ Built for it          | ❌ US/EU-centric          |
| Price                   | Affordable / self-hosted | $49–$99+/month            |
| Email + WhatsApp + Call | ✅ All in one            | Partial                   |

---

## Outreach Rules & Compliance

### WhatsApp

- No WhatsApp Business API is used. OutScout generates `wa.me` deep links with the phone number and a URL-encoded pre-filled message.
- The user sends from their own personal or business WhatsApp — this is fully compliant with Meta's policies.
- Messages are personalised per business (name, category, website) using a template engine.

### Cold Calling

- Phone numbers sourced from Google Places public listings are used for manual cold calling only.
- No auto-dialler or robocalling is implemented.

---

## Data Sources

| Data                                           | Source            | Limitation                                        |
| ---------------------------------------------- | ----------------- | ------------------------------------------------- |
| Business name, phone, address, website, rating | Google Places API | ~60 results per query; ToS prohibits bulk storage |

---

## Author

**Syed Muhammad Khizer** — [syed.khizer30@gmail.com](mailto:syed.khizer30@gmail.com)
