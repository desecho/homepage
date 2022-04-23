.DEFAULT_GOAL := help

include help.mk

#------------------------------------
# Installation
#------------------------------------

SHFMT_VERSION := 3.4.3
SHFMT_PATH := /usr/local/bin/shfmt

.PHONY: install-shfmt
## Install shfmt | Installation
install-shfmt:
	sudo curl https://github.com/mvdan/sh/releases/download/v${SHFMT_VERSION}/shfmt_v${SHFMT_VERSION}_linux_amd64 -Lo ${SHFMT_PATH}
	sudo chmod +x ${SHFMT_PATH}

HADOLINT_VERSION := 2.10.0
HADOLINT_PATH := /usr/local/bin/hadolint

.PHONY: install-hadolint
## Install hadolint
install-hadolint:
	sudo curl https://github.com/hadolint/hadolint/releases/download/v${HADOLINT_VERSION}/hadolint-Linux-x86_64 -Lo ${HADOLINT_PATH}
	sudo chmod +x ${HADOLINT_PATH}

#------------------------------------
# Commands
#------------------------------------

.PHONY: preview
## Show preview | Commands
preview:
	firefox src/index.

.PHONY: lint
## Run linters
lint:
	markdownlint README.md
	yamllint .github deployment
	hadolint Dockerfile

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
