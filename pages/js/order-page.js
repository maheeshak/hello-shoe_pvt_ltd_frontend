// Get the current date
var currentDate = new Date();

// Extract the components of the date
var day = currentDate.getDate();
var month = currentDate.getMonth() + 1; // Months are zero-indexed, so we add 1
var year = currentDate.getFullYear();

// Format the date as desired (e.g., dd-mm-yyyy)
var formattedDate = (day < 10 ? '0' : '') + day + '-' + (month < 10 ? '0' : '') + month + '-' + year;

// Update the content of the HTML element with the id "date"
document.getElementById("lbl-order-date").innerText = formattedDate;


function updateTime() {
    // Get the current time
    var currentTime = new Date();

    // Extract the hours, minutes, seconds, and AM/PM
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var ampm = hours >= 12 ? 'P.M.' : 'A.M.';

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

    // Add leading zero if minutes are less than 10
    minutes = minutes < 10 ? '0' + minutes : minutes;

    // Add leading zero if seconds are less than 10
    seconds = seconds < 10 ? '0' + seconds : seconds;

    // Construct the formatted time string
    var formattedTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;

    // Update the content of the HTML element with the id "price"
    document.getElementById("lbl-order-time").innerText = formattedTime;
    setGreetings()
}

// Call updateTime every second to keep the time updated
setInterval(updateTime, 1000);

function setGreetings() {
    // Get the current time
    var currentTime = new Date();

    // Extract the hours
    var hours = currentTime.getHours();

    // Initialize the greeting message
    var greeting = '';

    // Determine the appropriate greeting based on the time of day
    if (hours < 12) {
        greeting = 'Good morning!';
    } else if (hours < 18) {
        greeting = 'Good afternoon!';
    } else {
        greeting = 'Good evening!';
    }

    // Update the content of the HTML element with the id "greeting"
    document.getElementById("lbl-greeting").innerText = greeting;
}


updateTime();
setOrderID();

$('#btn-order-cash').click(function () {
    $('#btn-order-cash').addClass('selected');
    $('#btn-order-card').removeClass('selected');
});

$('#btn-order-card').click(function () {
    $('#btn-order-card').addClass('selected');
    $('#btn-order-cash').removeClass('selected');

});
let customerDetails = '';
$('#txt-order-cust-contact').on('keypress', function (event) {
    if (event.key === "Enter") {

        var contact = $('#txt-order-cust-contact').val();

        $.ajax({
            url: `http://localhost:8081/api/v1/customer/contact?customer_contact=${contact}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (customer) {

                if (customer === null || customer === undefined || customer === "") {
                    $('#txt-order-cust-name').val('');
                    alert('Customer not found')
                    return
                }
                customerDetails = customer;
                $('#txt-order-cust-name').val(customer.name);
                $('#txt-order-points').val(customer.point);
                $('#txt-order-recent').val(convertUTCToLocal(customer.recent_purchase));


            }
        });
    }
});

function convertUTCToLocal(utcTimestamp) {
    var localTime = new Date(utcTimestamp);
    return localTime.toLocaleString(); // Convert to local date and time format
}




let inventory = '';
let invent_pic = '';
let sizeInventoryDetail = [];
$('#txt-order-product-code').on('keypress', function (event) {
    if (event.key === "Enter") {
        var inventory_code = $('#txt-order-product-code').val();

        $.ajax({
            url: `http://localhost:8081/api/v1/inventory?item_code=${inventory_code}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (product) {
                console.log(product);
                if (product === null || product === undefined || product === "") {
                    $('#txt-order-product-desc').val('');
                    $('#txt-order-product-av-qty').val('');
                    alert('Product not found')
                    return
                }
                inventory = product;
                $('#txt-order-product-desc').val(product.item_desc);

                $.ajax({
                    method: 'get',
                    url: `http://localhost:8081/api/v1/inventory/sizeDetails?item_code=${inventory_code}`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    success: function (sizeInventoryDetails) {
                        sizeInventoryDetail = sizeInventoryDetails;

                        $('#txt-order-size').empty();
                        $('#txt-order-size').append(new Option('Select Size', ''));

                        sizeInventoryDetails.forEach(function (sizeInventoryDetail) {
                                $('#txt-order-size').append(new Option(sizeInventoryDetail.size.size_code, sizeInventoryDetail.size.size_code));
                            }
                        );
                    }
                });
            }
        });
    }
});

$('#txt-order-size').on('change', function () {
    var selectedSize = $('#txt-order-size').val();
    var selectedSizeDetail = sizeInventoryDetail.find(sizeInventoryDetail => sizeInventoryDetail.size.size_code === selectedSize);
    $('#txt-order-product-av-qty').val(selectedSizeDetail.qty);
});


