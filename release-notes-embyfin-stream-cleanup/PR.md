Add CIDR notation support and input whitespace trimming

Media server client identifiers now accept CIDR blocks (e.g. `10.0.0.0/24`) in addition to plain IPs, hostnames, and usernames, allowing clustered or subnet-routed setups to match without listing every address. IP and username inputs are also trimmed of surrounding whitespace before matching.
