Release v2.1.0: ESPN All-Star pseudo-team discovery, per-league color cache fix

Adds dynamic discovery of ESPN's "All-Star" grouping so leagues with permanent conference/All-Star pseudo-teams (e.g. MLB's AL/NL, NFL's AFC/NFC Pro Bowl) resolve without any per-league hardcoding, filtering out one-off historical rosters and keeping only stable, current pairings. Also fixes the team color cache key to include the league, preventing a color lookup collision when two different leagues' teams share the same ESPN team ID.