$("#btn-order-details-add").click(function () {


    if (inventory.item_pic && inventory.item_pic !== '') {
        // Assuming inventory.item_pic is a base64 encoded string
        invent_pic = "data:image/png;base64," + inventory.item_pic;
    } else {
        // If item_pic is not available or empty, you can set a default image or leave it empty
        invent_pic = '../assets/img/no-image-img.jpg'; // Set path to your default image
    }

    let productCode = $('#txt-order-product-code').val();
    let productDesc = $('#txt-order-product-desc').val();
    let size = $('#txt-order-size').val();
    let qty = $('#txt-order-product-buy-qty').val();
    let price = sizeInventoryDetail.find(sizeInventoryDetail => sizeInventoryDetail.size.size_code === size).selling_price;
    let total = parseFloat(qty) * parseFloat(price);

    console.log(productCode, productDesc, size, qty, price, total);
    console.log(inventory);
    let rowExists = false;
    $('#tbl-order-details tr').each(function () {
        let currentProductCode = $(this).find('.action_label').text();
        let currentSize = $(this).find('.action_label2').first().text();

        if (currentProductCode === productCode && currentSize === size) {
            // If a matching row is found, update the quantity and total
            let currentQty = parseFloat($(this).find('.action_label2').last().text());
            let newQty = parseInt(currentQty) + parseInt(qty);
            let newTotal = parseInt(newQty) * parseFloat(price);

            $(this).find('.action_label2').last().text(newQty);
            $(this).find('td').eq(5).find('label').text(newTotal.toFixed(2)); // Assuming the 7th column is the total

            rowExists = true;
            calculateTotal();
            return false; // Break the loop
        }
    });

    // If no matching row exists, append a new row
    if (!rowExists) {
        let row = `<tr>
                        <td>
                            <div class="table-img">
                                <img src="${invent_pic}" alt="inventory" class="img-table"/>
                                <label class="action_label">${productCode}</label>
                            </div>
                        </td>
                        <td>
                            <label>${productDesc}</label>
                        </td>
                        <td>
                            <label class="action_label2">${size}</label>
                        </td>
                        <td>
                            <label>${qty}</label>
                        </td>
                   
                        <td>
                            <label>${price}</label>
                        </td>
                        <td>
                            <label>${total.toFixed(2)}</label>
                        </td>
                        <td>
                            <div class="action-label">
                                <a class="btn btn-danger btn-order-inventory-delete"><img
                                        src="../assets/img/remove.png"
                                        alt="delete"
                                        style="width: 20px; height: 20px;"/></a>
                            </div>
                        </td>
                    </tr>`;

        $('#tbl-order-details').append(row);
        calculateTotal();
        clearOrderInventoryFeildes();
    }


});

$('#tbl-order-details').on('click', '.btn-order-inventory-delete', function () {
    $(this).closest('tr').remove();
    calculateTotal();
});

function calculateTotal() {
    let total = 0;
    $('#tbl-order-details tr').each(function () {
        let rowTotalText = $(this).find('td').eq(5).find('label').text().trim();
        let rowTotal = parseFloat(rowTotalText);

        // Check if rowTotal is a valid number
        if (!isNaN(rowTotal)) {
            console.log(rowTotal);
            total += rowTotal;
        } else {
            console.error(`Invalid number found in row: ${rowTotalText}`);
        }
    });

    console.log(total);

    /* Add Rs */
    $('#txt-order-total').text('Rs ' + total.toFixed(2));
}


function clearOrderInventoryFeildes() {
    $('#txt-order-product-code').val('');
    $('#txt-order-product-desc').val('');
    $('#txt-order-product-av-qty').val('');
    $('#txt-order-size').val('');
    $('#txt-order-product-buy-qty').val('');

    $('#txt-order-product-code').focus();
}

function setOrderID() {
    $.ajax({
        url: `http://localhost:8081/api/v1/sale/id`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (order_code) {
            $('#lbl-order-id').text(order_code);

        }
    });
}

