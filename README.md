# DiscordNest CLI

Official command-line interface for [DiscordNest](https://discordnest.xyz) — search bots and servers, view listings, vote, and manage your account without leaving your terminal.

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

---

## Authentication

An API key is only needed for actions that affect your account (voting, listing your bots/servers). Searching and reading listings works without one.

Get your key from [Dashboard Settings](https://discordnest.xyz/dashboard/settings), then:

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

> Requires authentication. You can vote once every 12 hours per bot.

```bash
dn vote mee6
```

---

### Your listings

> All `my` commands require authentication.

```bash
dn my bots      # list your submitted bots with status
dn my servers   # list your submitted servers with status
dn my stats     # total bots, servers, and combined vote count
```

| Command | Description |
|---|---|
| `dn my bots` | Lists all your bots with their approval status and vote counts |
| `dn my servers` | Lists all your servers with their approval status and vote counts |
| `dn my stats` | Summary — total listings and combined votes across everything |

---

## Quick Reference

```
dn auth login <key>   Authenticate with your API key
dn auth status        Check auth status
dn auth logout        Remove saved key
dn search <query>     Search bots and servers
dn bot <vanity>       View bot details
dn server <vanity>    View server details
dn vote <vanity>      Vote for a bot
dn my bots            Your bots
dn my servers         Your servers
dn my stats           Your stats
dn help [command]     Help for any command
```

---

## Links

- [DiscordNest](https://discordnest.xyz)
- [CLI Documentation](https://discordnest.xyz/docs/cli)
- [npm package](https://www.npmjs.com/package/discordnest-cli)

## License

MIT
