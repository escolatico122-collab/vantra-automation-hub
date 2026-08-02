# macOS and Linux Setup Guide

This guide walks first-time contributors through setting up **Vantra Automation Hub** on macOS or
Linux: checking prerequisites, forking and cloning the repository, and running the validators
locally before opening a pull request.

If you're on Windows, use WSL and follow this guide inside your Linux distribution, or see the
Windows-specific guide if one is linked from the [root README](../../README.md).

## 1. Verify Git

Check whether Git is already installed:

```bash
git --version
```

You should see output similar to:

```text
git version 2.43.0
```

If you see `command not found: git`:

- **macOS**: run `git --version` anyway — macOS will usually prompt you to install the Xcode
  Command Line Tools, which include Git. Accept the prompt and wait for the install to finish, then
  re-run `git --version`. If no prompt appears, run `xcode-select --install`.
- **Linux (Debian/Ubuntu)**: `sudo apt update && sudo apt install git`
- **Linux (Fedora)**: `sudo dnf install git`
- **Linux (Arch)**: `sudo pacman -S git`

## 2. Verify Node.js 18+

Vantra Automation Hub's validators require **Node.js 18 or newer** and use only Node's built-in
modules — no extra runtime dependencies.

```bash
node --version
```

You need to see `v18.x.x` or higher, for example:

```text
v22.22.2
```

If Node.js is missing or the version is older than 18, install or upgrade it using
[nvm](https://github.com/nvm-sh/nvm) (Node Version Manager). This avoids the permission problems
that come with installing Node globally via `sudo`:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Then close and reopen your terminal (or reload your shell config), and install Node 18+:

```bash
nvm install 18
nvm use 18
node --version
```

> On macOS, you can also install Node via [Homebrew](https://brew.sh) with `brew install node`. On
> Linux, your distribution's package manager may ship an older Node version — nvm is the more
> reliable option for meeting the `>=18` requirement.

## 3. Fork and clone the repository

1. On GitHub, click **Fork** on the
   [vantra-automation-hub repository](https://github.com/escolatico122-collab/vantra-automation-hub)
   to create your own copy.
2. Clone your fork (replace `YOUR_USERNAME` with your GitHub username):

   ```bash
   git clone https://github.com/YOUR_USERNAME/vantra-automation-hub.git
   ```

3. Enter the repository directory:

   ```bash
   cd vantra-automation-hub
   ```

## 4. Enter the Automation Hub directory

The validators and their `package.json` live inside the **`automation-hub/`** subdirectory, not at
the repository root:

```bash
cd automation-hub
```

> **Why this matters:** the repository root also contains an unrelated `package.json` left over from
> a different project. Running validation commands from the root directory will fail — see
> [Troubleshooting](#troubleshooting) below.

## 5. Run validation

```bash
npm test
```

This runs both validators in sequence: recipe validation, then n8n workflow validation.

### Expected successful result

A successful run prints a checkmark for each validated file and ends with two summary lines, one
per validator, similar to:

```text
✓ instagram-jewelry-faq.json
✓ make-missed-lead-followup.json
✓ n8n-lead-sheet-log.json
✓ telegram-order-status.json
✓ whatsapp-lead-qualifier.json

Validated 5 automation recipe(s).
✓ faq-router.json
✓ order-status-webhook.json
✓ privacy-safe-lead-qualifier.json

Validated 3 n8n workflow(s).
```

The exact file count may change over time as more recipes and workflows are added, but every line
should start with `✓` and the command should exit without any error output.

## Troubleshooting

### 1. `npm error Missing script: "test"`

**Cause:** You ran `npm test` from the **repository root** instead of the `automation-hub/`
directory. The root `package.json` belongs to an unrelated project and has no `test` script.

**Fix:**

```bash
cd automation-hub
npm test
```

Confirm you're in the right place first with `pwd` — the path should end in
`vantra-automation-hub/automation-hub`.

### 2. Validator fails or `node` command not found

**Cause:** Node.js is missing, or an old version (below 18) is active.

**Fix:** Re-check your version and switch to a supported one:

```bash
node --version
nvm install 18
nvm use 18
```

Then re-run `npm test` from inside `automation-hub/`.

### 3. `EACCES: permission denied` during `npm install` or `npm test`

**Cause:** This usually means Node.js or a global npm package was installed with `sudo` at some
point, leaving files in your npm directories owned by `root`. Running validation as a regular user
then fails to read or write those files.

**Fix:** Avoid using `sudo` with `npm` going forward. The safest fix is to switch to a Node version
manager so npm never needs elevated permissions:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 18
nvm use 18
```

This installs Node (and npm) entirely within your home directory, so future installs and validation
runs don't require `sudo`. Avoid commands that recursively `chown` or `chmod` system-wide npm
directories — they can affect files unrelated to this project.

### 4. `git clone` fails with a permission or authentication error

**Cause:** This most often happens when cloning your **fork** using an SSH URL without an SSH key
configured, or when mistakenly cloning the original repository URL and then trying to push back to
it (only maintainers have write access to the upstream repository).

**Fix:** Clone using the HTTPS URL of **your fork**, not the upstream repository:

```bash
git clone https://github.com/YOUR_USERNAME/vantra-automation-hub.git
```

If you push changes, push to your fork (`origin`), then open a pull request from your fork's branch
into the upstream `main` branch — don't attempt to push directly to
`escolatico122-collab/vantra-automation-hub`.

## Next steps

Once `npm test` passes locally:

1. Create a focused branch for your change.
2. Make your change and re-run `npm test`.
3. Open a pull request that includes `Closes #ISSUE_NUMBER`.

See [`CONTRIBUTING.md`](../../CONTRIBUTING.md) for the full contribution process.