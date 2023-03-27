<div class="row justify-content-center">
	<div class="col-md-12">
		<div class="card shadow-none">
			<div class="card-header">
				<h3 class="card-title"><i class="fa fa-money"></i> Invoices List</h3>
			</div>
			<div class="card-body">
				<div class="row">
					<div class="col">
						<form class="form-inline d-inline w-100" method="post">
							<div class="row">
								<div class="col-md-2">
									<div class="input-group">
										<label class="mx-2">Filter </label>
										<select id="inv_month" name="inv_month" class="form-control form-control-sm select2" onchange="this.form.submit()">
											<option value="">{t}All{/t}</option>
											{foreach from=$months_arr key=val item=text}
												<option value="{$val}" {if isset($month) && $val == $month}selected="selected"{/if}>{$text}</option>
											{/foreach}
										</select>
									</div>
								</div>
								<div class="col-md-2">
									<div class="input-group">
										<select id="inv_year" name="inv_year" class="select2 form-control form-control-sm" onchange="this.form.submit()">
											<option value="">{t}All{/t}</option>
											{foreach from=$years_arr key=val item=text}
												<option value="{$val}" {if isset($year) && $val == $year}selected="selected"{/if}>{$text}</option>
											{/foreach}
										</select>
									</div>
								</div>
								<div class="col-md-4">
									<button type="submit" name="Submit" value="export_excel" class="btn btn-primary mb-2 btn-sm">{t}Export Excel{/t}</button>
									<button type="submit" name="Submit" value="export_pdf" class="btn btn-primary mb-2 btn-sm">{t}Export PDF{/t}</button>
								</div>
							</div>
						</form>
					</div>
				</div>
				<hr>
				<table id="invoices_table" class="table table-sm display compact">
					<thead>
					<tr>
						<th>ID</th>
						<th>Date</th>
						<th>Service</th>
						<th>Description</th>
						<th>Amount</th>
						<th>Paid</th>
						<th>Payment</th>
						<th>Payment Description</th>
						<th>Paid On</th>
						<th>Links</th>
					</tr>
					</thead>
					<tbody>
					{foreach from=$rows item=row}
						<tr>
							<td><a href="pdf.php?choice=view_invoice&module={$row.module}&id={$row.id}">{$row.id}</a></td>
							<td>{$row.date}</td>
							<td>{$row.service}</td>
							<td>{$row.description}</td>
							<td class="text-right">{$row.amount}</td>
							<td>{$row.paid}</td>
							<td>{$row.payment_type}</td>
							<td>{$row.payment_description}</td>
							<td>{$row.paid_on}</td>
							<td></td>
						</tr>
					{/foreach}
					</tbody>
					<tfoot>
					<tr>
						<th>ID</th>
						<th>Date</th>
						<th>Service</th>
						<th>Description</th>
						<th>Amount</th>
						<th>Paid</th>
						<th>Payment Type</th>
						<th>Payment Description</th>
						<th>Paid On</th>
						<th>Links</th>
					</tr>
					</tfoot>
				</table>
			</div>
		</div>
	</div>
</div>
<link rel="stylesheet" href="/lib/datatables.net-bs4/css/dataTables.bootstrap4.min.css">
<script src="/lib/datatables.net/js/jquery.dataTables.min.js"></script>
<script src="/lib/datatables.net-bs4/js/dataTables.bootstrap4.min.js"></script>
<script type="text/javascript">
	$('#invoices_table').DataTable({
		"createdRow": function ( row, data, index ) {
			var invoiceId = $('td', row).eq(0).text();
			var firstElem = $('td:first', row);
			var hrefUrl = $('td:first a', row).attr('href');
			$('td', row).eq(9).html('<a href="'+hrefUrl+'" title="Download Invoice PDF"><i class="icon-pdf"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-pdf"></use></svg></i></a> '+'<a href="'+hrefUrl.replace(/pdf\.php/g, 'index.php')+'" title="View Invoice"><i class="icon-view-details"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-view-details"></use></svg></i></a>');
		},
		"order": [[ 0, "desc" ]],
		"pageLength": 50,
		"lengthMenu": [[10, 25, 50, 100, 500, -1], [10, 25, 50, 100, 500, "All"]]
	});
</script>
