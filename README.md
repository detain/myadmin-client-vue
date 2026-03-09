# InterServer MyAdmin Client Interface

Check out the [WIKI](wiki) for documentation.

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
