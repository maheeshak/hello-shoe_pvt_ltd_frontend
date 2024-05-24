$('#btn-inventory-update').css('display', 'none');
let inventImageBase64 = '';


function setSupplierNames() {
    $.ajax({
        method: 'get',
        url: 'http://localhost:8081/api/v1/supplier/all',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (suppliers) {
            $('#txt-inventory-supplier-name').empty();
            $('#txt-inventory-supplier-name').append(new Option('Select Supplier', ''));
            for (let supplier of suppliers) {
                $('#txt-inventory-supplier-name').append(new Option(supplier.name, supplier.name));
            }
        }
    });
}



/*save inventory*/
$('#btn-inventory-save').click(function () {
    let desc = $('#txt-inventory-desc').val();
    let sup_name = $('#txt-inventory-supplier-name').val();
    let sup_id = $('#txt-inventory-supplier-id').val();
    let gender = $('#txt-inventory-gender').val();
    let occasion = $('#txt-inventory-occasion').val();
    let verities = $('#txt-inventory-verities').val();

    /*   "inventoryDTO": {
        "item_desc": "Example item description",
        "item_pic": "",
        "occasion": "SPORT",
        "gender": "FEMALE",
        "verities": "HEEL",
        "supplier": {
            "supplier_code": "S001",
            "supplier_name": "Example Supplier Inc.",
            "supplier_address": "123 Supplier Street, Supplier City"
        }
    }*/

    let inventoryDTO = {
        item_pic: inventImageBase64,
        item_desc: desc,
        occasion: occasion,
        gender: gender,
        verities: verities,
        supplier: {
            supplier_code: sup_id,
            name: sup_name
        }
    }

    /*sizeInventoryDetailsDTO": [
        {
            "id": 1,
            "size": {
                "size_code": "SIZE2"
            },
            "inventory": {
                "supplier": {
                    "supplier_code": "S001"
                }
            },
            "status": "AVAILABLE",
            "qty": 10,
            "buying_price": 10.0,
            "selling_price": 20.0,
            "expected_profit": 100.0,
            "profit_margin": 0.5
        }
    ]*/

    let sizeInventoryDetailsDTO = [];

    $('#tbl-inventory-details tbody tr').each(function () {
        let size = $(this).find('td').eq(0).text();
        let qty = $(this).find('td').eq(1).text();
        let buying_price = $(this).find('td').eq(2).text();
        let selling_price = $(this).find('td').eq(3).text();
        let expected_profit = $(this).find('td').eq(4).text();
        let profit_margin_percentage = $(this).find('td').eq(5).text();
        let profit_margin = profit_margin_percentage.substring(0, profit_margin_percentage.length - 1);


        let sizeInventoryDetails = {
            size: {
                size_code: size
            },
            inventory: {
                supplier: {
                    supplier_code: sup_id
                }
            },
            status: 'AVAILABLE',
            qty: qty,
            buying_price: buying_price,
            selling_price: selling_price,
            expected_profit: expected_profit,
            profit_margin: profit_margin
        };

        sizeInventoryDetailsDTO.push(sizeInventoryDetails);
    });

    console.log(inventoryDTO);
    console.log(sizeInventoryDetailsDTO);

    const inventoryDetailsDTO = {
        inventoryDTO: inventoryDTO,
        sizeInventoryDetailsDTO: sizeInventoryDetailsDTO
    };


    $.ajax({
        method: 'post',
        url: 'http://localhost:8081/api/v1/inventory',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        contentType: 'application/json',
        data: JSON.stringify(inventoryDetailsDTO),
        success: function (data) {
            alert('Inventory saved successfully');
            clearInventoryFields();
            loadAllInventories();
        }
    });

});


/*delete inventory*/

