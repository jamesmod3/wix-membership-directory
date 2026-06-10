# Membership Directory

A Wix CLI app that lets members submit their profile via a form and stores it in a CMS collection — no manual page creation needed for each member.

## The Problem

New members fill out a subscription form. Danielle has to manually copy their details onto a public page. Repeat for every member. Not scalable.

Wix doesn't expose subscription form data programmatically, so we can't hook into the existing flow.

## The Solution

A new **members-only form** (custom element widget) that submits directly to a CMS collection. Member profiles stack up in the collection automatically. The public site reads from that collection via dynamic pages / repeaters.

| Component | What it does |
|---|---|
| **Members Data Collection** | CMS collection storing business name, name, title, bio, photo, email, phone, website, social links, join date, published flag |
| **Member Profile Form** (widget) | Members fill this out to create/edit their profile |
| **Members Directory** (dashboard page) | Admin table to publish/unpublish, delete, and review submissions |
| **Data Store** (abstraction) | Switches between `@wix/data` (live) and `localStorage` (Editor/dev) — instant iteration without preview deploys |

## Philosophy

- **Code over config.** Everything lives in `src/`. Adding or removing the app on a site is a deploy — no manual Editor click-through.
- **Reversible.** This app installs and uninstalls cleanly. Uninstall the app → widget disappears, collection stays (data preserved). No permanent site modifications.
- **Portable.** Deploy to any Wix site. Per-site setup: create one page, add one widget, connect one repeater. That's it.

## Pre-deploy: Dev Center Permissions

Before deploying to any site, the app must have DC-DATA scopes enabled:

1. Go to [Wix Dev Center](https://manage.wix.com/studio/custom-apps/) → select this app → **Develop → Permissions**
2. Add **`SCOPE.DC-DATA.READ`** and **`SCOPE.DC-DATA.WRITE`**
3. These are required for the Data Collection extension and the widget to access the CMS

This is a one-time step per app, not per site.

## Setup (per site)

### 1. Members-only profile page
Create a members-only page called `/membership-directory-profile` in the Editor. The **Member Profile Form** widget auto-adds to every page when the app is installed — it's invisible elsewhere and only renders on this page.

### 2. Public directory page
Create a public `/members` page with a repeater connected to the `@jameslaymusic/membership-directory/members` collection, filtered by `published: true`.

### 3. Getting members to the form
Members are motivated (they paid) but they still need to find the form. Options:

- **Post-signup redirect** (production only): After `npm run release`, the embedded script auto-redirects new members to `/membership-directory-profile` using `onLogin`. Not available in preview.
- **Site navigation**: Add a "My Profile" link in the site's main menu pointing to `/membership-directory-profile`. Works for all members at all times.
- **Welcome email**: Send new members a direct link to the profile page as part of the onboarding flow.

Initial setup can be verified in the Wix Dashboard → Content Manager — look for the `@jameslaymusic/membership-directory/members` collection.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Hot-reload dev server — widget uses localStorage, no preview needed for UI/form changes |
| `npm run preview` | Deploy preview build to test site (needed to test CMS integration) |
| `npm run build` | Production build |
| `npm run release` | Release to production |

## Roadmap

- [x] Members CMS data collection (auto-created via Data Collection extension)
- [x] Member profile form widget (create/edit, scoped by `_owner`)
- [x] Admin dashboard page (link to Content Manager)
- [x] Data store abstraction (localStorage in dev, Wix Data in prod)
- [x] DC-DATA permissions configured in Dev Center
- [ ] Public members directory repeater guide / template
- [ ] Deploy to Danielle's live site
