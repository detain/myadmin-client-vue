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

<!-- TEST-RESULTS-START -->
### Latest Test Results

🟢 **840/840 tests passing** across 284 suites | 29.37s

| Category | % Stmts | % Branch | % Funcs | % Lines |
|----------|---------|----------|---------|---------|
| **All files** | 88.01 | 85.76 | 68.05 | 88.36 |
| Assets | 100.00 | 100.00 | 100.00 | 100.00 |
| Components | 91.34 | 79.81 | 90.26 | 91.35 |
| Helpers | 100.00 | 98.44 | 100.00 | 100.00 |
| I18n | 96.42 | 95.00 | 93.33 | 100.00 |
| Locales | 100.00 | 100.00 | 100.00 | 100.00 |
| Mocks | 53.13 | 50.00 | 50.00 | 53.13 |
| Router | 50.33 | 95.34 | 31.81 | 49.32 |
| Stores | 99.39 | 94.17 | 98.99 | 99.39 |
| Views | 92.08 | 93.03 | 87.72 | 92.34 |

_Last updated: 2026-04-03 via [CI/CD](https://github.com/detain/myadmin-client-vue/actions/workflows/ci-cd.yml)_
<!-- TEST-RESULTS-END -->

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
## Latest Downloads (v0.99.5)

### Web
- [Web (zip)](https://github.com/detain/myadmin-client-vue/releases/download/v0.99.5/my-interserver-client-web-0.99.5.zip)

### Electron
#### Linux
- [x64](https://github.com/detain/myadmin-client-vue/releases/download/v0.99.5/my-interserver-client-0.99.5-linux-x64.zip)
- [arm64](https://github.com/detain/myadmin-client-vue/releases/download/v0.99.5/my-interserver-client-0.99.5-linux-arm64.zip)
#### Windows
- [x64](https://github.com/detain/myadmin-client-vue/releases/download/v0.99.5/my-interserver-client-0.99.5-windows-x64.zip)
- [arm64](https://github.com/detain/myadmin-client-vue/releases/download/v0.99.5/my-interserver-client-0.99.5-windows-arm64.zip)
#### macOS
- [Universal](https://github.com/detain/myadmin-client-vue/releases/download/v0.99.5/my-interserver-client-0.99.5-mac.zip)
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

We use Vue 3 with the Composition API to provide an entire website/application in a single page. This is done using a combination of Vue SFC's (Single File Components) which and the Vue Router to change the url in the browser without actually navigating to a new page.

Variables are mostly handled by reference (like a pointer). This allows us to pass around variables that are ukept up to date when changed in other sections of the site.


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
