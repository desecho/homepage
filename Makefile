.DEFAULT_GOAL := help

include help.mk

#------------------------------------
# Installation
#------------------------------------
BIN_DIR := /usr/local/bin

SHFMT_VERSION := 3.4.3
SHFMT_PATH := ${BIN_DIR}/shfmt

.PHONY: install-shfmt
## Install shfmt | Installation
install-shfmt:
	sudo curl https://github.com/mvdan/sh/releases/download/v${SHFMT_VERSION}/shfmt_v${SHFMT_VERSION}_linux_amd64 -Lo ${SHFMT_PATH}
	sudo chmod +x ${SHFMT_PATH}

HADOLINT_VERSION := 2.10.0
HADOLINT_PATH := ${BIN_DIR}/hadolint

.PHONY: install-hadolint
## Install hadolint
install-hadolint:
	sudo curl https://github.com/hadolint/hadolint/releases/download/v${HADOLINT_VERSION}/hadolint-Linux-x86_64 -Lo ${HADOLINT_PATH}
	sudo chmod +x ${HADOLINT_PATH}

ACTIONLINT_VERSION := 1.6.13
ACTIONLINT_PATH := ${BIN_DIR}/actionlint
ACTIONLINT_URL := https://github.com/rhysd/actionlint/releases/download/v${ACTIONLINT_VERSION}/actionlint_${ACTIONLINT_VERSION}_linux_amd64.tar.gz
ACTIONLINT_TMP_DIR := $(shell mktemp -d)
ACTIONLINT_ARCHIVE := actionlint.tar.gz

.PHONY: install-actionlint
## Install actionlint
install-actionlint:
	cd ${ACTIONLINT_TMP_DIR} && \
	curl ${ACTIONLINT_URL} -Lo ${ACTIONLINT_ARCHIVE} && \
	tar -xvf ${ACTIONLINT_ARCHIVE} && \
	sudo mv actionlint ${ACTIONLINT_PATH}

.PHONY: install-linters-binaries
## Install linters binaries
install-linters-binaries: install-shfmt install-hadolint install-actionlint
#------------------------------------
# Commands
#------------------------------------
.PHONY: preview
## Show preview | Commands
preview:
	firefox src/index.html

.PHONY: lint
## Run linters
lint:
	markdownlint README.md
	yamllint .github deployment
	hadolint Dockerfile
	actionlint

.PHONY: format
## Format files
format:
	markdownlint README.md --fix

#------------------------------------
# Docker commands
#------------------------------------
.PHONY: docker-build
## Run docker build | Docker
docker-build:
	docker build -t homepage .

.PHONY: docker-run
## Run docker run
docker-run:
	docker run -p 8000:80 homepage

.PHONY: docker-sh
## Run docker shell
docker-sh:
	docker run -ti homepage sh
#------------------------------------


#------------------------------------
# Scripts
#------------------------------------
.PHONY: flush-cdn-cache
flush-cdn-cache:
	scripts/flush_cdn_cache.sh
#------------------------------------
