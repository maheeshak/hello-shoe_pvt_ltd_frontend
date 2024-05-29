$('#btn-sup-update').css('display', 'none');

const contactPattern = /^\d{10}$/; // Pattern for 10-digit contact number
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Common pattern for validating email address

/*save supplier*/

$('#btn-sup-save').click(function () {

    if (!validateSupplier()) {
        return;
    }

    let supplierCode = $('#txt-sup-code').val();
    let name = $('#txt-sup-name').val();
    let category = $('#txt-sup-category').val();
    let building_no = $('#txt-sup-building-no').val();
    let lane = $('#txt-sup-lane').val();
    let city = $('#txt-sup-city').val();
    let state = $('#txt-sup-state').val();
    let postal_code = $('#txt-sup-postal-code').val();
    let country = $('#txt-sup-country').val();
    let contact = $('#txt-sup-contact').val();
    let land_line = $('#txt-sup-land-line').val();
    let email = $('#txt-sup-email').val();

    const supplier = {
        supplier_code: supplierCode,
        name: name,
        category: category,
        building_number: building_no,
        lane: lane,
        city: city,
        state: state,
        postal_code: postal_code,
        country: country,
        mobile_contact: contact,
        landline_contact: land_line,
        email: email
    };

    $.ajax({
        method: 'POST',
        url: 'http://localhost:8081/api/v1/supplier',
        contentType: 'application/json',
        data: JSON.stringify(supplier),
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (data) {
            if (data) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Supplier has been saved successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                loadAllSupplier();
                setSupplierCode();
                clearSupplierFields();
            } else {
                alert('Failed to save the supplier');
            }
        }
    });

});

/*update supplier*/

$('#tbl-supplier').on('click', '.btn-sup-update', function () {
    const supId = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();
    $.ajax({
        method: 'GET',
        url: `http://localhost:8081/api/v1/supplier?supplier_code=${supId}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (supplier) {
            $('#txt-sup-code').val(supplier.supplier_code);
            $('#txt-sup-name').val(supplier.name);
            $('#txt-sup-category').val(supplier.category);
            $('#txt-sup-building-no').val(supplier.building_number);
            $('#txt-sup-lane').val(supplier.lane);
            $('#txt-sup-city').val(supplier.city);
            $('#txt-sup-state').val(supplier.state);
            $('#txt-sup-postal-code').val(supplier.postal_code);
            $('#txt-sup-country').val(supplier.country);
            $('#txt-sup-contact').val(supplier.mobile_contact);
            $('#txt-sup-land-line').val(supplier.landline_contact);
            $('#txt-sup-email').val(supplier.email);
            $('#btn-sup-update').css('display', 'block');
            $('#btn-sup-save').css('display', 'none');
            navigateToPage('#supplier-register-page');
        }
    });

});

$('#btn-sup-update').click(function () {

    if (!validateSupplier()) {
        return;
    }

    let supplierCode = $('#txt-sup-code').val();
    let name = $('#txt-sup-name').val();
    let category = $('#txt-sup-category').val();
    let building_no = $('#txt-sup-building-no').val();
    let lane = $('#txt-sup-lane').val();
    let city = $('#txt-sup-city').val();
    let state = $('#txt-sup-state').val();
    let postal_code = $('#txt-sup-postal-code').val();
    let country = $('#txt-sup-country').val();
    let contact = $('#txt-sup-contact').val();
    let land_line = $('#txt-sup-land-line').val();
    let email = $('#txt-sup-email').val();

    const supplier = {
        supplier_code: supplierCode,
        name: name,
        category: category,
        building_number: building_no,
        lane: lane,
        city: city,
        state: state,
        postal_code: postal_code,
        country: country,
        mobile_contact: contact,
        landline_contact: land_line,
        email: email
    };

    $.ajax({
        method: 'PUT',
        url: 'http://localhost:8081/api/v1/supplier',
        contentType: 'application/json',
        data: JSON.stringify(supplier),
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (data) {
            if (data) {

                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Supplier has been updated successfully",
                    showConfirmButton: false,
                    timer: 1500
                });


                loadAllSupplier();
                navigateToPage('#supplier-page')
                setSupplierCode();
                clearSupplierFields();
            } else {
                alert('Failed to update the supplier');
            }
        }
    });

});

/*delete supplier*/

$('#tbl-supplier').on('click', '.btn-sup-delete', function () {
    const supId = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();
    Swal.fire({
        title: "Are you sure you want to delete this Customer?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                method: 'DELETE',
                url: `http://localhost:8081/api/v1/supplier?supplier_code=${supId}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function (response) {
                    if (response === true) {
                        loadAllSupplier();
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your Customer has been deleted.",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: "Your Customer has not been deleted.",
                            icon: "error"
                        });
                    }
                }
            });
        }
    });
});

