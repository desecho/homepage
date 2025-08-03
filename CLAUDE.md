# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `make preview` - Open the homepage in Firefox for local preview
- `make help` - Show all available commands with descriptions

### Linting and Formatting
- `make lint` - Run linters (hadolint for Docker, actionlint for GitHub Actions)
- `make format` - Format files using pre-commit hooks
- `make install-linters-binaries` - Install all required linter binaries
- `make install-pre-commit` - Install pre-commit tool
- `make set-up-pre-commit` - Set up pre-commit git hooks

### Docker
- `make docker-build` - Build Docker image tagged as 'homepage'
- `make docker-run` - Run the homepage server in Docker on port 8000
- `make docker-sh` - Open a shell in the Docker container

### Deployment
- `make flush-cdn-cache` - Flush CDN cache (used in CI)

## Architecture

This is a static personal homepage built with vanilla HTML/CSS and Bootstrap 5. The architecture is simple:

### Core Structure
- **Frontend**: Single-page HTML application using Bootstrap 5 grid system
- **Styling**: Custom CSS with Bootstrap 5 framework via CDN
- **Assets**: Static images stored in `src/img/` for social media and service icons
- **Certificates**: PDF certificates stored in `cdn/certificates/`

### Deployment Architecture
- **Containerization**: Nginx-based Docker container serving static files
- **CI/CD**: GitHub Actions with multi-stage pipeline (test → build → upload → deploy)
- **Hosting**: Kubernetes deployment on DigitalOcean
- **CDN**: DigitalOcean Spaces for static asset delivery
- **Domain**: Live at https://samarchyan.me

### Key Files
- `src/index.html` - Main homepage with 4-column layout (Websites, Career, Projects, Contacts)
- `src/style.css` - Custom styling for layout and image formatting
- `Dockerfile` - Nginx Alpine container configuration
- `deployment/` - Kubernetes manifests (deployment, service, ingress)
- `Makefile` - Task automation with organized help system

### Content Management
The homepage displays personal links organized into categories. Images are optimized to 75px width with consistent styling. All external links open in new tabs except email contact.

### Build System
Uses Make-based build system with modular makefiles in `makefiles/` directory. No package.json exists - this is a pure static site with external CDN dependencies.