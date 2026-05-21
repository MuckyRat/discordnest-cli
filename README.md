# DiscordNest CLI

Official command-line interface for [DiscordNest](https://discordnest.xyz) — search bots and servers, view profiles and changelogs, vote, manage your account, and open listings in your browser without leaving your terminal.

## Installation

Requires **Node.js 18+**.

```bash
npm install -g discordnest-cli
# or
pnpm add -g discordnest-cli
# or
yarn global add discordnest-cli
```

Verify the install:

```bash
dn --version
dn --help
```

The CLI also responds to `discordnest` if you prefer the full name.

## Updating

```bash
npm install -g discordnest-cli
```

---

## Authentication

An API key is only needed for actions that affect your account (voting, notifications, listing your bots/servers). Searching, viewing profiles, and reading changelogs work without one.

Get your key from [Dashboard → Settings](https://discordnest.xyz/dashboard/settings), then:

```bash
dn auth login <your-api-key>
```

| Command | Description |
|---|---|
| `dn auth login <key>` | Save your API key and verify it |
| `dn auth status` | Check whether you are currently authenticated |
| `dn auth logout` | Remove your saved API key |

Your key is stored in your OS config folder (`~/.config/discordnest-cli/config.json`) — never in plain text inside your project.

---

## Commands

### Search

Search across both bots and servers at once, or filter to just one type.

```bash
dn search music
dn search "moderation bot" --bots
dn search gaming --servers
dn search utility --bots --limit 10
```

| Command | Description |
|---|---|
| `dn search <query>` | Search both bots and servers (5 results each) |
| `dn search <query> --bots` | Search bots only |
| `dn search <query> --servers` | Search servers only |
| `dn search <query> -n 10` | Show up to 10 results per type |

---

### Bot info

View full details for any approved bot using its vanity name.

```bash
dn bot mee6
```

Output includes description, tags, vote count, prefix, owner, website, support server, and invite link.

---

### Server info

Look up any approved server by its vanity name.

```bash
dn server my-community
```

Output includes description, tags, member count, vote count, language, owner, and invite link.

---

### Voting

> Requires authentication. You can vote once per cooldown period per listing.

```bash
dn vote mee6              # vote for a bot
dn vote my-community -s   # vote for a server
```

| Flag | Description |
|---|---|
| `-s, --server` | Vote for a server instead of a bot |

If you've already voted, the CLI shows exactly how long until your next vote is available.

---

### Profile

View any user's public profile — no authentication required.

```bash
dn profile username
```

Output includes bio, plan tier, level, XP, vote streak, total votes, and a list of their bots and servers.

---

### Changelog

View recent changelog entries for any approved bot or server.

```bash
dn changelog bot mee6
dn changelog server my-community
dn changelog bot mee6 --limit 5
```

| Command | Description |
|---|---|
| `dn changelog bot <vanity>` | View a bot's recent changelog entries |
| `dn changelog server <vanity>` | View a server's recent changelog entries |
| `-n, --limit <n>` | Number of entries to show (default 10) |

---

### Notifications

> Requires authentication.

```bash
dn notify
dn notify --mark-read
```

| Command | Description |
|---|---|
| `dn notify` | List your latest notifications with unread count |
| `dn notify --mark-read` | List notifications and mark all as read |

---

### Open in browser

Open any listing directly in your browser from the terminal.

```bash
dn open mee6                      # open bot page
dn open my-community --server     # open server page
dn open mee6 --changelog          # open changelog page
dn open mee6 --invite             # fetch and open the bot's invite link
```

| Flag | Description |
|---|---|
| `-s, --server` | Target a server instead of a bot |
| `--changelog` | Open the changelog page |
| `--invite` | Fetch and open the invite link directly |

---

### Status

Check whether the DiscordNest API is online and view your current auth state.

```bash
dn status
```

Shows API response time, total bots indexed, and whether your API key is valid.

---

### Your listings

> All `my` commands require authentication.

```bash
dn my bots      # list your submitted bots with status
dn my servers   # list your submitted servers with status
dn my votes     # see your recent vote history
dn my stats     # total bots, servers, and combined vote count
```

| Command | Description |
|---|---|
| `dn my bots` | Lists all your bots with approval status and vote counts |
| `dn my servers` | Lists all your servers with approval status and vote counts |
| `dn my votes` | Shows your recent vote history across bots and servers |
| `dn my stats` | Summary — total listings and combined votes |

---

## Quick Reference

```
dn auth login <key>         Authenticate with your API key
dn auth status              Check auth status
dn auth logout              Remove saved key
dn search <query>           Search bots and servers
dn bot <vanity>             View bot details
dn server <vanity>          View server details
dn vote <vanity>            Vote for a bot
dn vote <vanity> -s         Vote for a server
dn profile <username>       View a user's public profile
dn changelog bot <vanity>   View a bot's changelogs
dn changelog server <vanity>View a server's changelogs
dn notify                   View your notifications
dn notify --mark-read       View and clear notifications
dn open <vanity>            Open a listing in your browser
dn open <vanity> --invite   Open the invite link
dn status                   Check API status and auth
dn my bots                  Your bots
dn my servers               Your servers
dn my votes                 Your vote history
dn my stats                 Your stats
dn help [command]           Help for any command
```

---

## Links

- [DiscordNest](https://discordnest.xyz)
- [CLI Documentation](https://discordnest.xyz/docs/cli)
- [npm package](https://www.npmjs.com/package/discordnest-cli)
- [GitHub](https://github.com/MuckyRat/discordnest-cli)

## License

MIT
