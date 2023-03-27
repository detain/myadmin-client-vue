{if $order_msg}
    <div class="row justify-content-center mt-2">
        <div class="col-md-12">
            <div class="callout callout-success">
                <h5>{t}Thank you! for your order.{/t}</h5>
                <p class="text-md">{$order_msg}</p>
            </div>
        </div>
    </div>
{/if}
<div class="row justify-content-center mt-2">
    <div class="col-md-9">
        <div class="card">
            <div class="card-header">
                <div class="p-1">
                    <h3 class="card-title py-2 float-left">
                        <i class="fa fa-money">&nbsp;</i>{t}Pay Balance{/t}
                    </h3>
                </div>
            </div>
            <div class="card-body">
                <div class="row my-2">
                    <div class="col-md-12">
                        <span class="text-bold mr-1"
                            style="border: 1px solid black;border-radius:50%;padding: 6px 12px;font-size: 18px;">1</span>
                        <b class="text-lg">{t}Billing Address{/t}</b>
                    </div>
                    {if isset($address) && !empty($address) && $address != " " }
                        <div class="col-md-4 p-4 mt-4 ml-5 b-radius card"
                            style="border: 1px solid rgba(204, 204, 204, 0.397);">
                            <div class="row">
                                <div class="col-md-2 mb-3">
                                    <div class="icheck-success">
                                        <input id="contact_check" type="radio" class="form-check-input" checked>
                                        <label for="contact_check"></label>
                                    </div>
                                </div>
                                <div class="col-md-10 mb-3">
                                    <b class="text-lg">Home</b><br>
                                    {if isset($name) && $name != ''}<b class="mb-2 text-md">{$name}</b><br>{/if}
                                    {if isset($address) && $address != ''}{$address}<br>{/if}
                                    {if $city != '' && $zip != '' && $country != ''}
                                        {$city}, {$zip}, {$state}, {$country}<br>
                                    {else if $city != '' && $zip != '' && $country == ''}
                                        {$city}, {$zip}, {$state}<br>
                                    {else}
                                        {$city}, {$state}<br>
                                    {/if}
                                    {if $phone != ''}<span class="mt-2">{$phone}</span>{/if}
                                </div>
                                <div class="col-md-12 text-right pr-3">
                                    <a href="javascript:void(0);" class="btn btn-custom py-1 px-3 btn-sm"
                                        data-toggle="tooltip" title="Update Contact Info" onclick="edit_info();">
                                        <i class="fa fa-edit" aria-hidden="true">&nbsp;</i>{t}EDIT{/t}
                                    </a>
                                </div>
                            </div>
                        </div>
                    {else}
                        <div class="card py-3 ml-5 my-3 px-4">
                            <div class="card-header">
                                <h5 class="card-title text-bold py-2">
                                    {t}Please Add Billing Address to continue Purchase.{/t}
                                </h5>
                            </div>
                            <div class="card-body mx-auto my-2">
                                <a href="/contact_info" class="btn btn-custom py-2 px-3" data-toggle="tooltip"
                                    title="Add Billing Address to continue">
                                    <i class="fa fa-plus"></i>&nbsp;{t}Add Billing Address{/t}
                                </a>
                            </div>
                        </div>
                    {/if}
                </div>
                <hr>
                <div class="row mt-5">
                    <div class="col-md-5 p-0">
                        <div class="col-md-12">
                            <span class="text-bold mr-1"
                                style="border: 1px solid black;border-radius:50%;padding: 6px 12px;font-size: 18px;">2</span>
                            <b class="text-lg">{t}# Of Products{/t}</b>
                        </div>
                    </div>
                    <div class="col-md-3 text-center">
                        <form method="post"
                            action="cart{if $ima == 'admin'}?custid={$custid}{/if}{if isset($st) && $ima != 'admin'}?st={$st}{/if}{if isset($st) && $ima == 'admin'}&st={$st}{/if}">
                            <div class="form-group row">
                                <label for="invoice_days" class="col-md-4 col-form-label">{t}Filter{/t}</label>
                                <select id="invoice_days" class="col-md-8 select2 form-control text-left"
                                    name="invoice_days" onChange="this.form.submit();">
                                    <option value="-1" {if $invoice_days == -1}selected{/if}>{t}All Days{/t}</option>
                                    <option value="30" {if $invoice_days == 30}selected{/if}>{t}30 Days{/t}</option>
                                    <option value="60" {if $invoice_days == 60}selected{/if}>{t}60 Days{/t}</option>
                                    <option value="90" {if $invoice_days == 90}selected{/if}>{t}90 Days{/t}</option>
                                    <option value="365" {if $invoice_days == 365}selected{/if}>{t}1 Year{/t}</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="col-md-3 text-center">
                        <form method="post"
                            action="cart{if $ima == 'admin'}?custid={$custid}{/if}{if isset($st) && $ima != 'admin'}?st={$st}{/if}{if isset($st) && $ima == 'admin'}&st={$st}{/if}">
                            <div class="form-group row">
                                <label for="currency_select" class="col-md-6 col-form-label">{t}Currency{/t}</label>
                                <select id="currency_select" class="col-md-6 select2 form-control text-left"
                                    name="currency" onChange="this.form.submit();">
                                    {foreach $currency_arr as $name => $value}
                                        <option value="{$value}" {if $currency == $value}selected{/if}>{$name}</option>
                                    {/foreach}
                                </select>
                            </div>
                        </form>
                    </div>
                </div>
                {if $invrows|count > 0}
                    <table class="table table-md my-0 mx-auto" style="width: 88%;">
                        <tr>
                            <th style="width: 5%;">
                                <div class="icheck-success d-inline">
                                    <input id="checkboxtoggle" type="checkbox" name="uncheckAll" value=""
                                        onChange="toggleCheckbox();" checked>
                                    <label for="checkboxtoggle"> </label>
                                </div>
                            </th>
                            <th>{t}Service{/t}</th>
                            <th>{t}Description{/t}</th>
                            <th>{t}Date{/t}</th>
                            <th>{t}Service Status{/t}</th>
                            <th>{t}Actions{/t}</th>
                            <th class="text-right">{t}Amount{/t}</th>
                        </tr>
                        {foreach key=key item=invrow from=$invrows}
                            {assign var=module value=$invrow.invoices_module}
                            {if $module != 'default'}
                                {assign var=settings value=$modules.$module}
                            {/if}
                            <tr class="{$module}row {if $invrow.days_old <= 31}recentrow{else}oldrow{/if} inv{$module}{$invrow.invoices_id}row {if $invrow.invoices_service > 0}service{$module}{$invrow.invoices_service}{/if} {if $invrow.collapse == 1}collapse toggle{$module}{$invrow.invoices_service}{/if} {if $invrow.service_line == 1}service_main collapsed{/if} {if isset($invrow.prepay_invoice)}prepay_invoice_row{/if}"
                                {if $invrow.service_line == 1}data-toggle="collapse"
                                data-target=".toggle{$module}{$invrow.invoices_service}" {/if}>
                                <td>
                                    <div class="icheck-success d-inline">
                                        <input id="{$invrow.service_label}" type="checkbox" onChange="updateTotal(this);"
                                            {if $invrow.service_line == 1}name="services[]" {else}name="invoices[]" {/if}
                                            value="{$invrow.service_label}" {if !isset($invrow.prepay_invoice)}checked="checked"
                                            {/if}
                                            class="inv_checkbox {if isset($invrow.prepay_invoice)}prepay_inv_checkbox{/if}">
                                        <label for="{$invrow.service_label}"> </label>
                                    </div>
                                </td>
                                <td>
                                    {if $module == 'default'}
                                        {$invrow.service}
                                    {elseif $invrow.collapse != 1}
                                        <a class="text-primary"
                                            href="index.php?choice=none.view_{$settings.PREFIX}&id={$invrow.invoices_service}">{$invrow.service}</a>
                                    {/if}
                                </td>
                                <td>{$invrow.invoices_description}</td>
                                <td>{$invrow.date}</td>
                                <td>{$invrow.service_status}</td>
                                <td class="text-center">
                                    {if isset($invrow.prepay_invoice) || $invrow.service_status == 'pending'}
                                        <a href="javascript:void(0);" onclick="delete_invoice({$invrow.invoices_id})"
                                            data-toggle="tooltip" title="Delete Invoice">
                                            <i class="fa fa-trash"></i>
                                        </a>
                                        <form id="invdel{$invrow.invoices_id}" action="del_inv?r=cart" method="POST">
                                            <input type="hidden" name="inv_id" value="{$invrow.invoices_id}">
                                        </form>
                                    {else}
                                        <span class="text-sm font-italic text-muted">Empty...</span>
                                    {/if}
                                </td>
                                <td>{$invrow.currency_display}</td>
                            </tr>
                        {/foreach}
                        <tr>
                            <td>Filter</td>
                            <td colspan="7">
                                <button type="button" class="btn bg-teal btn-sm" onClick="checkAll();">{t}All{/t}</button>
                                <button type="button" class="btn bg-teal btn-sm"
                                    onClick="uncheckAll();">{t}None{/t}</button>
                                <button type="button" class="btn bg-teal btn-sm" onClick="checkRecent();">
                                    {t}Past Month{/t}
                                </button>
                                <button type="button" class="btn bg-teal btn-sm"
                                    onClick="checkActive();">{t}Active{/t}</button>
                                {foreach $modules_counts as $module => $count}
                                    <button class="btn btn-sm bg-teal"
                                        onclick="checkClass('{$module}row');">{$module|capitalize}
                                        <span class="badge badge-light ml-1">{$count}</span></button>
                                {/foreach}
                            </td>
                        </tr>
                    </table>
                    <hr>
                    <div class="row mt-4">
                        <div class="col-md-12">
                            <span id="step_3" class="text-bold mr-1"
                                style="border: 1px solid black;border-radius:50%;padding: 6px 12px;font-size: 18px;">3</span>
                            <b class="text-lg">{t}Payment Options{/t}</b>
                        </div>
                        <div class="col-md-12 mt-4 px-5 py-3 b-radius" style="background: #f4f4f4;">
                            <h5 class="text-bold text-md text-capitalize">{t}How do you want to Pay?{/t}</h5>
                            <span id="payments-section"></span>
                        </div>
                    </div>
                    <hr>
                    <div id="select_card" {if $pymt_method != 'cc'} style="display: none;" {/if}>
                        <div class="row my-2">
                            <div class="col-md-12">
                                <span id="step_4" class="text-bold mr-1"
                                    style="border: 1px solid black;border-radius:50%;padding: 6px 12px;font-size: 18px;">4</span>
                                <b class="text-lg">{t}Select / Add Credit Card{/t}</b>
                                <a href="javascript:void(0);" class="btn btn-custom float-right" data-toggle="modal"
                                    data-target="#add-card">
                                    <i class="fa fa-plus" aria-hidden="true">&nbsp;</i>{t}Add New Card{/t}</a>
                            </div>
                            <div class="col-md-12 d-flex mt-3" id="selectcardmsg"></div>
                            {if !empty($cc_arr)}
                                {foreach $cc_arr as $cc_id => $cc_detail}
                                    <div class="col-md-4 p-4 mt-4 ml-5 b-radius card"
                                        style="border: 1px solid rgba(204, 204, 204, 0.397);{if $pymt_method == 'cc' && isset($selected_cc) && $selected_cc == $cc_id} background-color: rgba(204, 204, 204, 0.397);{/if}">
                                        {if $pymt_method == 'cc' && isset($selected_cc) && $selected_cc == $cc_id}
                                            <div class="ribbon-wrapper">
                                                <div class="ribbon bg-success text-xs">Default</div>
                                            </div>
                                        {/if}
                                        <form action="cart{if $ima=='admin'}?custid={$custid}{/if}" method="post" id="paymentform">
                                            <div class="row">
                                                <input type="hidden" name="csrf_token" value="{$csrf_token}">
                                                <input type="hidden" name="action" value="make_cc_payment">
                                                <div class="col-md-12 mb-3">
                                                    <div class="icheck-success">
                                                        <input id="cc-{$cc_id}" name="r_pymt_method" value="cc_{$cc_id}"
                                                            type="radio" class="form-check-input"
                                                            {if $cc_detail.verified_cc == 'no'}disabled="disabled"
                                                                data-toggle="tooltip" title="{$cc_detail.verified_text}"
                                                                {/if}{if $pymt_method == 'cc' && isset($selected_cc) && $selected_cc == $cc_id}checked="checked"
                                                            {/if} onchange="update_payment_method('cc'+{$cc_id})">
                                                        <label for="cc-{$cc_id}" class="text-lg pb-2"
                                                            style="letter-spacing: 4px;">{$cc_detail.mask_cc}</label>
                                                    </div>
                                                    <div class="pl-4 ml-2">
                                                        <div class="my-2 text-sm"><b class="text-md">{$name}</b>
                                                        </div>
                                                        <div class="text-sm text-muted">{t}Expires on{/t} {$cc_detail.cc_exp}</div>
                                                        <div class="my-2">
                                                            {if $pymt_method == 'cc' && isset($selected_cc) && $selected_cc == $cc_id}
                                                                <div id="selected_services"></div>
                                                                <input type="hidden" name="balance" value="1">
                                                                <input type="password" name="cc_ccv2" placeholder="cvv2"
                                                                    style="border-radius: 5px; width: 100%;" minlength="3" maxlength="4"
                                                                    required
                                                                    oninvalid="this.setCustomValidity('Please Enter 3 digit CVV number on credit card number')"
                                                                    oninput="setCustomValidity('')">
                                                            {else}
                                                                &nbsp;
                                                            {/if}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 pl-4">
                                                    {if $cc_detail.verified_cc == 'no'}
                                                        <a id="unver_{$cc_id}" class="tn btn-outline-custom py-1 px-3 btn-xs ml-2"
                                                            href="payment_types?action=verify" data-toggle="tooltip"
                                                            style="text-decoration: none;" title="{$cc_detail.unverified_text}">
                                                            <i class="fa fa-exclamation-triangle"></i>&nbsp;{t}Verify{/t}
                                                        </a>
                                                    {else if $cc_detail.verified_cc != 'no' && (!isset($selected_cc) || isset($selected_cc) && $selected_cc != $cc_id)}
                                                        <a class="btn btn-custom py-1 px-3 btn-sm ml-2" href="javascript:void(0);"
                                                            data-toggle="tooltip" title="{$cc_detail.edit_text}"
                                                            onclick="edit_card({$cc_id})">
                                                            <i class="fa fa-edit" aria-hidden="true">&nbsp;</i>{t}Edit{/t}
                                                        </a>
                                                    {elseif $pymt_method == 'cc' && isset($selected_cc) && $selected_cc == $cc_id}
                                                        <div class="text-lg text-success" name="totalccamount"></div>
                                                    {/if}
                                                </div>
                                                <div class="col-md-6 text-right">
                                                    {if !isset($selected_cc) || isset($selected_cc) && $selected_cc != $cc_id || $cc_detail.verified_cc == 'no'}
                                                        <a class="btn btn-outline-custom py-1 px-3 btn-xs" href="javascript:void(0);"
                                                            data-toggle="tooltip" title="{$cc_detail.delete_text}"
                                                            onclick="delete_card({$cc_id})" style="text-decoration: none;">
                                                            <i class="fa fa-trash"></i>&nbsp;{t}Delete{/t}
                                                        </a>
                                                    {elseif $pymt_method == 'cc' && isset($selected_cc) && $selected_cc == $cc_id}
                                                        <input id="paynow" type="submit" class="btn btn-outline-custom btn-sm"
                                                            style="border-radius: 5px;" value="Pay Now">
                                                    {/if}
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                {/foreach}
                            {else}
                                <div class="col-md-12 mt-4 px-5 py-3 b-radius" style="background: #f4f4f4;">
                                    <h5 class="text-bold text-md text-capitalize">{t}You Have 0 Credit Cards{/t}</h5>
                                    <span class="text-red">
                                        {t}To Add a Credit Card, Please Click on the Add New Card Button.{/t}
                                    </span>
                                </div>
                            {/if}
                        </div>
                    </div>
                    <hr>
                {else}
                    <table class="table table-md my-0 mx-auto" style="width: 88%;">
                        <tr>
                            <th style="width: 5%;">
                                <div class="icheck-success d-inline">
                                    <input id="checkboxtoggle" type="checkbox" name="uncheckAll" value=""
                                        onChange="toggleCheckbox();">
                                    <label for="checkboxtoggle"> </label>
                                </div>
                            </th>
                            <th>{t}Service{/t}</th>
                            <th>{t}Description{/t}</th>
                            <th>{t}Date{/t}</th>
                            <th>{t}Service Status{/t}</th>
                            <th>{t}Actions{/t}</th>
                            <th class="text-right">{t}Amount{/t}</th>
                        </tr>
                        <tr>
                            <td colspan="7" class="text-center text-black text-bold b-radius" style="background: #f4f4f4;">
                                {t}No Invoices to pay...{/t}
                            </td>
                        </tr>
                    </table>
                {/if}
                {if $currency == 'INR'}
                    <div class="text-sm col-md-12 mt-4 alert alert-info b-radius mb-0">
                        <h4 class="text-bold text-lg text-capitalize">Manual Bank Payment Option:</h4>
                        <p class="form-text m-0">
                            <b>Name:</b> ROCKSOLID INTERSERVER PRIVATE LIMITED<br />
                            <b>Current A/C No:</b> 155605010028<br />
                            <b>IFSC Code:</b> ICIC0001556<br />
                            After payment is made open a support ticket with the transaction id, date, and amount paid.
                            We will manually credit the payment.
                        </p>
                    </div>
                {/if}
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card" style="position: fixed;top: 30%;width: 22%;">
            <div class="card-header">
                <div class="p-1">
                    <h3 class="card-title py-2 float-left">
                        <i class="fa fa-file-invoice">&nbsp;</i>{t}Balance & Invoice Info{/t}
                    </h3>
                </div>
            </div>
            <div class="card-body">
                <table class="table table-sm">
                    <tr>
                        <td class="text-center" colspan="2" style="border: none;">
                            <div><strong>{t}Total Invoices{/t}</strong></div>
                            <div class="text-lg text-success">{$total_invoices}</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center" colspan="2">
                            <div><strong>{t}Invoices Total Amount{/t}</strong></div>
                            <div class="text-lg text-success" name="totalcol">{$total_display}</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center">
                            <div><strong>{t}PrePay Available{/t}</strong></div>
                            <div class="text-lg text-success">{$displayPrepay}</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center" colspan="2">
                            <div><strong>{t}To Be Paid{/t}</strong></div>
                            <div class="text-lg text-success" name="totalamount">{$total_display}</div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="add-card" style="display: none;" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header mx-4">
                <h4 class="modal-title">{t}Add Credit Card{/t}</h4>
            </div>
            <div class="modal-body">
                <form action="cart" method="post" class="form-card">
                    <input type="hidden" name="csrf_token" value="{$csrf_token}">
                    <input type="hidden" name="action" value="add">
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <div class="input-group">
                                <input type="text" id="cr_no" name="cc" placeholder="0000 0000 0000 0000" minlength="19"
                                    maxlength="19" required
                                    oninvalid="this.setCustomValidity('Please Enter valid 16 digit credit card number')"
                                    oninput="setCustomValidity('')">
                                <label class="text-md">{t}Card Number{/t}</label>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <div class="row">
                                <div class="col-6">
                                    <div class="input-group">
                                        <input type="text" id="exp" name="cc_exp" placeholder="MM/YYYY" minlength="7"
                                            maxlength="7" required
                                            oninvalid="this.setCustomValidity('Please Enter expiry date on your card')"
                                            oninput="setCustomValidity('')">
                                        <label class="text-md">{t}Expiry Date{/t}</label>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="input-group">
                                        <input type="password" name="cc_ccv2" placeholder="&#9679;&#9679;&#9679;"
                                            minlength="3" maxlength="4" required
                                            oninvalid="this.setCustomValidity('Please Enter 3 digit CVV number on credit card number')"
                                            oninput="setCustomValidity('')">
                                        <label class="text-md">{t}CVV{/t}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <div class="input-group">
                                <input type="text" name="name" value="{$name}" placeholder="Name on card" required
                                    oninvalid="this.setCustomValidity('Please Enter full name on your card')"
                                    oninput="setCustomValidity('')">
                                <label class="text-md">{t}Name{/t}</label>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <div class="input-group">
                                <input type="text" name="address" value="{$address}" placeholder="Address line">
                                <label class="text-md">{t}Address{/t}</label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="input-group">
                                <input type="text" name="city" value="{$city}" placeholder="City">
                                <label class="text-md">{t}City{/t}</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="input-group">
                                <input type="text" name="state" value="{$state}" placeholder="State">
                                <label class="text-md">{t}State{/t}</label>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-6">
                            <div class="input-group">
                                {$country_select}
                                <!-- <input type="text" name="Country" placeholder="Country"> -->
                                <label class="text-md">{t}Country{/t}</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="input-group">
                                <input type="text" name="zip" value="{$zip}" placeholder="Zipcode">
                                <label class="text-md">{t}Zipcode{/t}</label>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-md-12">
                            <input type="submit" value="{t}Add Credit Card{/t}" class="btn btn-pay placeicon">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<div class="d-none" id="EditInfo" data-toggle="modal" data-target="#edit-info"></div>