$('#tbl-inventory').on('click', '.btn-inventory-delete', function () {
    const inventory_code = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();
    Swal.fire({
        title: "Are you sure you want to delete this Inventory?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            $.ajax({
                method: 'DELETE',
                url: `http://localhost:8081/api/v1/inventory?item_code=${inventory_code}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function (response) {
                    if (response === true) {
                        loadAllInventories();
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your Inventory has been deleted.",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: "Your Inventory has not been deleted.",
                            icon: "error"
                        });
                    }
                }
            });
        }
    });

});

/*preview inventory*/
$('#tbl-inventory').on('click', '.btn-inventory-preview', function () {
    const inventory_code = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();
    $.ajax({
        method: 'get',
        url: `http://localhost:8081/api/v1/inventory?item_code=${inventory_code}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (inventory) {

            console.log(inventory);
            changeInputFieldsPreview();
            $('#txt-item-code').val(inventory.item_code);
            $('#txt-inventory-desc').val(inventory.item_desc);
            $('#txt-inventory-supplier-name').val(inventory.supplier.name);
            $('#txt-inventory-supplier-id').val(inventory.supplier.supplier_code);
            $('#txt-inventory-verities').val(inventory.verities);
            $('#txt-inventory-occasion').val(inventory.occasion);
            $('#txt-inventory-gender').val(inventory.gender);
            $('#invent-img-preview').attr('src', 'data:image/png;base64,' + inventory.item_pic);

            $('#tbl-inventory-details tbody tr').remove();


            $.ajax({
                method: 'get',
                url: `http://localhost:8081/api/v1/inventory/sizeDetails?item_code=${inventory_code}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function (sizeInventoryDetails) {
                    for (let sizeInventoryDetail of sizeInventoryDetails) {
                        let row = `<tr>
                                        <td>${sizeInventoryDetail.size.size_code}</td>
                                        <td>${sizeInventoryDetail.qty}</td>
                                        <td>${sizeInventoryDetail.buying_price}</td>
                                        <td>${sizeInventoryDetail.selling_price}</td>
                                        <td>${sizeInventoryDetail.expected_profit}</td>
                                        <td>${sizeInventoryDetail.profit_margin}</td>
                                    </tr>`;
                        $('#tbl-inventory-details tbody').append(row);
                    }
                    navigateToPage('#inventory-register-page');
                }
            })


        }

    });


});


/*inventory update*/
$('#tbl-inventory').on('click', '.btn-inventory-update', function () {
        const inventory_code = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();

        changeInputFieldsUpdate();

        $('#btn-inventory-save').css('display', 'none');
        $('#btn-inventory-update').css('display', 'block');
        $('#btn-inventory-clear').css('display', 'block');


        $.ajax({
            method: 'get',
            url: `http://localhost:8081/api/v1/inventory?item_code=${inventory_code}`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (inventory) {

                console.log(inventory);
                $('#txt-item-code').val(inventory.item_code);
                $('#txt-inventory-desc').val(inventory.item_desc);
                $('#txt-inventory-supplier-name').val(inventory.supplier.name);
                $('#txt-inventory-supplier-id').val(inventory.supplier.supplier_code);
                $('#txt-inventory-verities').val(inventory.verities);
                $('#txt-inventory-occasion').val(inventory.occasion);
                $('#txt-inventory-gender').val(inventory.gender);
                $('#invent-img-preview').attr('src', 'data:image/png;base64,' + inventory.item_pic);

                $('#tbl-inventory-details tbody tr').remove();


                $.ajax({
                    method: 'get',
                    url: `http://localhost:8081/api/v1/inventory/sizeDetails?item_code=${inventory_code}`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    success: function (sizeInventoryDetails) {
                        for (let sizeInventoryDetail of sizeInventoryDetails) {
                            let row = `<tr>
                                        <td>${sizeInventoryDetail.size.size_code}</td>
                                        <td>${sizeInventoryDetail.qty}</td>
                                        <td>${sizeInventoryDetail.buying_price}</td>
                                        <td>${sizeInventoryDetail.selling_price}</td>
                                        <td>${sizeInventoryDetail.expected_profit}</td>
                                        <td>${sizeInventoryDetail.profit_margin}</td>
                                        <td>
                    <a class="btn btn-danger btn-operations btn-inventory-details-remove">
                        <img src="../assets/img/remove.png" alt="delete" style="width: 20px; height: 20px;">
                    </a>
                </td>
                                    </tr>`;
                            $('#tbl-inventory-details tbody').append(row);
                        }
                        navigateToPage('#inventory-register-page');
                    }
                })


            }

        });


    }
);

$('#btn-inventory-update').click(function () {
    // let itemCode = $('#txt-item-code').val();
    // let desc = $('#txt-inventory-desc').val();
    // let sup_name = $('#txt-inventory-supplier-name').val();
    let sup_id = $('#txt-inventory-supplier-id').val();
    // let gender = $('#txt-inventory-gender').val();
    // let occasion = $('#txt-inventory-occasion').val();
    // let verities = $('#txt-inventory-verities').val();

    /*   "inventoryDTO": {
        "item_desc": "Example item description",
        "item_pic": "",
        "occasion": "SPORT",
        "gender": "FEMALE",
        "verities": "HEEL",
        "supplier": {
            "supplier_code": "S001",
            "supplier_name": "Example Supplier Inc.",
            "supplier_address": "123 Supplier Street, Supplier City"
        }
    }*/

    /* let inventoryDTO = {
         item_code : itemCode,
         item_pic: inventImageBase64,
         item_desc: desc,
         occasion: occasion,
         gender: gender,
         verities: verities,
         supplier: {
             supplier_code: sup_id,
             name: sup_name
         }
     }*/

    /*sizeInventoryDetailsDTO": [
        {
            "id": 1,
            "size": {
                "size_code": "SIZE2"
            },
            "inventory": {
                "supplier": {
                    "supplier_code": "S001"
                }
            },
            "status": "AVAILABLE",
            "qty": 10,
            "buying_price": 10.0,
            "selling_price": 20.0,
            "expected_profit": 100.0,
            "profit_margin": 0.5
        }
    ]*/

    let sizeInventoryDetailsDTO = [];

    $('#tbl-inventory-details tbody tr').each(function () {
        let item_code = $('#txt-item-code').val();
        let size = $(this).find('td').eq(0).text();
        let qty = $(this).find('td').eq(1).text();
        let buying_price = $(this).find('td').eq(2).text();
        let selling_price = $(this).find('td').eq(3).text();
        let expected_profit = $(this).find('td').eq(4).text();
        let profit_margin_percentage = $(this).find('td').eq(5).text();
        let profit_margin = profit_margin_percentage.substring(0, profit_margin_percentage.length - 1);


        let sizeInventoryDetails = {
            size: {
                size_code: size
            },
            inventory: {
                item_code: item_code,
                supplier: {
                    supplier_code: sup_id
                }
            },
            status: 'AVAILABLE',
            qty: qty,
            buying_price: buying_price,
            selling_price: selling_price,
            expected_profit: expected_profit,
            profit_margin: profit_margin
        };

        sizeInventoryDetailsDTO.push(sizeInventoryDetails);
    });

    // console.log(inventoryDTO);
    console.log(sizeInventoryDetailsDTO);

    // const inventoryDetailsDTO = {
    //     inventoryDTO: inventoryDTO,
    //     sizeInventoryDetailsDTO: sizeInventoryDetailsDTO
    // };


    $.ajax({
        method: 'put',
        url: 'http://localhost:8081/api/v1/inventory',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        contentType: 'application/json',
        data: JSON.stringify(sizeInventoryDetailsDTO),
        success: function (data) {
            alert('Inventory updated successfully');
            clearInventoryFields();
            loadAllInventories();
            navigateToPage('#inventory-page');
        }
    });


});


/*set size codes*/
function setSizeCodes() {
    $.ajax({
        method: 'get',
        url: 'http://localhost:8081/api/v1/size/all',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (sizes) {
            $('#txt-inventory-size').empty();

            $('#txt-inventory-size').append(new Option('Select Size', ''));
            for (let size of sizes) {
                $('#txt-inventory-size').append(new Option(size.size_code, size.size_code));
            }
        }
    });
}

/*add inventory details */
$('#btn-add-inventory-details').click(function () {
    // Fetching values from input fields
    let size = $('#txt-inventory-size').val();
    let qty = $('#txt-inventory-qty').val();
    let buying_price = $('#txt-inventory-buying-price').val();
    let selling_price = $('#txt-inventory-selling-price').val();
    let expected_profit = $('#txt-inventory-expected-profit').val();
    let profit_margin = $('#txt-inventory-profit-margin').val();

    // Check if a row with the same size already exists in the table
    if (!$('#tbl-inventory-details').find('td:first-child').filter(function () {
        return $(this).text() === size;
    }).length) {
        // If not, create a new row with the fetched values
        let row =
            `
            <tr>
                <td>${size}</td>
                <td>${qty}</td>
                <td>${buying_price}</td>
                <td>${selling_price}</td>
                <td>${expected_profit}</td>
                <td>${profit_margin}</td>
                <td>
                    <a class="btn btn-danger btn-operations btn-inventory-details-remove">
                        <img src="../assets/img/remove.png" alt="delete" style="width: 20px; height: 20px;">
                    </a>
                </td>
            </tr>
            `;

        // Appending the newly created row to the table body
        $('#tbl-inventory-details tbody').append(row);

// Clearing the input fields
        $('#txt-inventory-size').val('');
        $('#txt-inventory-qty').val('');
        $('#txt-inventory-buying-price').val('');
        $('#txt-inventory-selling-price').val('');
        $('#txt-inventory-expected-profit').val('');
        $('#txt-inventory-profit-margin').val('');

    } else {
        // If a row with the same size already exists, display a message or take appropriate action
        alert('A row with the same size already exists in the table.');
    }
});

/*remove inventory details*/
$('#tbl-inventory-details').on('click', '.btn-inventory-details-remove', function () {
    $(this).closest('tr').remove();

});


$('#txt-inventory-selling-price').on('keypress', function (event) {
    if (event.key === "Enter") {
        var buyingPrice = parseFloat($('#txt-inventory-buying-price').val());
        var sellingPrice = parseFloat($('#txt-inventory-selling-price').val());

        // Check if both inputs are valid numbers
        if (!isNaN(buyingPrice) && !isNaN(sellingPrice)) {
            // Calculate expected profit
            var expectedProfit = sellingPrice - buyingPrice;

            // Calculate profit margin
            var profitMargin = (expectedProfit / buyingPrice) * 100;

            // Set the values to the respective fields
            $('#txt-inventory-expected-profit').val(expectedProfit.toFixed(2));
            $('#txt-inventory-profit-margin').val(profitMargin.toFixed(2) + '%');
        } else {
            // Clear the fields if the inputs are not valid
            document.getElementById('txt_expected_profit').value = '';
            document.getElementById('txt_profit_margin').value = '';
        }
    }
});

$('#txt-inventory-supplier-name').on('change', function (event) {

    let sup_name = $('#txt-inventory-supplier-name').val();
    console.log(sup_name);
    $.ajax({
        method: 'get',
        url: `http://localhost:8081/api/v1/supplier/nameCode?supplier_name=${sup_name}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (supplier_code) {
            if (supplier_code === '') {
                $('#txt-inventory-supplier-id').val('');
                alert('Supplier not found');
                return;
            }
            $('#txt-inventory-supplier-id').val(supplier_code);
        }
    });

});

/*clear inventory fields*/
function clearInventoryFields() {
    $('#invent-img-preview').attr('src', '../assets/img/no-image-img.jpg');
    $('#in')
    $('#txt-inventory-desc').val('');
    $('#txt-inventory-supplier-name').val('');
    $('#txt-inventory-supplier-id').val('');
    $('#txt-inventory-gender').val('');
    $('#txt-inventory-occasion').val('');
    $('#txt-inventory-verities').val('');
    $('#txt-inventory-size').val('');
    $('#txt-inventory-qty').val('');
    $('#txt-inventory-buying-price').val('');
    $('#txt-inventory-selling-price').val('');
    $('#txt-inventory-expected-profit').val('');
    $('#txt-inventory-profit-margin').val('');
    $('#tbl-inventory-details tbody').empty();
    setSizeCodes();

}

function inventImgPreview(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#invent-img-preview').attr('src', e.target.result);
            inventImageBase64 = e.target.result.split(',')[1]; // Store the base64 string
        }
        reader.readAsDataURL(input.files[0]);
    } else {
        $('#invent-img-preview').attr('src', '../assets/img/no-image-img.jpg');
        inventImageBase64 = ''; // Reset the base64 string if no image selected
    }
}

/*load all inventory*/
function loadAllInventories() {


    $.ajax({
        method: 'GET',
        url: 'http://localhost:8081/api/v1/inventory/all',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (inventories) {
            $('#tbl-inventory tbody tr').remove();
            for (let inventory of inventories) {

                let invent_pic = '';

                if (inventory.item_pic && inventory.item_pic !== '') {
                    // Assuming inventory.item_pic is a base64 encoded string
                    invent_pic = "data:image/png;base64," + inventory.item_pic;
                } else {
                    // If item_pic is not available or empty, you can set a default image or leave it empty
                    invent_pic = '../assets/img/no-image-img.jpg'; // Set path to your default image
                }

                let row = `<tr>
                                    <td>
                                        <div class="table-img">
                                            <img src=${invent_pic} alt="inventory" class="img-table"/>
                                            <label class="action_label">${inventory.item_code}</label>
                                        </div>
                                    </td>
                                    <td>
                                        <label>${inventory.item_desc}</label>
                                    </td>
                                    <td>
                                        <label>${inventory.supplier.name}</label>
                                    </td>
                                    <td>
                                        <label class="action_label2">${inventory.occasion}</label>
                                    </td>
                                    <td>
                                        <label>${inventory.verities}</label>
                                    </td>
                                    <td>
                                        <div class="action-label">

                                            <a class="btn  btn-inventory-preview" style="background-color: #2c80ff"><img
                                                    src="../assets/img/preview.png"
                                                    alt="edit"
                                                    style="width: 20px; height: 20px;"/></a>

                                            <a class="btn btn-warning btn-inventory-update"><img
                                                    src="../assets/img/edit.png"
                                                    alt="edit"
                                                    style="width: 20px; height: 20px;"/></a>
                                            <a class="btn btn-danger btn-inventory-delete"><img
                                                    src="../assets/img/remove.png"
                                                    alt="delete"
                                                    style="width: 20px; height: 20px;"/></a>
                                        </div>
                                    </td>
                                </tr> `;
                $('#tbl-inventory tbody').append(row);
            }
        }
    });
}

function changeInputFieldsPreview() {
    $('#btn-inventory-save').css('display', 'none');
    $('#btn-inventory-update').css('display', 'none');
    $('#btn-inventory-clear').css('display', 'none');

    $('.invent-size-class').css('display', 'none');
    /*all fields read only*/
    $('#txt-inventory-desc').attr('readonly', true);
    $('#txt-inventory-supplier-name').attr('disabled', true);
    $('#txt-inventory-supplier-id').attr('readonly', true);
    $('#txt-inventory-gender').attr('disabled', true);
    $('#txt-inventory-occasion').attr('disabled', true);
    $('#txt-inventory-verities').attr('disabled', true);
    $('#item_image').css('display', 'none');
}

function changeInputFieldsRegister() {
    $('#btn-inventory-save').css('display', 'block');
    $('#btn-inventory-update').css('display', 'none');
    $('#btn-inventory-clear').css('display', 'block');

    $('.invent-size-class').css('display', 'block');
    /*all fields read only*/
    $('#txt-inventory-desc').attr('readonly', false);
    $('#txt-inventory-supplier-name').attr('disabled', false);
    $('#txt-inventory-supplier-id').attr('readonly', false);
    $('#txt-inventory-gender').attr('disabled', false);
    $('#txt-inventory-occasion').attr('disabled', false);
    $('#txt-inventory-verities').attr('disabled', false);
    $('#txt-item-code').val('');
    $('#item_image').css('display', 'block');

}

function changeInputFieldsUpdate() {
    $('#btn-inventory-save').css('display', 'none');
    $('#btn-inventory-update').css('display', 'block');
    $('#btn-inventory-clear').css('display', 'block');

    $('.invent-size-class').css('display', 'block');
}

function setInventoryCount() {
    $.ajax(
        {
            method: 'GET',
            url: 'http://localhost:8081/api/v1/inventory/count',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (count) {
                $('#lbl-inventory-count').text(count);
            }
        }
    );
}