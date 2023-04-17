<script setup>
</script>

<template>
<div class="row mt-2">
  <div class="col-md-4">
    <div class="small-box bg-secondary">
      <div class="inner pt-3 pb-1 px-3">
        <h3>Package</h3>
        <p class="py-2 m-0">OpenVZ VPS Slice (Ubuntu 8 Slices)</p>
        <p>Next Invoice Date: <b>May 12, 2023</b>
        </p>
      </div>
      <div class="icon">
        <i class="fas fa-briefcase"></i>
      </div>
      <span class="small-box-footer text-bold">repo.interserver.net</span>
    </div>
  </div>
  <div class="col-md-4">
    <div class="small-box bg-success">
      <div class="inner pt-3 pb-2 px-3">
        <h3>Billing</h3>
        <p class="py-3 my-3">
          <b>$0.00</b>
          billed <b>Monthly</b><br>
        </p>
      </div>
      <div class="icon">
        <i class="fas fa-dollar-sign"></i>
      </div>
      <span class="small-box-footer">VPS Status is: <b>Active</b></span>
    </div>
  </div>
  <div class="col-md-4">
    <div class="small-box bg-info">
      <div class="inner pt-3 pb-2 px-3">
        <h3>Host Server: <b>IntVPS3</b></h3>
        <p class="py-3 my-3">
          IP is: <b>66.45.240.202</b>
        </p>
      </div>
      <div class="icon">
        <i class="fas fa-info-circle"></i>
      </div>
      <span class="small-box-footer">
        Vzid: <b>43773</b>
      </span>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-md-4">
    <div class="card">
      <div class="card-header">
        <div class="p-1">
          <h3 class="card-title py-2"><i class="fas fa-server">&nbsp;</i>&nbsp;VPS Information</h3>
          <div class="card-tools float-right pt-1 pl-3">
            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="card-body" style="height: 270px;">
        <div class="row">
          <div class="col-md-12">
            <h5 class="text-md m-0 p-2 text-center">
              Power Status is: <span class="text-bold text-capitalize text-bold
                                                            text-success">
                running</span>
            </h5>
          </div>
          <div class="col-md-12 text-center pt-2 pr-4 mr-3">
            <div class="btn-group">
              <button type="button" class="btn                                 btn-success">Select Action</button>
              <button type="button" class="btn                                 btn-success dropdown-toggle dropdown-hover dropdown-icon" data-toggle="dropdown">
                <span class="sr-only">Toggle Dropdown</span>
              </button>
              <div class="dropdown-menu" role="menu">
                <a class="dropdown-item" href="view_vps?id=43773&link=queue&action=start">Start</a>
                <a class="dropdown-item" href="view_vps?id=43773&link=queue&action=restart">Restart</a>
                <a class="dropdown-item" href="view_vps?id=43773&link=queue&action=stop">Stop</a>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 py-2">
            <span class="info-box-text">
              <hr>
              <h5 class="text-center mt-5">
                Comment: Mirror and Proxy Server (Apt/Rpm/Cygwin/etc) <span data-toggle="modal" data-target="#commentForm" title="Edit Comment" style="cursor: pointer;"><i class="fa fa-pencil text-sm my-2"></i>
                </span>
              </h5>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card">
      <div class="card-header">
        <div class="p-1">
          <h3 class="card-title py-2"><i class="fas fa-hdd">&nbsp;</i>&nbsp;Disk</h3>
          <div class="card-tools float-right pt-1 pl-3">
            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="card-body pt-0" style="height: 270px;">
        <div class="row">
          <div class="col-md-12 py-3 mb-1">
            <table class="table table-bordered my-3">
              <tr>
                <td class="text-muted text-bold">Total Space:</td>
                <td class="text-bold text-capitalize">
                  236.11 GB </td>
              </tr>
              <tr>
                <td class="text-muted text-bold">Used Space:</td>
                <td class="text-bold text-capitalize">
                  0.81 GB </td>
              </tr>
              <tr>
                <td class="text-muted text-bold">Remaining Space:</td>
                <td class="text-bold text-capitalize">
                  235.3 GB </td>
              </tr>
              <tr>
                <td style="width: 75%;">
                  <div id="info-progress-lg" class="progress progress-sm mt-2">
                    <div class="progress-bar bg-gradient-blue
                                                    " style="width: 0.34%">
                    </div>
                  </div>
                </td>
                <td class="text-bold text-capitalize text-md" style="vertical-align: middle;">
                  0.34%
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card">
      <div class="card-header">
        <div class="p-1">
          <h3 class="card-title py-2"><i class="fa fa-microchip">&nbsp;</i>&nbsp;System Information </h3>
          <div class="card-tools float-right pt-1 pl-3">
            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="card-body pt-0" style="height: 270px;">
        <div class="row">
          <div class="col-md-12 py-3 mb-1">
            <table class="table table-bordered my-3">
              <tr class="col">
                <td class="text-muted text-bold">Memory:</td>
                <td class="text-bold text-capitalize">
                  16 GB
                </td>
              </tr>
              <tr>
                <td class="text-muted text-bold">Disk Drive:</td>
                <td class="text-bold text-capitalize">
                  240 GB
                </td>
              </tr>
              <tr class="col">
                <td class="text-muted text-bold">CPU Cores:</td>
                <td class="text-bold text-capitalize">
                  8
                </td>
              </tr>
              <tr>
                <td class="text-muted text-bold">OS:</td>
                <td class="text-bold text-capitalize">
                  Ubuntu 14.04
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="row">
  <div class="col">
    <div class="card">
      <div class="card-header">
        <div class="p-1">
          <h3 class="card-title py-2"><i class="fas fa-link">&nbsp;</i> Links</h3>
          <div class="card-tools float-right">
            <button type="button" class="btn btn-tool" data-card-widget="collapse">
              <i class="fas fa-minus"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <a class="btn btn-app mb-3" title="Invoice History" data-toggle="tooltip" href="view_vps?id=43773&link=invoices"><i class="fas fa-file-invoice-dollar fa-w-12"></i>Invoices</a>
        <a class="btn btn-app mb-3" title="Cancel VPS" data-toggle="tooltip" href="view_vps?id=43773&link=cancel"><i class="fas fa-times"></i>Cancel VPS</a>
        <a class="btn btn-app mb-3" title="Reinstall Operating System" data-toggle="tooltip" href="view_vps?id=43773&link=reinstall_os"><i class="fa fa-linux"></i>Reinstall OS</a>
        <a class="btn btn-app mb-3" title="Reverse DNS" data-toggle="tooltip" href="view_vps?id=43773&link=reverse_dns"><i class="fa fa-atlas"></i>Reverse DNS</a>
        <a class="btn btn-app mb-3" title="Bandwith/Traffic Usage" data-toggle="tooltip" href="view_vps?id=43773&link=traffic_usage"><i class="material-icons">speed</i>Bandwidth/Traffic Usage</a>
        <a class="btn btn-app mb-3" title="Setup VNC" data-toggle="tooltip" href="view_vps?id=43773&link=queue&action=setup_vnc"><i class="fa fa-linux"></i>Setup VNC</a>
        <a class="btn btn-app mb-3" title="VPS Slice Upgrade/Downgrade" data-toggle="tooltip" href="view_vps?id=43773&link=slices"><i class="fa fa-upload"></i>Up/Downgrade VPS Slices</a>
        <a class="btn btn-app mb-3" title="Purchase Additional IP Address" data-toggle="tooltip" href="view_vps?id=43773&link=buy_ip"><i class="fa fa-map-marker-alt"></i>Buy IP</a>
        <a class="btn btn-app mb-3" title="Change Root Password of your vps" data-toggle="tooltip" href="view_vps?id=43773&link=changeRootPassword"><i class="fa fa-key text-lg"></i>Change Root Password</a>
        <a class="btn btn-app mb-3" title="Purchase Additional HD Space" data-toggle="tooltip" href="view_vps?id=43773&link=buy_hd_space"><i class="fa fa-server"></i>Buy HD Space</a>
        <a class="btn btn-app mb-3" title="Change System Hostname" data-toggle="tooltip" href="view_vps?id=43773&link=changeHostname"><i class="material-icons">manage_accounts</i>Change System Hostname</a>
        <a class="btn btn-app mb-3" title="Enable Quotas" data-toggle="tooltip" href="view_vps?link=queue&id=43773&action=enable_quota"><i class="material-icons">playlist_add_check</i>Enable Quotas</a>
        <a class="btn btn-app mb-3" title="Disable Quotas" data-toggle="tooltip" href="view_vps?link=queue&id=43773&amp;action=disable_quota"><i class="material-icons">playlist_add</i>Disable Quotas</a>
        <button onclick="openPopUp()" class="btn btn-app mb-3" title="View Desktop" data-toggle="tooltip"><i class="fa fa-tv"></i>View Desktop</button>
        <a class="btn btn-app mb-3" title="Backup VPS" data-toggle="tooltip" href="view_vps?link=queue&id=43773&action=backup"><i class="material-icons">backup</i>Backup VPS</a>
        <a class="btn btn-app mb-3" title="Download/Manage Backups" data-toggle="tooltip" href="view_vps?link=backups&id=43773"><i class="material-icons">cloud_download</i>Download/Manage Backups</a>
      </div>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-md-12 px-0">
    <div class="card">
      <div class="card-header">
        <div class="p-1">
          <h3 class="card-title py-2"><i class="fa fa-dashboard"></i> &nbsp;Control Panel Add-on </h3>
          <div class="card-tools float-right">
            <button type="button" class="btn btn-tool" data-card-widget="collapse">
              <i class="fas fa-minus"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="row toggleTr">
          <div class="col-md-12">
            <div class="alert alert-danger">
              <strong>Note:</strong>
              <span id="warning-text"></span><br>
              You can reinstall from left menu <b>Maintanance -&gt; Re-Install Operating System</b>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col mr-1">
            <a href="javascript:void(0);" class="img-a" onclick=" return toggleFunc('cp');">
              <div class="row b-radius cp_bg py-1 justify-content-center" style="border: 1px solid #ccc;">
                <div class="col-md-12 py-2">
                  <span class="text-center">
                    <h5 aria-hidden="true" class="text-bold">cPanel</h5>
                    <span class="text-sm">Starting From: <b></b>
                    </span>
                    <p class="text-sm m-0">
                      <span style="font-size: 12px;" class="text-red text-center">
                        ( Not Supported )</span>
                    </p>
                  </span>
                </div>
              </div>
            </a>
          </div>
          <div class="col mr-1">
            <a class="img-a" data-cp="da" data-cur-sym="$" data-cost="8" data-name="DirectAdmin Standard License for VPS" data-ser="0" href="javascript:void(0);" data-toggle="modal" data-target="#cpModal">
              <div class="row b-radius cp_bg py-1 justify-content-center" style="border: 1px solid #ccc;">
                <div class="col-md-12 pb-2 pt-2">
                  <span class="text-center">
                    <h5 aria-hidden="true" class="text-bold m-0">DirectAdmin</h5>
                    <p class="text-sm my-1">
                      ( <span class="text-center font-italic">Standard License</span>
                      )
                    </p>
                    <span class="text-sm">Starting From: <b>$8.00/mo</b>
                    </span>
                  </span>
                </div>
              </div>
            </a>
          </div>
          <div class="col mr-1">
            <a class="img-a" data-cp="da" data-cur-sym="$" data-cost="0" data-name="DirectAdmin Personal License for VPS" data-ser="free" href="javascript:void(0);" data-toggle="modal" data-target="#cpModal">
              <div class="row b-radius cp_bg py-1 justify-content-center" style="border: 1px solid #ccc;">
                <div class="col-md-12 pb-2 pt-2">
                  <span class="text-center">
                    <h5 aria-hidden="true" class="text-bold m-0">DirectAdmin</h5>
                    <p class="text-sm my-1">
                      ( <span class="text-center font-italic">Personal License</span>
                      )
                    </p>
                    <span class="text-sm">Starting From: <b>$0.00/mo</b>
                    </span>
                  </span>
                </div>
              </div>
            </a>
          </div>
          <div class="col mr-1">
            <a class="img-a toggleClass" href="javascript:void(0);" onclick=" return toggleFunc('pp');">
              <div class="row b-radius cp_bg py-1 justify-content-center" style="border: 1px solid #ccc;">
                <div class="col-md-12 py-2">
                  <span class="text-center">
                    <h5 aria-hidden="true" class="text-bold">PLESK Admin </h5>
                    <span class="text-sm">Starting From: <b>$12.00/mo</b>
                    </span>
                    <p class="text-sm m-0">
                      <span style="font-size: 12px;" class="text-red text-center">
                        ( Not Supported )</span>
                    </p>
                  </span>
                </div>
              </div>
            </a>
          </div>
          <div class="col mr-1">
            <a class="img-a toggleClass" href="javascript:void(0);" onclick=" return toggleFunc('pp');">
              <div class="row b-radius cp_bg py-1 justify-content-center" style="border: 1px solid #ccc;">
                <div class="col-md-12 py-2">
                  <span class="text-center">
                    <h5 aria-hidden="true" class="text-bold">PLESK Pro </h5>
                    <span class="text-sm">Starting From: <b>$19.00/mo</b>
                    </span>
                    <p class="text-sm m-0">
                      <span style="font-size: 12px;" class="text-red text-center">
                        ( Not Supported )</span>
                    </p>
                  </span>
                </div>
              </div>
            </a>
          </div>
          <div class="col mr-1">
            <a class="img-a toggleClass" href="javascript:void(0);" onclick=" return toggleFunc('pp');">
              <div class="row b-radius cp_bg py-1 justify-content-center" style="border: 1px solid #ccc;">
                <div class="col-md-12 py-2">
                  <span class="text-center">
                    <h5 aria-hidden="true" class="text-bold">PLESK Host </h5>
                    <span class="text-sm">Starting From: <b>$29.00/mo</b>
                    </span>
                    <p class="text-sm m-0">
                      <span style="font-size: 12px;" class="text-red text-center">
                        ( Not Supported )</span>
                    </p>
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-md-4">
    <div class="card">
      <div class="card-header">
        <div class="p-1">
          <h3 class="card-title py-2"><i class="fa fa-plus">&nbsp;</i>Addons </h3>
          <div class="card-tools float-right">
            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
          </div>
        </div>
      </div>
      <div class="card-body" style="height: 370px;">
        <table class="table table-bordered">
          <tr>
            <th>Item</th>
            <th>Value</th>
          </tr>
          <tr>
            <td class="text-muted text-bold">
              Additional HD Space </td>
            <td class="text-success">
              12,000 GB<a href="cancel_addon?module=vps&amp;r=19645797"><i class="fa fa-trash float-right pt-1 text-red"></i></a>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="cpModal" role="dialog">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Order Confirmation</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-md-offset-2 col-md-4 text-right">
            <h5>Package</h5>
          </div>
          <div class="col text-left"><strong>
              <h4 id="cp-name">cPanel Autoscale (Internal)</h4>
            </strong></div>
        </div>
        <div class="row">
          <div class="col-md-offset-2 col-md-4 text-right">
            <h5>Cost</h5>
          </div>
          <div class="col text-left"><strong>
              <h4 id="cp-cost"> </h4>
            </strong></div>
        </div>
        <div class="alert alert-warning">
          <strong>Note:</strong> Control panel needs to be installed on a clean OS install with no modifications. If there is any data it will be lost.
        </div>
        <br>
        <div class="row">
          <div class="col">
            <a id="cp-order-link" class="btn btn-primary btn-block" href="view_vps?link=add_control_panel&id=43773&cp=cp">Place Order</a>
          </div>
        </div>
        <br>
      </div>
    </div>
  </div>
</div>
<div class="row">
</div>

<!-- Modal -->
<div class="modal fade" id="commentForm" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <form class="inline" method="post" action="view_vps?id=43773">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalCenterTitle">Update Comment</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <input type="hidden" name="id" value="43773">
          <input type="hidden" name="link" value="update_comment">
          <input type="hidden" name="csrf_token" value="6bc7c6cb18cf66d5fbdc4b227f4bb6995626e467cc4a6d2e021edc11fa3bc0949a67113892572d91efbf5ae243f9cb5fb08b0947d8230a420e66c069d8d5fe31">
          <input type="hidden" name="edit_comment" value="2">
          <div class="form-group">
            <label for="message-text" class="col-form-label">Comment:</label>
            <textarea class="form-control" id="message-text" rows="5" name="vps_comment"> Mirror and Proxy Server (Apt/Rpm/Cygwin/etc)</textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-primary">Save changes</button>
        </div>
      </form>
    </div>
  </div>
</div>
</template>

<style scoped>
</style>