<div class="modal fade" id="edit-info" style="display: none;" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header mx-4">
                <h4 class="modal-title">{t}Update Contact Info{/t}</h4>
            </div>
            <div class="modal-body">
                <form action="cart" method="post" class="form-card" id="EditInfo">
                    <input type="hidden" name="csrf_token" value="{$csrf_token}">
                    <input type="hidden" name="action" value="edit_info">
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <div class="input-group">
                                <input type="text" name="name" value="{$cont_fields.name}" placeholder="You Name">
                                <label class="text-md">{t}Name{/t}</label>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <div class="input-group">
                                <input type="text" name="address" value="{$cont_fields.address}"
                                    placeholder="Address line">
                                <label class="text-md">{t}Address{/t}</label>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <div class="input-group">
                                <input type="text" name="phone" value="{$phone}" placeholder="Phone Number" required>
                                <label class="text-md">{t}Phone{/t}</label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="input-group">
                                <input type="text" name="city" value="{$cont_fields.city}" placeholder="City">
                                <label class="text-md">{t}City{/t}</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="input-group">
                                <input type="text" name="state" value="{$cont_fields.state}" placeholder="State">
                                <label class="text-md">{t}State{/t}</label>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-6">
                            <div class="input-group">
                                {$country_select}
                                <!-- <input type="text" name="Country" placeholder="Country"> -->
                                <label class="text-md">{t}Country{/t}</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="input-group">
                                <input type="text" name="zip" value="{$cont_fields.zip}" placeholder="Zipcode">
                                <label class="text-md">{t}Zipcode{/t}</label>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-md-12">
                            <input type="submit" value="{t}Update Info{/t}" class="btn btn-pay placeicon">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<div class="d-none" id="EditClick" data-toggle="modal" data-target="#edit-card"></div>
