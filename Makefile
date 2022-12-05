.SILENT:
.DEFAULT_GOAL := help

include makefiles/colors.mk
include makefiles/help.mk
include makefiles/macros.mk
include makefiles/deps.mk
include makefiles/helpers.mk

#------------------------------------
# Installation
#------------------------------------

.PHONY: install-linters-binaries
## Install linters binaries | Installation
install-linters-binaries: .install-shfmt .install-hadolint .install-actionlint .install-shellcheck

.PHONY: install
## Install linters binaries (install-linters-binaries alias)
install: install-linters-binaries

.PHONY: install-pre-commit
## Install pre-commit
install-pre-commit:
	$(call print,Installing pre-commit)
	sudo pip3 install pre-commit

.PHONY: setup-pre-commit
## Set up pre-commit. Activate git hooks
set-up-pre-commit:
	$(call print,Setting up pre-commit)
	pre-commit install

#------------------------------------
# Commands
#------------------------------------

.PHONY: preview
## Show preview | Commands
preview:
	$(call print,Previewing)
	firefox src/index.html

.PHONY: lint
## Run linters
lint: .pre-commit
	$(call print,Running linters)
	hadolint Dockerfile
	actionlint

.PHONY: format
## Format files
format: .pre-commit
	$(call print,Formatting files)

#------------------------------------
# Docker commands
#------------------------------------

.PHONY: docker-build
## Run docker build | Docker
docker-build:
	$(call print,Building Docker image)
	docker build -t homepage .

.PHONY: docker-run
## Run docker run
docker-run:
	$(call print,Running server in docker)
	docker run -p 8000:80 homepage

.PHONY: docker-sh
## Run docker shell
docker-sh:
	$(call print,Running docker shell)
	docker run -ti homepage sh

#------------------------------------

#------------------------------------
# Scripts
#------------------------------------

.PHONY: flush-cdn-cache
flush-cdn-cache:
	$(call print,Running flush CDN cache script)
	scripts/flush_cdn_cache.sh

#------------------------------------