/*place order*/
$('#btn-place-order').click(function () {
    if (!validateOrder()) {
        return;
    }



    /*{
        "saleDTO": {
            "order_id": "O001",
            "total_price": 150.75,
            "purchase_date": "2024-05-22T10:30:00.000Z",
            "payment_method": "Credit Card",
            "added_points": 15.5,
            "cashier_name": "John Doe",
            "customer": {
                "customer_code":"C001"
            },
            "customer_name": "Jane Smith"
        },
        "saleInventoryDetailsDTO": [
            {
                "id": 1,
                "sale": {
                    "order_id": "O001"
                },
                "inventory": {

                    "item_code": "FSM0002"

                },
                "size": 1,
                "selling_price": 50.25,
                "item_qty": 1
            }
        ]
    }
     */


    let order_id = $('#lbl-order-id').text();
    /*RS 000.00 Remove Rs. and assign*/
    let total_price = parseFloat($('#txt-order-total').text().replace(/[^\d.]/g, ''));
    let purchase_date = new Date();
    let payment_method = $('#btn-order-cash').hasClass('selected') ? 'Cash' : 'Card';
    let cashier_name = username;
    let customer_code = customerDetails.customer_code;
    if (customer_code === '' || customer_code === undefined || customer_code === null) {
        customer_code = 'C000';
    }
    let customer_name = $('#txt-order-cust-name').val();
    let added_points = 0;
    if (total_price > 800) {
        added_points = 1;
    }
    let saleInventoryDetailsDTO = [];

    $('#tbl-order-details tbody tr').each(function () {
        let productCode = $(this).find('.action_label').text();
        let sizeText = $(this).find('.action_label2').first().text();
        /*SIZE1 Remove SIZE text and assign number only*/
        let size = parseInt(sizeText.replace(/\D/g, ''));
        console.log(size);
        let qty = $(this).find('td').eq(3).find('label').text().trim();
        let price = $(this).find('td').eq(5).find('label').text();

        let saleInventoryDetail = {
            "sale":{
                "order_id" : order_id
            },
            "inventory": {
                "item_code": productCode
            },
            "size": size,
            "selling_price": price,
            "item_qty": qty,
            "status": "Success"
        };

        saleInventoryDetailsDTO.push(saleInventoryDetail);
    });

    let order = {
        "saleDTO": {
            "order_id": order_id,
            "total_price": total_price,
            "purchase_date": purchase_date,
            "payment_method": payment_method,
            "added_points": added_points,
            "cashier_name": cashier_name,
            "customer": {
                "customer_code": customer_code
            },
            "customer_name": customer_name
        },
        "saleInventoryDetailsDTO": saleInventoryDetailsDTO
    };

    console.log(order);

    $.ajax({
        url: 'http://localhost:8081/api/v1/sale',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        contentType: 'application/json',
        data: JSON.stringify(order),
        success: function (response) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Order placed successfully",
                showConfirmButton: false,
                timer: 1500
            });
            clearOrderInventoryFeildes();
            clearOrderFromFeilds();
            setOrderID();

        },
        error: function (response) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Failed to place the order",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });

});

function clearOrderFromFeilds() {
    $('#txt-order-cust-contact').val('');
    $('#txt-order-cust-name').val('');
    $('#txt-order-points').val('');
    $('#txt-order-recent').val('');
    $('#txt-order-product-code').val('');
    $('#txt-order-product-desc').val('');
    $('#txt-order-product-av-qty').val('');
    $('#txt-order-size').val('');
    $('#txt-order-product-buy-qty').val('');
    $('#txt-order-total').text('Rs 0.00');
    $('#tbl-order-details tbody').empty();
    $('#btn-order-cash').removeClass('selected');
    $('#btn-order-card').removeClass('selected');
    $('#txt-order-cust-contact').focus();
}
function validateOrder() {
    const showError = (message) => {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 1500
        });
    };

    let order_id = $('#lbl-order-id').text();
    if (!order_id) {
        showError("Order ID is missing");
        return false;
    }

    let total_price = parseFloat($('#txt-order-total').text().replace(/[^\d.]/g, ''));
    if (isNaN(total_price) || total_price <= 0) {
        showError("Total price is invalid");
        return false;
    }

    /*check available qty < qty*/
    let available_qty = $('#txt-order-product-av-qty').val();
    let qty = $('#txt-order-product-buy-qty').val();
    if (parseInt(qty) > parseInt(available_qty)) {
        showError("Not enough stock available");
        return false;
    }


    let customer_name = $('#txt-order-cust-name').val();
    if (!customer_name) {
        showError("Customer name is missing");
        return false;
    }

    if ($('#tbl-order-details tbody tr').length === 0) {
        showError("No products in the order");
        return false;
    }

    const paymentMethodSelected = $('#btn-order-cash').hasClass('selected') || $('#btn-order-card').hasClass('selected');
    if (!paymentMethodSelected) {
        showError("Select a payment method");
        return false;
    }

    const multiplePaymentMethodsSelected = $('#btn-order-cash').hasClass('selected') && $('#btn-order-card').hasClass('selected');
    if (multiplePaymentMethodsSelected) {
        showError("Select only one payment method");
        return false;
    }
    setOrderID();
    return true;
}