<!--EDIT CC FORM IN MODAL-->
<div class="modal fade" id="edit-card" style="display: none;" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header mx-4">
                <h4 class="modal-title">{t}Update Credit Card{/t}</h4>
            </div>
            <div class="modal-body">
                <form action="cart" method="post" class="form-card" id="EditForm">
                    <input type="hidden" name="csrf_token" value="{$csrf_token}">
                    <input type="hidden" name="action" value="edit">
                    <input id="e_cc_idx" type="hidden" name="idx" value="">
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <div class="input-group">
                                <input type="text" id="e_exp" name="cc_exp" value="" placeholder="MM/YYYY" maxlength="7"
                                    required oninvalid="this.setCustomValidity('Please Enter expiry date on your card')"
                                    oninput="setCustomValidity('')">
                                <label class="text-md">{t}Expiry Date{/t}</label>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <div class="input-group">
                                <input style="border: none;letter-spacing: 19.5px;font-weight: bold;" type="text"
                                    id="e_cr_no" name="cc" required readonly disabled>
                                <label class="text-md">{t}Card Number{/t}</label>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-6">
                            <div class="input-group">
                                <input style="border: none;" type="text" name="name" value="{$cont_fields.name}"
                                    placeholder="Name on card" disabled>
                                <label class="text-md">{t}Name{/t}</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="input-group">
                                <input style="border: none;" type="text" name="address" value="{$cont_fields.address}"
                                    placeholder="Address line" disabled>
                                <label class="text-md">{t}Address{/t}</label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="input-group">
                                <input style="border: none;" type="text" name="city" value="{$cont_fields.city}"
                                    placeholder="City" disabled>
                                <label class="text-md">{t}City{/t}</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="input-group">
                                <input style="border: none;" type="text" name="state" value="{$cont_fields.state}"
                                    placeholder="State" disabled>
                                <label class="text-md">{t}State{/t}</label>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-6">
                            <div class="input-group">
                                <input style="border: none;" value="{$cont_fields.country}" type="text" name="Country"
                                    placeholder="Country">
                                <label class="text-md">{t}Country{/t}</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="input-group">
                                <input style="border: none;" type="text" name="zip" value="{$cont_fields.zip}"
                                    placeholder="Zipcode" disabled>
                                <label class="text-md">{t}Zipcode{/t}</label>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-md-12">
                            <input type="submit" value="{t}Update Card{/t}" class="btn btn-pay placeicon">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<form id="defaultpymt" action="cart" method="post">
    <input type="hidden" name="csrf_token" value="{$csrf_token}">
    <input type="hidden" name="action" value="default">
    <input id="defaultpymt_method" type="hidden" name="payment_method" value="">
    <input id="cc_auto_update" type="hidden" name="cc_auto_update" value="">
