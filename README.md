# Membership Directory

A Wix CLI app that lets members submit their profile via a form and stores it in a CMS collection — no manual page creation needed for each member.

## The Problem

New members fill out a subscription form. Danielle has to manually copy their details onto a public page. Repeat for every member. Not scalable.

Wix doesn't expose subscription form data programmatically, so we can't hook into the existing flow.

## The Solution

A new **members-only form** (custom element widget) that submits directly to a CMS collection. Member profiles stack up in the collection automatically. The public site reads from that collection via dynamic pages / repeaters.

| Component | What it does |
|---|---|
| **Members Data Collection** | CMS collection storing name, title, bio, photo, email, phone, website, social links, join date, published flag |
| **Member Profile Form** (widget) | Members fill this out to create/edit their profile. Redirects to `/membership-directory-profile` on success |
| **Members Directory** (dashboard page) | Admin table to publish/unpublish, delete, and review submissions |

## Philosophy

- **Code over config.** Everything lives in `src/`. Adding or removing the app on a site is a deploy — no manual Editor click-through.
- **Reversible.** This app installs and uninstalls cleanly. Uninstall the app → widget disappears, collection stays (data preserved). No permanent site modifications.
- **Portable.** Deploy to any Wix site. Per-site setup: create one page, add one widget, connect one repeater. That's it.

## Setup (per site)

1. Create a members-only page called `/membership-directory-profile` in the Editor
2. Add the **Member Profile Form** widget from your app to that page
3. Create a public `/members` page with a repeater connected to the `@jameslaymusic/membership-directory/members` collection, filtered by `published: true`

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Hot-reload dev server connected to your test site |
| `npm run preview` | Deploy preview build to test site |
| `npm run build` | Production build |
| `npm run release` | Release to production |
