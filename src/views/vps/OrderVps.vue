<script setup>
  var currencySymbol = "$";
  var templates = {
    "openvz": {
      "centos": "<option value=\"centos-7-x86_64.tar.gz\">7 64bit<\/option><option value=\"centos-7-x86_64-minimal.tar.gz\">7 minimal 64bit<\/option><option value=\"centos-7-x86_64-cpanel.tar.gz\">7 cpanel 64bit<\/option><option value=\"centos-7-x86_64-breadbasket.tar.gz\">7 Webuzo 64bit<\/option>",
      "debian": "<option value=\"debian-8.0-x86_64.tar.gz\">8.0 64bit<\/option><option value=\"debian-8.0-x86_64-minimal.tar.gz\">8.0 minimal 64bit<\/option><option value=\"debian-7.0-x86_64.tar.gz\">7.0 64bit<\/option><option value=\"debian-7.0-x86_64-minimal.tar.gz\">7.0 minimal 64bit<\/option>",
      "fedora": "<option value=\"fedora-23-x86_64.tar.gz\">23 64bit<\/option><option value=\"fedora-22-x86_64.tar.gz\">22 64bit<\/option><option value=\"fedora-21-x86_64.tar.gz\">21 64bit<\/option><option value=\"fedora-20-x86_64.tar.gz\">20 64bit<\/option>",
      "ubuntu": "<option value=\"ubuntu-16.04-x86_64.tar.gz\">16.04 64bit<\/option><option value=\"ubuntu-15.04-x86_64.tar.gz\">15.04 64bit<\/option><option value=\"ubuntu-15.04-x86_64-minimal.tar.gz\">15.04 minimal 64bit<\/option><option value=\"ubuntu-14.04-x86_64.tar.gz\">14.04 64bit<\/option><option value=\"ubuntu-14.04-x86_64-minimal.tar.gz\">14.04 minimal 64bit<\/option><option value=\"ubuntu-12.04-x86_64.tar.gz\">12.04 64bit<\/option><option value=\"ubuntu-12.04-x86_64-minimal.tar.gz\">12.04 minimal 64bit<\/option><option value=\"ubuntu-15.10-x86_64-minimal.tar.gz\">15.10 minimal 64bit<\/option><option value=\"ubuntu-15.04-x86_64-xrdp.tar.gz\">15.04 xrdp 64bit<\/option>"
    },
    "kvm": {
      "almalinux": "<option value=\"cpanel\">cPanel Alma 8 64bit<\/option><option value=\"almalinux9\">9 64bit<\/option><option value=\"almalinux-8.3\">8.3 64bit<\/option><option value=\"da\">8 + DirectAdmin 64bit<\/option><option value=\"webuzo\">8 + Webuzo  64bit<\/option>",
      "centos": "<option value=\"centosstream-8\">8 Stream 64bit<\/option><option value=\"centos-7.7\">7.7 64bit<\/option>",
      "debian": "<option value=\"debian-9\">9 64bit<\/option><option value=\"debian-11\">11 64bit<\/option><option value=\"debian-10\">10 64bit<\/option>",
      "fedora": "<option value=\"fedora-36\">36 64bit<\/option>",
      "freepbx": "<option value=\"freepbx\">7 64bit<\/option>",
      "none": "<option value=\"empty\">1.0 64bit<\/option>",
      "opensuse": "<option value=\"opensuse-42.1\">42.1 64bit<\/option><option value=\"opensuse-13.2\">13.2 64bit<\/option><option value=\"opensuse-13.1\">13.1 64bit<\/option><option value=\"opensuse-tumbleweed\">1.0 64bit<\/option>",
      "ubuntu": "<option value=\"ubuntu-22.04\">22.04 64bit<\/option><option value=\"ubuntu-20.04\">20.04 64bit<\/option><option value=\"ubuntudesktop\">20.04 Desktop 64bit<\/option><option value=\"ubuntu-18.04\">18.04 64bit<\/option><option value=\"ubuntu-16.04\">16.04 64bit<\/option>",
      "windows": "<option value=\"windows2019\">2019 64bit<\/option><option value=\"windowsr2\">2016 64bit<\/option><option value=\"windows2012\">2012 64bit<\/option><option value=\"windows10\">10 64bit<\/option>"
    },
    "kvmstorage": {
      "almalinux": "<option value=\"almalinux9\">9 64bit<\/option><option value=\"almalinux-8.3\">8 64bit<\/option><option value=\"da\">8 64bit<\/option>",
      "debian": "<option value=\"debian-11\">11 64bit<\/option>",
      "none": "<option value=\"empty\">1.0 64bit<\/option>",
      "ubuntu": "<option value=\"ubuntu-22.04\">22.04 64bit<\/option><option value=\"ubuntu-20.04\">20.04 64bit<\/option>"
    },
    "lxc": {
      "centos": "<option value=\"centos\/7\">7 64bit<\/option>",
      "debian": "<option value=\"debian\/10\">1.0 64bit<\/option><option value=\"debian\/8\">1.0 64bit<\/option><option value=\"debian\/sid\">1.0 64bit<\/option><option value=\"debian\/9\">1.0 64bit<\/option><option value=\"debian\/7\">1.0 64bit<\/option>",
      "fedora": "<option value=\"fedora\/28\">28 64bit<\/option><option value=\"fedora\/27\">27 64bit<\/option><option value=\"fedora\/26\">26 64bit<\/option>",
      "opensuse": "<option value=\"opensuse\/42.3\">42.3 64bit<\/option><option value=\"opensuse\/15.0\">15.0 64bit<\/option>",
      "oracle": "<option value=\"oracle\/7\">7 64bit<\/option><option value=\"oracle\/6\">6 64bit<\/option>",
      "ubuntu": "<option value=\"ubuntu\/focal\">20.04 64bit<\/option><option value=\"ubuntu\/18.10\">18.10 64bit<\/option><option value=\"ubuntu\/18.04\">18.04 64bit<\/option><option value=\"wordpress\">18.04 WordPress 64bit<\/option><option value=\"ubuntu\/16.04\">16.04 64bit<\/option><option value=\"ubuntu\/14.04\">14.04 64bit<\/option>"
    },
    "xen": [],
    "vmware": [],
    "hyperv": {
      "windows": "<option value=\"Windows2022\">2022 64bit<\/option><option value=\"Windows2019Standard\">2019 Standard 64bit<\/option>"
    },
    "virtuozzo": {
      "almalinux": "<option value=\"almalinux-8-x86_64\">8 64bit<\/option>",
      "centos": "<option value=\"centos-stream-9-x86_64\">9 Stream 64bit<\/option><option value=\"centos-8.stream-x86_64\">8 Stream 64bit<\/option><option value=\"centos-7-x86_64\">7 64bit<\/option><option value=\"centos-7-x86_64-cpanel\">7 cPanel 64bit<\/option><option value=\"centos-7-x86_64-breadbasket\">7 Webuzo 64bit<\/option>",
      "debian": "<option value=\"debian-9.0-x86_64\">9.0 64bit<\/option><option value=\"debian-7.0-x86_64\">7.0 64bit<\/option><option value=\"debian-11.0-x86_64\">11.0 64bit<\/option><option value=\"debian-10.0-x86_64\">10.0 64bit<\/option><option value=\"debian-8.0-x86_64\">8.0 64bit<\/option>",
      "fedora": "<option value=\"fedora-23-x86_64\">23 64bit<\/option>",
      "suse": "<option value=\"suse-42.3-x86_64\">42.3 64bit<\/option><option value=\"suse-42.1-x86_64\">42.1 64bit<\/option>",
      "ubuntu": "<option value=\"ubuntu-22.04-x86_64\">22.04 64bit<\/option><option value=\"ubuntu-20.04-x86_64\">20.04 64bit<\/option><option value=\"ubuntu-18.04-x86_64\">18.04 64bit<\/option><option value=\"ubuntu-16.04-x86_64\">16.04 64bit<\/option><option value=\"ubuntu-14.04-x86_64\">14.04 64bit<\/option>",
      "vzlinux": "<option value=\"vzlinux-stream-9-x86_64\">9 Stream 64bit<\/option><option value=\"vzlinux-8-x86_64\">8 64bit<\/option><option value=\"vzlinux-8.stream-x86_64\">8 Stream 64bit<\/option><option value=\"vzlinux-7-x86_64\">7 64bit<\/option><option value=\"vzlinux-6-x86_64\">6 64bit<\/option>"
    },
    "platforms": {
      "lxc": "<option value=\"centos\" selected=\"selected\">CentOS<\/option><option value=\"debian\" >Debian<\/option><option value=\"fedora\" >Fedora<\/option><option value=\"opensuse\" >OpenSUSE<\/option><option value=\"oracle\" >Oracle<\/option><option value=\"ubuntu\" >Ubuntu<\/option>",
      "kvm": "<option value=\"debian\" >Debian<\/option><option value=\"opensuse\" >OpenSUSE<\/option><option value=\"ubuntu\" >Ubuntu<\/option><option value=\"centos\" selected=\"selected\">CentOS<\/option><option value=\"almalinux\" >Almalinux<\/option><option value=\"none\" >Empty Disk<\/option><option value=\"freepbx\" >FreePBX<\/option><option value=\"fedora\" >Fedora<\/option><option value=\"windows\" disabled=\"disabled\">Windows (only on HyperV)<\/option>",
      "hyperv": "<option value=\"windows\" >Windows<\/option>",
      "kvmstorage": "<option value=\"ubuntu\" >Ubuntu<\/option><option value=\"none\" >Empty Disk<\/option><option value=\"debian\" >Debian<\/option><option value=\"almalinux\" >Almalinux<\/option>"
    }
  };
  var virtuozzo_slice_cost = 6;
  var ssd_virtuozzo_slice_cost = 9;
  var hyperv_slice_cost = 10;
  var xen_slice_cost = 6;
  var lxc_slice_cost = 6;
  var vmware_slice_cost = 10;
  var ssd_slice_cost = 9;
  var ovz_slice_cost = 6;
  var kvm_l_slice_cost = 6;
  var kvm_storage_slice_cost = 6;
  var ny_cost = 3;
  var ipv6_only_discount = 1;
  var kvm_w_slice_cost = 10;
  var hd_slice_storage = 1000;
  var cpanel_cost = 20;
  var da_cost = 8;
  var bw_type = 2;
  var bw_total = 2;
  var bw_slice = 2000;
  var hd_slice = 30;
  var ram_slice = 2048;
  var cur_location = Number(jQuery("select[name=location]").val());
  var cur_period = Number(jQuery("#period").val());
  var cur_platform = jQuery("select[name=platform]").val();
  var cur_image = jQuery("select[name=version]").val();
  var cur_ssd = jQuery("select[name=ssd]").val();
  var cur_control = jQuery("select[name=controlpanel]").val();
  var cur_slices = Number(jQuery("select[name=slices]").val());
  var slice_cost = ovz_slice_cost;
  var control_cost = 0;
  var coupon_info = 0;
  var last_coupon = "";
  var currency = "USD";
  var packages = {
    "0": "Select A VPS Type",
    "31": "OpenVZ VPS Slice",
    "32": "KVM Windows VPS Slice",
    "33": "KVM Linux VPS Slice",
    "34": "Cloud KVM Windows VPS Slice",
    "35": "Cloud KVM Linux VPS Slice",
    "36": "SSD OpenVZ VPS Slice",
    "49": "LXC VPS Slice",
    "51": "Xen Windows VPS Slice",
    "52": "Xen Linux VPS Slice",
    "53": "VMware VPS Slice",
    "54": "Hyper-V VPS Slice",
    "55": "Virtuozzo VPS Slice",
    "56": "SSD Virtuozzo VPS Slice",
    "57": "KVM Storage",
    "58": "OpenVZ IPv6 Only VPS Slice",
    "59": "KVM Windows IPv6 Only VPS Slice",
    "60": "KVM Linux IPv6 Only VPS Slice",
    "61": "Hyper-V IPv6 Only VPS Slice",
    "62": "Virtuozzo IPv6 Only VPS Slice",
    "63": "KVM IPv6 Only Storage"
  };
</script>

<template>
<template v-if="step == 'orderform'">
</template>
<template v-else-if="step == 'order_confirm'">
</template>
</template>

<style scoped>
</style>