</form>
<form id="deleteForm" action="cart" method="POST">
    <input id="csrf_token" type="hidden" name="csrf_token" value="{$csrf_token}">
    <input type="hidden" name="action" value="delete">
    <input id="cc_idx" type="hidden" name="idx" value="">
</form>
<script src="/js/view_balance.js?202212170108"></script>
<script src="/js/lt/payment_types.js?202212090751"></script>
<script>
    function edit_info() {
        $("#EditInfo").trigger('click');
    }
</script>
{if isset($trigger_click)}
    <script>
        $(function() {
            $("#unver_{$current_cc_id}").attr("data-step", "{$trigger_click}").trigger('click');
        });
    </script>
{/if}
<script>
    {if $ima == 'admin'}
        var pay_cc_url = 'ajax.php?choice=pay_balance&custid={$custid}&ajx=1';
    {else}
        var pay_cc_url = 'ajax.php?choice=pay_balance&ajx=1';
    {/if}
    var currency = '{$currency}';
    var currencySymbol = '{$currencySymbol}';
    var inv_amounts = new Object();
    {$inv_amounts_script}
    {foreach key=module item=settings from=$modules}
        var {$module}inv_amounts = new Object();
    {/foreach}
    var inv_active = new Array({$active});
    var inv_recent = new Array({$recent});
    var toggle_status = new Array();
    var prepay_available = new Number({$prepay});
    var paymentMethods = {$paymentMethods};
    var paymentMethodsType = {$paymentMethodsType};
    var payssionMinAmount = '{$payssion_min}';
    var prepay_invoices = {$prepay_invoices};

    function delete_invoice(invoice_id) {
        const { value: formValues } = Swal.fire({
            type: "error",
            icon: "warning",
            title: '<h3>Invoice Delete ?</h3> ',
            showCancelButton: true,
            showLoaderOnConfirm: true,
            confirmButtonText: 'Yes, Delete it.',
            html: '<p>Are you sure want to delete your invoice?</p>',
            preConfirm: () => {
                $('#invdel' + invoice_id).submit();
            }
        });
    }
</script>
