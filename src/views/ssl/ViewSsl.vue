<script setup>
</script>

<template>
<div class="row my-4">
  <div class="col-12 col-sm-6 col-md-4">
    <div class="small-box bg-info">
      <div class="inner pt-3 pb-1 px-3">
        <h3>Package</h3>
        <p>.dev Ssl Name Registration</p>
        <p>Next Invoice Date: <b>August 14, 2023</b></p>
      </div>
      <div class="icon">
        <i class="fas fa-briefcase"></i>
      </div>
      <span class="small-box-footer">detain.dev</span>
    </div>
  </div>
  <div class="col-12 col-sm-6 col-md-4">
    <div class="small-box bg-success">
      <div class="inner pt-3 pb-1 px-3">
        <h3>Billing</h3>
        <p>
          <b>$18.00</b>
          billed <b>Yearly</b>
        </p>
        <p>
          Expire Date: <b> August 14, 2023 </b>
        </p>
      </div>
      <div class="icon">
        <i class="fas fa-dollar-sign"></i>
      </div>
      <span class="small-box-footer">Ssl Status: <b>Active</b></span>
    </div>
  </div>
  <div class="col-12 col-sm-6 col-md-4">
    <div class="small-box bg-warning">
      <div class="inner text-white pb-2 px-3 mb-1">
        <h3>Whois Privacy</h3>
        <p style="padding-top: 1.3rem;padding-bottom: 1rem;">
          Whois Privacy is: <b class="text-md">Disabled</b>
        </p>
      </div>
      <div class="icon">
        <i class="fas fa-user-secret"></i>
      </div>
      <span class="small-box-footer">
        Status: <b>Disabled</b>
        <a class="btn p-0 text-white text-sm pl-1" href="view_ssl?id=592337&link=whois" title="Edit Whois Privacy Status"><i class="fa fa-pencil"></i>
        </a>
      </span>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-md-6">
    <div class="card p-2">
      <div class="card-header border-0">
        <h3 class="card-title"><i class="fas fa-link">&nbsp;</i> Links</h3>
        <div class="card-tools">
          <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
        </div>
      </div>
      <div class="card-body py-5 text-center my-4" style="height: auto;">
        <a class="btn btn-app b-radius" href="view_ssl?id=592337&link=invoices"><i class="fas fa-file-invoice-dollar fa-w-12"></i>Invoices</a>
        <a class="btn btn-app b-radius" href="view_ssl?id=592337&link=cancel"><i class="fas fa-times"></i>Cancel Ssl_certs</a>
        <a class="btn btn-app b-radius" href="view_ssl?id=592337&link=renew"><i class="fa fa-hourglass"></i>Renew</a>
        <a class="btn btn-app b-radius" href="view_ssl?id=592337&link=dnssec"><i class="fa fa-lock"></i>DNSSEC</a>
        <a class="btn btn-app b-radius" href="view_ssl?id=592337&link=authepp"><i class="fa fa-envelope"></i>Email EPP Code</a>
        <a class="btn btn-app b-radius" href="view_ssl?id=592337&link=lock"><i class="fa fa-lock"></i>Lock / Unlock</a>
      </div>
    </div>
  </div>
  <div class="col-12 col-sm-6 col-md-6">
    <div class="card">
      <div class="card-header">
        <div class="p-1">
          <h3 class="card-title pt-2"><i class="fas fa-globe">&nbsp;</i>Nameservers</h3>
          <div class="card-tools float-right pt-1 pl-3">
            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i>
            </button>
          </div>
          <div class="btn-group float-right">
            <a class="btn btn-custom btn-sm" href="view_ssl?id=592337&link=nameservers" title="Edit NameServers">
              <i class="fa fa-pencil" aria-hidden="true"></i>
              Edit </a>
          </div>
        </div>
      </div>
      <div class="card-body pt-0" style="height: 205px;">
        <p>
        <div class="row">
          <div class="col-md-6 p-0">
            <h5 class="nameserver_heading">Nameserver #<span class="nameserver_label">3</span></h5>
            <h5 class="nameserver_heading">Nameserver #<span class="nameserver_label">3</span></h5>
            <h5 class="nameserver_heading">Nameserver #<span class="nameserver_label">3</span></h5>
          </div>
          <div class="col-md-6 p-0">
            <h5 class="nameserver_heading">cdns1.interserver.net</h5>
            <h5 class="nameserver_heading">cdns2.interserver.net</h5>
            <h5 class="nameserver_heading">cdns3.interserver.net</h5>
          </div>
        </div>
        </p>
      </div>
    </div>
  </div>
</div>
<div class="row my-2">
  <div class="col-12 col-sm-6 col-md-6">
    <div class="card">
      <div class="card-header">
        <div class="p-1">
          <h3 class="card-title pt-2"><i class="fas fa-id-card">&nbsp;</i>Contact Information</h3>
          <div class="card-tools float-right pt-1 pl-3">
            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i>
            </button>
          </div>
          <div class="btn-group float-right">
            <a class="btn btn-custom btn-sm" href="view_ssl?id=592337&link=contact" title="Edit Contact Information">
              <i class="fa fa-pencil" aria-hidden="true"></i>
              Edit </a>
          </div>
        </div>
      </div>
      <div class="card-body pt-5" style="height: 250px;">
        <p>
          Name: Joe Huss <br>
          Address: 221 Duke St. <br>
          Ephrata, PA<br>
          US - 17522<br>
          Ph: <a href="tel:+1.2012308833"> +1.2012308833</a>
        </p>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card p-2">
      <div class="card-header border-0">
        <h3 class="card-title"><i class="fas fa-newspaper">&nbsp;</i> Ssl Registry logs</h3>
        <div class="card-tools">
          <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i>
          </button>
        </div>
      </div>
      <div class="card-body" style="height:250px;margin: 0 auto;display: flex;align-items: center;">
        <span class="text-secondary text-md">No ssl log found.</span>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card p-2">
      <div class="card-header border-0">
        <h3 class="card-title"><i class="fas fa-times">&nbsp;</i> Errors in Contact Info</h3>
        <div class="card-tools">
          <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i>
          </button>
        </div>
      </div>
      <div class="card-body" style="height:250px;margin: 0 auto;display: flex;align-items: center;">
        <span class="text-success text-md">All good! no errors in Contact Information!</span>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
</style>