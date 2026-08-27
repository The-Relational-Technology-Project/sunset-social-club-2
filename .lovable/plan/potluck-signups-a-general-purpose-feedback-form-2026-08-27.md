# Potluck signups + a general-purpose feedback form

## 1. New members from the Aug 26 potluck

The approved guest list has 45 people. Comparing against the club email list:

- 26 were already on the list
- **19 are new**

New folks to add:

```text
adearamburo@gmail.com          agrawalharshikaa@gmail.com     alexmyerscooper@gmail.com
annguyen.era@gmail.com         benjaminshaw@gmail.com         bwinerip@gmail.com
christozama@gmail.com          claireandwilken@gmail.com      cody@xory.us
divya.m.oswal@gmail.com        frances.england@gmail.com      icamara02@gmail.com
irashaughnessy@gmail.com       jennlouisew@gmail.com          joshcoy31@gmail.com
michaelagnorton@gmail.com      natalieengu@gmail.com          sw6syfxkjd@privaterelay.appleid.com
tdncwth7sy@privaterelay.appleid.com
```

(Two are Apple private-relay addresses; they still deliver.)

What happens on approval:

- Insert all 19 into the club email list with their first names from the guest list, so they get future event invites and can sign in to Member Home.
- Send each of them the existing welcome email (the Member Home one, unchanged copy).
- Skip anyone already on the suppression list.

## 2. General-purpose member feedback form

Replace the pizza-party-specific form linked from Member Home with one general
feedback form.

Fields, in order:

1. "What are you providing feedback on?" (optional dropdown)
   - Kick-off pizza party
   - August 26th potluck
   - General club feedback
   - Other
2. A large open text box for the qualitative feedback.

Everything else stays as it is: members submit signed in, guests can leave an
email, and the full submission is emailed to oursunsetsocialclub@gmail.com. The
old pizza-party form stays reachable at its own link so past responses and the
insights link keep working.

## Technical notes

- Migration: insert a new `event_feedback_forms` row (slug `general-feedback`)
  whose `questions` jsonb includes a new `"select"` question type with an
  `options` array, plus a `textarea` question.
- Migration: insert the 19 new `email_signups` rows with first names.
- `src/routes/feedback/$slug.tsx`: extend `FormQuestion` with `options?` and
  render `type: "select"` as a native `<select>` with an empty default.
- `src/lib/site-config.ts`: add `GENERAL_FEEDBACK_SLUG`; point the Member Home
  feedback card at it (`src/routes/member/index.tsx`).
- Welcome emails sent through the existing transactional send path, one call per
  new address, using the current member-welcome template.
- Add English and Mandarin strings for the updated Member Home feedback card.
