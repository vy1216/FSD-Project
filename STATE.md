# Project State: WILDTRAIL Platform (College FSD Project)

## Current Status
- **Current Phase**: Admin Feature Expansion & Production Sync
- **Date**: 2026-11-02
- **Status**: Live in Production, 100% Deployed & Verified

---

## Production Deployment URLs
- **Main Production URL**: [https://wildtrail-fsd-project.vercel.app](https://wildtrail-fsd-project.vercel.app)
- **Deployment Inspector**: [https://vercel.com/adi3-5611/wildtrail-fsd-project](https://vercel.com/adi3-5611/wildtrail-fsd-project)
- **Vercel Project Scope**: `adi3-5611`
- **Ready State**: `READY` (HTTP 200)

---

## GitHub Repository
- **URL**: [https://github.com/Adityakumarsinghcoder/wildtrail-fsd-project](https://github.com/Adityakumarsinghcoder/wildtrail-fsd-project)
- **Branch**: `main`
- **Owner**: `Adityakumarsinghcoder`

---

## Latest Feature Additions (Admin Controls & Capacity Management)
1. **Person Limit for Every Adventure**:
   - Each adventure now defines a configurable `personLimit` (maximum capacity per group).
   - Displayed across adventure cards, expedition detail meta, and booking form.
   - Guest selection is constrained to the limit; submissions exceeding the limit are blocked on both client and server.
2. **Admin Price Increase & Decrease Controls**:
   - For Adventures: Inline price adjuster with `- ₹500` / `+ ₹500` quick buttons.
   - For Gear Products: Inline price adjuster with `- ₹100` / `+ ₹100` quick buttons.
   - For Camps & Stays: Inline price adjuster with `- ₹200` / `+ ₹200` quick buttons.
   - Syncs via `PUT /api/v1/:resource/:id` and persists locally across sessions.
3. **Item Creation in Every Section**:
   - **Adventures & Sports**: Form to add new sports/adventures with person limit, sport category, difficulty, duration, and booking toggle.
   - **Gear Shop**: Form to add new technical gear items with categories, stock, and descriptions.
   - **Camps & Stays**: Dedicated admin management section and form to add new camps, homestays, and eco-resorts.
4. **Admin Enable / Disable Booking Option for Any Sport**:
   - Dedicated toggle button in Admin portal: `🟢 Open` vs `🔴 Disabled`.
   - Disabling a sport immediately displays `🔴 Booking Closed` badges on cards and a warning banner on the detail page.
   - Prevents booking submissions when disabled.
5. **AI Chatbot (TrailBot Assistant)**:
   - Floating interactive assistant in bottom-right corner of all pages.
   - Answers questions regarding expeditions, difficulty ratings, required gear, stays near trails, group person limits, and cancellation policies.
   - Features dynamic suggestion chips, auto-scrolling message view, and conversation clearing.
   - Supported by `POST /api/v1/chat` with integrated offline fallback so it always functions with zero external API key requirements.

---

## Demo Credentials
- **Admin**: `admin@wildtrail.com` / `Admin@123`
- **User**: `user@wildtrail.com` / `User@123`
