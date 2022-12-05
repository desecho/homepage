.DEFAULT_GOAL := help

include makefiles/colors.mk
include makefiles/help.mk
include makefiles/macros.mk

#------------------------------------
# Helpers
#------------------------------------

.PHONY: pre-commit
.pre-commit:
	@pre-commit run --all-files

#------------------------------------
# Installation
#------------------------------------

BIN_DIR := /usr/local/bin

SHFMT_VERSION := 3.4.3
SHFMT_PATH    := ${BIN_DIR}/shfmt

.PHONY: install-shfmt
install-shfmt:
	$(call print,Installing shfmt)
	@sudo curl https://github.com/mvdan/sh/releases/download/v${SHFMT_VERSION}/shfmt_v${SHFMT_VERSION}_linux_amd64 -Lo ${SHFMT_PATH}
	@sudo chmod +x ${SHFMT_PATH}

SHELLCHECK_VERSION := 0.8.0
SHELLCHECK_PATH    := $(BIN_DIR)/shellcheck
SHELLCHECK_TMP_DIR := $(shell mktemp -d)
SHELLCHECK_ARCHIVE := shellcheck.tar.xz

.PHONY: install-shellcheck
## Install shellcheck
install-shellcheck:
	$(call print,Installing shellcheck)
	@cd $(SHELLCHECK_TMP_DIR) \
		&& curl https://github.com/koalaman/shellcheck/releases/download/v$(SHELLCHECK_VERSION)/shellcheck-v$(SHELLCHECK_VERSION).linux.x86_64.tar.xz -Lo $(SHELLCHECK_ARCHIVE) \
		&& tar -xf $(SHELLCHECK_ARCHIVE) \
		&& sudo cp shellcheck-v$(SHELLCHECK_VERSION)/shellcheck $(SHELLCHECK_PATH)

HADOLINT_VERSION := 2.10.0
HADOLINT_PATH := ${BIN_DIR}/hadolint

.PHONY: install-hadolint
install-hadolint:
	$(call print,Installing hadolint)
	@sudo curl https://github.com/hadolint/hadolint/releases/download/v${HADOLINT_VERSION}/hadolint-Linux-x86_64 -Lo ${HADOLINT_PATH}
	@sudo chmod +x ${HADOLINT_PATH}

ACTIONLINT_VERSION := 1.6.13
ACTIONLINT_PATH    := ${BIN_DIR}/actionlint
ACTIONLINT_URL     := https://github.com/rhysd/actionlint/releases/download/v${ACTIONLINT_VERSION}/actionlint_${ACTIONLINT_VERSION}_linux_amd64.tar.gz
ACTIONLINT_TMP_DIR := $(shell mktemp -d)
ACTIONLINT_ARCHIVE := actionlint.tar.gz

.PHONY: install-actionlint
install-actionlint:
	$(call print,Installing actionlint)
	@cd ${ACTIONLINT_TMP_DIR} && \
	curl ${ACTIONLINT_URL} -Lo ${ACTIONLINT_ARCHIVE} && \
	tar -xvf ${ACTIONLINT_ARCHIVE} && \
	sudo mv actionlint ${ACTIONLINT_PATH}

.PHONY: install-linters-binaries
## Install linters binaries | Installation
install-linters-binaries: install-shfmt install-hadolint install-actionlint install-shellcheck

.PHONY: install
## Install linters binaries (install-linters-binaries alias)
install: install-linters-binaries

.PHONY: install-pre-commit
## Install pre-commit
install-pre-commit:
	$(call print,Installing pre-commit)
	@sudo pip3 install pre-commit

.PHONY: setup-pre-commit
## Set up pre-commit. Activate git hooks
set-up-pre-commit:
	$(call print,Setting up pre-commit)
	@pre-commit install

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
	@hadolint Dockerfile
	@actionlint

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
	@docker build -t homepage .

.PHONY: docker-run
## Run docker run
docker-run:
	$(call print,Running server in docker)
	@docker run -p 8000:80 homepage

.PHONY: docker-sh
## Run docker shell
docker-sh:
	$(call print,Running docker shell)
	@docker run -ti homepage sh
#------------------------------------

#------------------------------------
# Scripts
#------------------------------------
.PHONY: flush-cdn-cache
flush-cdn-cache:
	$(call print,Running flush CDN cache script)
	@scripts/flush_cdn_cache.sh
#------------------------------------
