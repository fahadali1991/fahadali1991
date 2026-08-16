# V100 Semantic Architecture

## Core rule
Understand the school event before classifying the document. Raw text is converted into a semantic frame: work family, subtype, subject/school context, topic, audience, stage, grade, confidence, ambiguity, and missing facts.

## UX invariants
1. Never hide reasons behind “show more”. Contextual reason lists must be short enough to display completely.
2. Never hide goals behind “additional goals”. Display the useful goal set directly.
3. Never auto-select a goal. The engine proposes; the user chooses.
4. Subject may be inferred when confidence is high, but it remains visible and changeable through icons.
5. Never invent audience, grade, duration, location, result, or impact when absent.
6. A practical training activity for students is not professional development.
7. One page = one owner. No legacy module may rewrite reasons, goals, or titles after their current engine renders them.
8. reason-goals90.js is forbidden in V100+.

## Semantic pipeline
RAW -> normalize -> detect explicit event -> subject/school context -> topic -> audience/stage/grade -> ambiguity/missing -> document family -> adaptive questions -> user choices -> goals -> guide links -> title -> narrative -> spelling -> evidence -> final document.

## Acceptance gate
A release must pass acceptance100.js plus manual paths for: Quran/Islamic studies, Arabic, Mathematics, Science, English, safety, analysis, meeting, plan, follow-up, and professional development. Any regression in a previously accepted path blocks the release.
