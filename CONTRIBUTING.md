# Contributing to the Project

Thank you for your interest in contributing! To maintain a clean history and ensure a smooth development process, we follow a specific workflow. Please follow these guidelines to get started.

---

## 1. Getting Started

### Fork the Repository

First, create your own copy of the repository by clicking the **Fork** button at the top of the page. Clone your fork to your local machine:

```bash
git clone https://github.com/YOUR-USERNAME/repository-name.git
cd repository-name

```

### Configure Upstream

Add the original repository as a remote to keep your local fork in sync:

```bash
git remote add upstream https://github.com/ORIGINAL-OWNER/repository-name.git

```

---

## 2. Branching and Development

### Create a Feature Branch

Before starting any work, create a new branch. We use **Conventional Naming** based on the issue or ticket you are addressing:

- `feat/issue-ID` (e.g., `feat/123-add- login-logic`)
- `fix/issue-ID` (e.g., `fix/456-patch-security-hole`)
- `docs/issue-ID`
- `refactor/issue-ID`

```bash
git checkout -b feat/123-short-description
```

See [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#specification).

### Stay in Sync (Rebase Flow)

Our repository uses a **rebase flow** to keep the history linear. When pulling updates from the main repository, always use the `--rebase` (or `-r`) flag to avoid merge commits:

```bash
git pull -r upstream main

```

---

## 3. Commit Guidelines

We follow the **Conventional Commits** specification. Commits should be structured as follows:

`<type>(<scope>): <description>`

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature

**Example:**
`feat(auth): add JWT validation to login endpoint`

See [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#specification).

---

## 4. Submitting a Pull Request

Once you have completed your work and verified it locally:

1. **Push to your fork:**

```bash
git push origin your-branch-name
```

2. **Raise a PR:** Navigate to the original repository on GitHub. You will see a prompt to "Compare & pull request" from your fork.
3. **Target Branch:** Ensure your PR is targeting the `main` repository's `dev` or `main` branch as specified in the issue.
4. **Review:** Wait for the maintainers to review your code. We may request changes before merging.

Thank you for helping us improve the project!
