# InterServer MyAdmin Client Interface

[![CI/CD - Web, Electron, Capacitor](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml)
[![Playwright E2E Tests](https://github.com/detain/myadmin-client-vue/actions/workflows/playwright.yml/badge.svg)](https://github.com/detain/myadmin-client-vue/actions/workflows/playwright.yml)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/detain/myadmin-client-vue)](https://github.com/detain/myadmin-client-vue/releases/latest)
[![GitHub last commit](https://img.shields.io/github/last-commit/detain/myadmin-client-vue)](https://github.com/detain/myadmin-client-vue/commits/master)
[![GitHub issues](https://img.shields.io/github/issues/detain/myadmin-client-vue)](https://github.com/detain/myadmin-client-vue/issues)
[![License](https://img.shields.io/github/license/detain/myadmin-client-vue)](https://github.com/detain/myadmin-client-vue/blob/master/LICENSE)
![Coverage](coverage/badge.svg)

Check out the [Wiki](https://github.com/detain/myadmin-client-vue/wiki) for documentation.

## Build Artifacts

Latest build artifacts are available from the [CI/CD workflow](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml):

| Platform | Artifact |
|----------|----------|
| Web | [web](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml) |
| Linux x64 | [linux-x64-appimage](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml), [linux-x64-deb](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml), [linux-x64-snap](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml) |
| Linux arm64 | [linux-arm64-appimage](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml), [linux-arm64-deb](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml) |
| Windows x64 | [installer](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml), [portable](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml) |
| Windows arm64 | [installer](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml), [portable](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml) |
| macOS | [dmg](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml), [pkg](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml) |
| Android | [apk](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml) |
| iOS | [app](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml) |

## Testing

| Suite | Command | Status |
|-------|---------|--------|
| Vitest Unit Tests & Coverage | `yarn test` / `yarn test:coverage` | [![CI/CD](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml) |
| Playwright E2E Tests | `yarn test:e2e` | [![Playwright E2E Tests](https://github.com/detain/myadmin-client-vue/actions/workflows/playwright.yml/badge.svg)](https://github.com/detain/myadmin-client-vue/actions/workflows/playwright.yml) |

Test results, coverage reports, and Playwright HTML reports are uploaded as artifacts on each CI run. View them in the [Actions tab](https://github.com/detain/myadmin-client-vue/actions).

### Coverage Summary

| Category | % Stmts | % Branch | % Funcs | % Lines |
|----------|---------|----------|---------|---------|
| **All files** | 89.49 | 88.09 | 74.22 | 89.68 |
| Components | 93.39 | 83.33 | 88.52 | 95.16 |
| Helpers | 98.96 | 93.47 | 100 | 98.93 |
| Stores | 99.72 | 86.20 | 98.64 | 99.71 |
| Views | 87.69 | 83.36 | 91.37 | 88.26 |
| Router | 44.85 | 97.29 | 30.55 | 43.60 |
| i18n | 95.65 | 100 | 92.30 | 100 |

Run `yarn test:coverage` to generate a detailed HTML report in `coverage/`.

## FAQ

### Getting a blank page when loading the site

Check your ad blocker or privacy addons, they might need to be disabled for this site.

## Features

- Web version for browsers
- Desktop app via Electron
- Auto-update support
- Linux (.AppImage, .deb, Snap)
- Windows (.exe installer, portable)
- macOS (.dmg, .pkg)
- Android (.apk)
- iPhone

## Downloads

<!-- DOWNLOADS-START -->
<!-- DOWNLOADS-END -->

## Installation

### Web
1. Download the ZIP
2. Extract to any folder
3. Open `index.html` in your browser

### Electron
Follow instructions for your platform after downloading the respective installer or ZIP.

### Linux
```bash
# AppImage
chmod +x MyApp-*.AppImage
./MyApp-*.AppImage
```

### How it Works

We use Vue 3 with the Composition API to provide an entire website/application in a single page.  This is done using a combination of Vue SFC's (Single File Components) which and the Vue Router to change the url in the browser without actually navigating to a new page.

Variables are mostly handled by reference (like a pointer).  This allows us to pass around variables that are ukept up to date when changed in other sections of the site.


GitHub Asset Pipeline was setup like this:
```shell
# create user with no shell access
sudo useradd -m -d /srv/sftp/github -s /usr/sbin/nologin githubci
# disable password logi
sudo passwd -l githubci
sudo mkdir -p /srv/sftp/github/uploads
# prevent the user from writing to the root of the chroot directory
but allow them to write to the uploads directory
sudo chown root:root /srv/sftp/github
sudo chmod 755 /srv/sftp/github
# give user write permissions in /uploads dir
sudo chown githubci:githubci /srv/sftp/github/uploads
# disable the user to do anyting but sftp and have him chrooted
echo 'Match User githubci
ChrootDirectory /srv/sftp/github
ForceCommand internal-sftp
X11Forwarding no
AllowTcpForwarding no
PasswordAuthentication no' >> /etc/ssh/sshd_config
sudo mkdir -p /srv/sftp/github/.ssh
sudo chmod 700 /srv/sftp/github/.ssh
sudo systemctl restart ssh
ssh-keygen -t ed25519 -C "github-ci" -f github-ci-key
sudo nano /srv/sftp/github/.ssh/authorized_keys
sudo chmod 600 /srv/sftp/github/.ssh/authorized_keys
sudo chown githubci:githubci /srv/sftp/github/.ssh/authorized_keys
```
