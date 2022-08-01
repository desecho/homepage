.DEFAULT_GOAL := help

include makefiles/colors.mk
include makefiles/help.mk
include makefiles/macros.mk

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
install-linters-binaries: install-shfmt install-hadolint install-actionlint

.PHONY: install
## Install linters binaries (install-linters-binaries alias)
install: install-linters-binaries

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
lint:
	$(call print,Running linters)
	@markdownlint README.md
	@prettier --check ./.github/**/*.yaml ./**/*.yaml
	@hadolint Dockerfile
	@actionlint
	@prettier --check ./**/*.html

.PHONY: format
## Format files
format:
	$(call print,Formatting files)
	@prettier --write ./**/*.html
	@markdownlint README.md --fix
	@prettier --write ./.github/**/*.yaml ./**/*.yaml

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