/*set supplier code*/

function setSupplierCode() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8081/api/v1/supplier/id',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (supplierCode) {
            console.log(supplierCode);
            $('#txt-sup-code').val(supplierCode);
        }
    });
}

/*clear supplier fields*/

function clearSupplierFields() {

    $('#txt-sup-code').val('');
    setSupplierCode();
    $('#txt-sup-name').val('');
    $('#txt-sup-category').val('');
    $('#txt-sup-building-no').val('');
    $('#txt-sup-lane').val('');
    $('#txt-sup-city').val('');
    $('#txt-sup-state').val('');
    $('#txt-sup-postal-code').val('');
    $('#txt-sup-country').val('');
    $('#txt-sup-contact').val('');
    $('#txt-sup-land-line').val('');
    $('#txt-sup-email').val('');
}

/*load all suppliers*/

function loadAllSupplier() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8081/api/v1/supplier/all',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (suppliers) {
            $('#tbl-supplier tbody tr').remove();
            for (let supplier of suppliers) {
                let row = ` <tr>
                                    <td>
                                        <label class="action_label">${supplier.supplier_code}</label>
                                    </td>
                                    <td>
                                        <label>${supplier.name}</label>
                                    </td>
                                    <td><label>${supplier.mobile_contact}</label></td>
                                    <td><label class="action_label2">${supplier.category}</label></td>
                                    <td><label>${supplier.country}</label></td>
                                    <td>
                                    <div class="action-label">
                                        <a class="btn btn-warning btn-sup-update"><img src="../assets/img/edit.png" alt="edit" style="width: 20px; height: 20px;"/></a>
                                        <a class="btn btn-danger btn-sup-delete"><img src="../assets/img/remove.png" alt="delete" style="width: 20px; height: 20px;"/></a>
                                    </div>
                                </td>
                                    
                                </tr>`
                $('#tbl-supplier tbody').append(row);
            }
        }
    });
}

function setSupplierCount() {
    $.ajax(
        {
            method: 'GET',
            url: 'http://localhost:8081/api/v1/supplier/count',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (counts) {
                $('#lbl-supplier-total').text(counts.supplierTotal);
                $('#lbl-supplier-local').text(counts.supplierLocalCount);
                $('#lbl-supplier-international').text(counts.supplierInternationalCount);
            }
        }
    );
}

function validateSupplier() {
    const showError = (message) => {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 1500
        });
    };

    let supplierCode = $('#txt-sup-code').val().trim();
    if (!supplierCode) {
        showError("Supplier code is missing");
        return false;
    }

    let name = $('#txt-sup-name').val().trim();
    if (!name) {
        showError("Supplier name is missing");
        return false;
    }

    // Other field validations...

    let contact = $('#txt-sup-contact').val().trim();
    if (!contact) {
        showError("Contact number is missing");
        return false;
    }
    if (!contactPattern.test(contact)) {
        showError("Contact number is invalid");
        return false;
    }

    let email = $('#txt-sup-email').val().trim();
    if (!email) {
        showError("Email is missing");
        return false;
    }
    if (!emailPattern.test(email)) {
        showError("Email is invalid");
        return false;
    }

    if ($('#txt-sup-country').val() === null || $('#txt-sup-country').val() === ""){
        showError("Please select a country");
        return false;
    }
    let level = $('#txt-sup-category').val().trim();
    if (level === null || level === ""){
        showError("Please select a category");
        return false;
    }

    return true;
}

function changeSupplierFiles(){

    $('#btn-sup-update').css('display', 'none');
    $('#btn-sup-save').css('display', 'block');
    clearSupplierFields();

}