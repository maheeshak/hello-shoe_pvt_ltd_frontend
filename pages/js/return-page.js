$('#txt-return-order-id').on('keypress', function (event) {
    if (event.key == "Enter") {
        /*http://localhost:8080/api/v1/sale?order_id=O002*/

        var order_id = $('#txt-return-order-id').val();

        $.ajax({
            url: `http://localhost:8080/api/v1/sale?order_id=${order_id}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (response) {

                console.log(response);
                if (response == null || response == "" || response == undefined) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Order ID is invalid",
                    });


                }else {
                    setTimeAndDate(response.purchase_date);
                    $('#lbl-return-order-total').text(response.total_price);
                    let contact = response.customer.contact;
                    if (contact == null) {
                        $('#lbl-return-cust-contact').addClass('text-danger');
                        $('#lbl-return-cust-contact').text("Not Registered");
                        $('#lbl-return-cust-name').text("-");
                        $('#lbl-return-cust-points').text("-");
                        $('#lbl-return-cust-recent').text("-");

                    } else {
                        $('#lbl-return-cust-contact').removeClass('text-danger');
                        $('#lbl-return-cust-contact').text(response.customer.contact);
                        $('#lbl-return-cust-name').text(response.customer.name);
                        $('#lbl-return-cust-points').text(response.added_points);
                        $('#lbl-return-cust-recent').text(convertUTCToLocal(response.customer.recent_purchase));
                    }

                    loadInventoryDetails();
                }

            }
        });
    }
});


function convertUTCToLocal(utcTimestamp) {
    var localTime = new Date(utcTimestamp);
    return localTime.toLocaleString(); // Convert to local date and time format
}


function setTimeAndDate(utcTimestamp) {
    // Parse the UTC timestamp string
    var dateObj = new Date(utcTimestamp);

    // Extract date components
    var year = dateObj.getFullYear();
    var month = dateObj.getMonth() + 1; // Months are zero-indexed
    var day = dateObj.getDate();

    // Extract time components
    var hours = dateObj.getHours();
    var minutes = dateObj.getMinutes();
    var seconds = dateObj.getSeconds();

    // Format the date and time components
    var formattedDate = year + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day;
    var formattedTime = (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

    $('#lbl-return-order-date').text(formattedDate);
    $('#lbl-return-order-time').text(formattedTime);

}

function loadInventoryDetails() {
    var order_id = $('#txt-return-order-id').val();
    $.ajax({
        url: `http://localhost:8080/api/v1/sale/saleInventory?order_id=${order_id}`,
        type: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (response) {
            console.log(response);
            $('#tbl-return-order-details tbody tr').remove()

            if (response == null || response == "" || response == undefined) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Items Already Returned",
                });
                return
            }

            for (let i = 0; i < response.length; i++) {

                let product_code = response[i].inventory.item_code;
                let description = response[i].inventory.item_desc;
                let size = response[i].size;
                let unit_price = response[i].selling_price;
                let qty = response[i].item_qty;
                let total = parseFloat(unit_price) * parseInt(qty);

                let row = `<tr>
                                            <td>${product_code}</td>
                                            <td>${description}</td>
                                            <td>${size}</td>
                                            <td>${qty}</td>
                                            <td>${unit_price}</td>
                                            <td>${total}</td>
                                            <td><a class="btn btn-warning btn-return-order"><img
                                                    src="../assets/img/nav-return.png"
                                                    alt="edit"
                                                    style="width: 20px; height: 20px;"/></a></td>
                                        </tr>`;
                $('#tbl-return-order-details tbody').append(row)
            }


        }
    });
}


$('#btn-return-refresh').click(function (event) {
    var order_id = $('#txt-return-order-id').val();

    $.ajax({
        url: `http://localhost:8080/api/v1/sale?order_id=${order_id}`,
        type: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (response) {

            setTimeAndDate(response.purchase_date);
            $('#lbl-return-order-total').text(response.total_price);
            let contact = response.customer.contact;
            if (contact == null) {
                $('#lbl-return-cust-contact').addClass('text-danger');
                $('#lbl-return-cust-contact').text("Not Registered");
                $('#lbl-return-cust-name').text("-");
                $('#lbl-return-cust-points').text("-");
                $('#lbl-return-cust-recent').text("-");

            } else {
                $('#lbl-return-cust-contact').removeClass('text-danger');
                $('#lbl-return-cust-contact').text(response.customer.contact);
                $('#lbl-return-cust-name').text(response.customer.name);
                $('#lbl-return-cust-points').text(response.added_points);
                $('#lbl-return-cust-recent').text(convertUTCToLocal(response.customer.recent_purchase));
            }

            loadInventoryDetails();
            returnDTO = [];

        }
    });

});


let returnDTO = [];

$('#tbl-return-order-details').on('click', '.btn-return-order', function (event) {
    let row = $(this).closest('tr');

    let product_code = row.find('td:eq(0)').text();
    let size = row.find('td:eq(2)').text();
    let qty = row.find('td:eq(3)').text();
    let order_code = $('#txt-return-order-id').val();
    let reason = $('#txt-return-reason').val();

    let product = {
        item_code: product_code,
        size_code: size,
        qty: qty,
        order_id: order_code,
        reason: reason
    };

    returnDTO.push(product);

    $(this).closest('tr').remove();

    console.log(returnDTO);

});


$('#btn-return-save').click(function () {

    $.ajax({
        url: `http://localhost:8080/api/v1/return`,
        type: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(returnDTO),
        contentType: 'application/json',
        success: function (response) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Return has been successfully",
                showConfirmButton: false,
                timer: 1500
            });
            $('#txt-return-order-id').val("");
            $('#txt-return-reason').val("");
            $('#lbl-return-order-date').text("-");
            $('#lbl-return-order-time').text("-");
            $('#lbl-return-order-total').text("-");
            $('#lbl-return-cust-contact').text("-");
            $('#lbl-return-cust-name').text("-");
            $('#lbl-return-cust-points').text("-");
            $('#lbl-return-cust-recent').text("-");
            $('#tbl-return-order-details tbody tr').remove();
        }

    })
})