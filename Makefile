.DEFAULT_GOAL := help

include help.mk

#------------------------------------
# Main
#------------------------------------

.PHONY: preview
## Show preview | Main
preview:
	firefox src/index.html

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
