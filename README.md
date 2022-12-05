# Homepage

[![Deployment](https://github.com/desecho/homepage/actions/workflows/deployment.yaml/badge.svg)](https://github.com/desecho/homepage/actions/workflows/deployment.yaml)

Uses [Bootstrap 5](https://getbootstrap.com/).

Website is live at <https://samarchyan.me>.

Run `make` to get a list of all available commands.

Run in docker:

1. Run `make docker-build`
2. Run `make docker-run`

## Cron jobs

Cron jobs are run with [GitHub Actions](https://github.com/features/actions). Time zone is UTC.

- `Update GitHub actions` runs at 04:00 UTC (00:00 EDT) on the first day of the month

## CI/CD

[GitHub Actions](https://github.com/features/actions) are used for CI/CD.

Deployment is automatically done in master branch.

The following GitHub Actions are used:

- [Checkout](https://github.com/marketplace/actions/checkout)
- [Docker Login](https://github.com/marketplace/actions/docker-login)
- [Build and push Docker images](https://github.com/marketplace/actions/build-and-push-docker-images)
- [GitHub Action for DigitalOcean - doctl](https://github.com/marketplace/actions/github-action-for-digitalocean-doctl)
- [Kubectl tool installer](https://github.com/marketplace/actions/kubectl-tool-installer)
- [DigitalOcean Spaces Upload Action](https://github.com/marketplace/actions/digitalocean-spaces-upload-action)
- [Cache](https://github.com/marketplace/actions/cache)
- [Docker Setup Buildx](https://github.com/marketplace/actions/docker-setup-buildx)
- [GitHub Actions Version Updater](https://github.com/marketplace/actions/github-actions-version-updater)

## Image sources

- [Telegram](https://telegram.org/)
- [Instagram](https://en.facebookbrand.com/instagram/assets/instagram)
- [Upwork](https://www.upwork.com/press#media-resources)
- [Github](https://github.com/logos)
- [Flickr](https://help.flickr.com/en_us/brand-guidelines-r1KCpZZvS)
- [Linkedin](https://brand.linkedin.com/downloads)
- [Fl.ru](https://www.fl.ru/)
- [Gmail](https://about.google/brand-resource-center/logos-list/)
- [Facebook](https://en.facebookbrand.com/facebookapp/assets/f-logo?audience=landing)
- [VK](https://vk.com/brand)
- [Backloggery](https://backloggery.com/games)
- [Discord](https://discord.com/branding)
- [Steam](https://partner.steamgames.com/doc/marketing/branding)
- [Playstation](https://www.playstation.com/)
- [Twitter](https://about.twitter.com/en/who-we-are/brand-toolkit)
- [PCPartPicker](https://pcpartpicker.com/)
- [Twitch](https://www.twitch.tv/p/press-center/)
