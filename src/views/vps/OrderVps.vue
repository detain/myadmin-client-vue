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
<div class="row justify-content-center">
  <div class="col-md-6">
    <div class="card">
      <div class="card-header">
        <div class="p-1">
          <h3 class="card-title py-2">
            <i class="fas fa-server" aria-hidden="true">&nbsp;</i>Order VPS
          </h3>
          <div class="card-tools float-right">
            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <form id="vps_form" method="POST" class="vps_form_init" action="vps/order">
          <input type="hidden" name="csrf_token" value="10db0588e5fb1ab8d201c45cad1eacb9d8253f0dc80ff82f7a01d2726f3b6d448a085644cf4e9e5be06ef2efb8b7edf045a5b472ceebe7205989b8b4b4052051">
          <input type='hidden' id="total_cost_display" name='total_cost_display' value='6' />
          <input type='hidden' id="period" name='period' value=1 />
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">VPS Details</label>
            <div class="col-sm-9 form-control bg-gradient-gray text-center b-radius">
              <div class="d-inline pr-3"><span>Storage: </span> <span class="text-bold" id="storage"></span>
              </div>
              <div class="d-inline pr-3"><span>Memory: </span> <span class="text-bold" id="memory_recommended"></span></div>
              <div class="d-inline"><span>Transfer: </span> <span class="text-bold" id="Transfer_bandwidth"></span></div>
            </div>
          </div>
          <hr>
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">Platform <span class="text-danger"> *</span>
            </label>
            <div class="col-sm-9">
              <select name="platform" onchange="update_vps_choices();" class="form-control select2">
                <option value="kvm">KVM</option>
                <option value="kvmstorage">KVM Storage</option>
                <option value="hyperv">HyperV</option>
              </select>
              <small id="slicecost" class="form-text text-muted"></small>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">Location<span class="text-danger">
                *</span></label>
            <div class="col-sm-9 input-group">
              <select name="location" onchange="update_vps_choices();" class="form-control select2">
                <option value="1">New Jersey</option>
                <option value="2">Los Angeles</option>
                <option value="3">Equinix NY4</option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">Slices<span class="text-danger"> *</span></label>
            <div class="col-sm-9">
              <select id="slices_sel" name="slices" onchange="update_vps_choices();" class="form-control select2">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">Image<span class="text-danger"> *</span></label>
            <div class="col-sm-9">
              <select name="version" onchange="update_vps_choices();" class="form-control select2">
                <option value="centos">CentOS</option>
                <option value="debian">Debian</option>
                <option value="fedora">Fedora</option>
                <option value="opensuse">OpenSUSE</option>
                <option value="oracle">Oracle</option>
                <option value="ubuntu">Ubuntu</option>
                <option value="windows">Windows</option>
                <option value="almalinux">Almalinux</option>
                <option value="none">Empty Disk</option>
                <option value="freepbx">FreePBX</option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">Version<span class="text-danger">
                *</span></label>
            <div class="input-group col-md-9">
              <select class="form-control select2" name="vpsos" onchange="update_vps_choices();">
                <option value="centosstream-8">
                  8 Stream</option>
                <option value="centos-7.7">
                  7.7</option>
              </select>
            </div>
          </div>
          <div id="hostnamerownew" class="form-group row">
            <label class="col-sm-3 col-form-label">Hostname </label>
            <div class="col-md-9">
              <input type="text" id="hostname" name="hostname" data-toggle="popover" title="Tip" data-content="Pick a unique hostname to identify the machine. It does not have to be registered or resolve. It can be anything you like. Example: database1.mywebsite.com" onkeyup="update_hostname();" onchange="update_hostname();" class="form-control text-sm" placeholder="server.domain.com" value="">
            </div>
          </div>
          <div id="rootpassrownew" class="row">
            <label class="col-sm-3 col-form-label">Root Password <span class="text-danger"> *</span>
            </label>
            <div class="form-group col-md-9">
              <input type="text" name="rootpass" class="form-control text-sm" value="RWUpB@a5">
              <small class="form-text text-muted">Note: Password must contain atleast 8 characters, one lowercase letter, one uppercase letter, one number, a special character.</small>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">Coupon Code</label>
            <div class="input-group col-md-9">
              <input type="text" class="w-100 form-control text-sm" name="coupon" id="coupon" onkeyup="update_coupon();" onchange="update_coupon();" placeholder="Coupon Code" value="">
              <span class="input-group-addon" style="padding: 0"><img src="https://my.interserver.net/validate_coupon.php?module=vps'" id="couponimg" height=20 width=20></span>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="controls">
              <input type="submit" name="Submit" value="Continue" class="btn btn-order px-3 py-2 text-sm">
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="col-md-6">
    <div class="row">
      <!-- Order Summary -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <div class="p-1">
              <h4 class="card-title py-2">
                <i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary
              </h4>
              <div class="card-tools float-right">
                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="card-body pb-0">
            <div class="row mb-3">
              <div id="package_name" class="col-md-8 text-muted text-bold">
                : </div>
              <div id="package_period" class="col text-right">1 Month(s)</div>
            </div>
            <div class="row mb-3">
              <div id="hostname_display" class="col-md-8 text-muted text-bold">
                server.domain.com: </div>
              <div class="col text-md text-right totalcost_display">$6.00</div>
            </div>
            <div id="cyclediscountrownew" class="row mb-3">
              <div class="col-md-8 text-muted text-bold">Billing cycle discount:</div>
              <div id="cyclediscount" class="col text-right"></div>
            </div>
            <div id="couponpricerownew" class="row mb-3">
              <div id="couponpricetextnew" class="col-md-8 text-muted text-bold">Coupon Discount: </div>
              <div id="couponprice" class="col text-right"></div>
            </div>

            <hr>
            <div class="row mb-3">
              <div class="col-md-8 text-md text-bold text-muted">Total:</div>
              <div id="totalcost" class="col text-md text-right total_cost">$6.00</div>
            </div>
          </div>
        </div>
      </div>
      <!-- End Order Summary -->
      <!-- VPS Recommendations -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <div class="p-1">
              <h4 class="card-title py-2">
                <i class="fa fa-thumbs-up">&nbsp;</i>Recommendations
              </h4>
              <div class="card-tools float-right">
                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="card-body py-2">
            <a id="rec_linux" href="javascript:void(0);" data-toggle="tooltip" title="Linux VPS" class="btn btn-sm btn-secondary b-radius mr-1 my-2 px-3"><i class="fa fa-linux">&nbsp;</i>Linux&nbsp;</a>
            <a id="rec_directadmin" href="javascript:void(0);" data-toggle="tooltip" title="Direct Admin VPS" class="btn btn-sm btn-secondary b-radius mr-1 my-2 px-3"><i class="fa fa-user">&nbsp;</i>Direct Admin&nbsp;</a>
            <a id="rec_windows" href="javascript:void(0);" data-toggle="tooltip" title="Windows VPS" class="btn btn-sm btn-secondary b-radius mr-1 my-2"><i class="fa fa-windows">&nbsp;</i>Windows&nbsp;</a>
            <a id="rec_cPanel" href="javascript:void(0);" data-toggle="tooltip" title="cPanel VPS" class="btn btn-sm btn-secondary b-radius my-2 mr-1" style="padding: 3px 11px 3px 11px;"><i class="fa fa-server">&nbsp;</i>cPanel&nbsp;</a>
            <a id="rec_linux_desktop" href="javascript:void(0);" data-toggle="tooltip" title="Linux Desktop VPS" class="btn btn-sm btn-secondary b-radius mr-1 my-2" style="padding: 3px 10px 3px 10px;"><i class="fa fa-desktop">&nbsp;</i>Linux Desktop&nbsp;</a>
            <a id="rec_webuzo" href="javascript:void(0);" data-toggle="tooltip" title="Webuzo VPS" class="btn btn-sm btn-secondary b-radius my-2" style="padding: 3px 8px 3px 8px;"><i class="fa fa-laptop">&nbsp;</i>Webuzo&nbsp;</a>
          </div>
        </div>
      </div>
      <!-- End VPS Recommendations -->
      <div class="col">
        <!-- VPS Location availability -->
        <div class="card">
          <div class="card-header">
            <div class="p-1">
              <h4 class="card-title py-2">
                <i class="fa fa-map-pin"></i>&nbsp;Location Availability
              </h4>
              <div class="card-tools float-right">
                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
              </div>
            </div>
          </div>
          <div class="card-body">
            <table class="table table-hover table-bordered">
              <thead>
                <tr>
                  <th>Location / Platform</th>
                  <!--<th>Virtuozzo</th>-->
                  <th>KVM Linux</th>
                  <!--<th>KVM Windows</th>-->
                  <th>HyperV</th>
                  <th>KVM Storage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">New Jersey</td>
                  <td class="text-center"><span style="color:green;">✔</span></td>
                  <td class="text-center"><span style="color:green;">✔</span></td>
                  <td class="text-center"><span style="font-weight:bold;color:red;">X</span></td>
                </tr>
                <tr>
                  <td class="text-center">Los Angeles</td>
                  <td class="text-center"><span style="color:green;">✔</span></td>
                  <td class="text-center"><span style="color:green;">✔</span></td>
                  <td class="text-center"><span style="font-weight:bold;color:red;">X</span></td>
                </tr>
                <tr>
                  <td class="text-center">Equinix NY4</td>
                  <td class="text-center"><span style="font-weight:bold;color:red;">X</span></td>
                  <td class="text-center"><span style="font-weight:bold;color:red;">X</span></td>
                  <td class="text-center"><span style="font-weight:bold;color:red;">X</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- End VPS Location availability -->
    </div>
  </div>
</div>
</template>

<style scoped>
</style>