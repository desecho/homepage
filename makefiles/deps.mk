BIN_DIR := /usr/local/bin

# shfmt
# https://github.com/mvdan/sh/releases
SHFMT_VERSION := 3.5.1
SHFMT_PATH    := $(BIN_DIR)/shfmt

.PHONY: .install-shfmt
.install-shfmt:
	$(call print,Installing shfmt)
	sudo curl https://github.com/mvdan/sh/releases/download/v$(SHFMT_VERSION)/shfmt_v$(SHFMT_VERSION)_linux_amd64 -Lo $(SHFMT_PATH)
	sudo chmod +x $(SHFMT_PATH)

# shellcheck
# https://github.com/koalaman/shellcheck/releases
SHELLCHECK_VERSION := 0.8.0
SHELLCHECK_PATH    := $(BIN_DIR)/shellcheck
SHELLCHECK_TMP_DIR := $(shell mktemp -d)
SHELLCHECK_ARCHIVE := shellcheck.tar.xz

.PHONY: .install-shellcheck
.install-shellcheck:
	$(call print,Installing shellcheck)
	cd $(SHELLCHECK_TMP_DIR) \
		&& curl https://github.com/koalaman/shellcheck/releases/download/v$(SHELLCHECK_VERSION)/shellcheck-v$(SHELLCHECK_VERSION).linux.x86_64.tar.xz -Lo $(SHELLCHECK_ARCHIVE) \
		&& tar -xf $(SHELLCHECK_ARCHIVE) \
		&& sudo cp shellcheck-v$(SHELLCHECK_VERSION)/shellcheck $(SHELLCHECK_PATH)

# hadolint
# https://github.com/hadolint/hadolint/releases/
HADOLINT_VERSION := 2.12.0
HADOLINT_PATH    := $(BIN_DIR)/hadolint

.PHONY: .install-hadolint
.install-hadolint:
	$(call print,Installing hadolint)
	sudo curl https://github.com/hadolint/hadolint/releases/download/v$(HADOLINT_VERSION)/hadolint-Linux-x86_64 -Lo $(HADOLINT_PATH)
	sudo chmod +x $(HADOLINT_PATH)

# actionlint
# https://github.com/rhysd/actionlint/releases
ACTIONLINT_VERSION := 1.6.22
ACTIONLINT_PATH    := $(BIN_DIR)/actionlint
ACTIONLINT_URL     := https://github.com/rhysd/actionlint/releases/download/v$(ACTIONLINT_VERSION)/actionlint_$(ACTIONLINT_VERSION)_linux_amd64.tar.gz
ACTIONLINT_TMP_DIR := $(shell mktemp -d)
ACTIONLINT_ARCHIVE := actionlint.tar.gz

.PHONY: .install-actionlint
.install-actionlint:
	$(call print,Installing actionlint)
	cd $(ACTIONLINT_TMP_DIR) && \
	curl $(ACTIONLINT_URL) -Lo $(ACTIONLINT_ARCHIVE) && \
	tar -xvf $(ACTIONLINT_ARCHIVE) && \
	sudo mv actionlint $(ACTIONLINT_PATH)
