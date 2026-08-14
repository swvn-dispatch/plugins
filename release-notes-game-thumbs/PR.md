Add name-mode rendering, team color palettes, Little League Baseball,
and reliability fixes

Adds two new leagues.json options, `mode: "name"` (render a team's
name as text instead of its logo, with a per-request `?mode=` override)
and `teamColors` (a hex palette for deterministically color-coding
teams that lack per-team color data), and uses both to add a new
Little League Baseball league. Also fixes several reliability issues:
ESPN's Akamai WAF blocking datacenter-IP requests with browser-style
User-Agents (403s on public VPS instances, #149), stale cached MLB
All-Star team data, ESPN all-star pseudo-team resolution for MLS/Liga
MX, an out-of-memory crash under concurrent tennis/athlete logo
requests caused by re-parsing the full ESPN roster on every call
(#141), and broken ATP/WTA tennis logos (now served from bundled local
assets instead of remote URLs).
