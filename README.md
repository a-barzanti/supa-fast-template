# 🧪 supa-fast-template

A full-stack starter template that combines the raw backend power of **FastAPI**, the magic of **Supabase**, and the chaos of a modern **Next.js + React + TypeScript + Tailwind** frontend.

Because what’s life without some suffering?

Inspired by the work done for the backend in:
https://github.com/AtticusZeller/fastapi_supabase_template

---

## 🧰 Tech Stack

Some guiding principles the justify some of the choices:

- Assuming a unix style environment (Docker, MacOS, Linux, WSL)
- The versioning process should really be managed by the target application, so we just want to provide supporting files
- The root project should not need package management (for Python nor Node.js)
  This means that scripting is in bash, and Git Related Library are simple/generic enough
- The frontend is using it's own monorepo structure, providing: componenet library, one vite version of the admin, one next.js version, and Storybook docs.

- **Frontend**: Next.js + React + TypeScript + Tailwind CSS
- **Backend**: FastAPI + PostgreSQL (via Supabase)
- **Database & Auth**: Supabase
- **Tooling Root/Git**: Docker, Makefile, Manual Git Hooks

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-name/supa-fast-template.git
cd supa-fast-template
```

### 2. Version management

The suggestion in line with the principles is to use `Release Please` supporting files are provided.

### 3. [Supabase](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=linux&queryGroups=access-method&access-method=postgres)

install supabase-cli

```bash
# brew in linux https://brew.sh/
brew install supabase/tap/supabase
```

launch supabase docker containers

```bash
# under repo root
supabase start
```

> [!NOTE]
>
> ```bash
> # Update `.env` from supabase
> make envupdate
> ```
>
> modify the `.env` from the output of `supabase start` or run `supabase status` manually.
