$('#btn-cust-update').css('display', 'none');// Define a global variable to store the base64 string


/*save customer*/
$('#btn-cust-save').click(function () {


    if (!validateCustomer()) {
        return;
    }


    let name = $('#txt-cust-name').val();
    let gender = $('#txt-cust-gender').val();
    if (gender === 'MALE') {
        gender = 0;
    } else {
        gender = 1;
    }
    let dob = $('#txt-cust-dob').val();
    let build_no = $('#txt-cust-build-no').val();
    let lane = $('#txt-cust-lane').val();
    let city = $('#txt-cust-city').val();
    let sate = $('#txt-cust-state').val();
    let postal_code = $('#txt-cust-post-code').val();
    let contact = $('#txt-cust-contact').val();
    let email = $('#txt-cust-email').val();
    let cust_code = $('#txt-cust-code').val();
    let level = $('#txt-cust-level').val();
    let reg_date = $('#txt-cust-reg-date').val();

    const customer = {
        name: name,
        gender: gender,
        dob: dob,
        building_number: build_no,
        lane: lane,
        city: city,
        state: sate,
        postal_code: postal_code,
        contact: contact,
        email: email,
        customer_code: cust_code,
        level: level,
        date: reg_date
    };

    $.ajax({
        method: 'POST',
        url: 'http://localhost:8081/api/v1/customer',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(customer),
        contentType: 'application/json',
        success: function (response) {
            alert('Customer has been saved successfully');
            loadAllCustomers();
            clerCustomerFields();
        }
    })


});


/*update customer*/

$('#tbl-customer').on('click', '.btn-cust-update', function () {
    const custId = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();

    $.ajax({
        method: 'GET',
        url: `http://localhost:8081/api/v1/customer?customer_code=${custId}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (customer) {
            $('#txt-cust-code').val(customer.customer_code);
            $('#txt-cust-gender').val(customer.gender);
            $('#txt-cust-name').val(customer.name);
            $('#txt-cust-dob').val(customer.dob);
            $('#txt-cust-build-no').val(customer.building_number);
            $('#txt-cust-lane').val(customer.lane);
            $('#txt-cust-city').val(customer.city);
            $('#txt-cust-state').val(customer.state);
            $('#txt-cust-post-code').val(customer.postal_code);
            $('#txt-cust-contact').val(customer.contact);
            $('#txt-cust-email').val(customer.email);
            $('#txt-cust-level').val(customer.level);
            $('#txt-cust-reg-date').val(customer.date);
            $('#btn-cust-save').css('display', 'none');
            $('#btn-cust-update').css('display', 'block');
            navigateToPage('#customer-register-page');
        }
    });
});

$('#btn-cust-update').click(function () {

    if (!validateCustomer()) {
        return;
    }

    let name = $('#txt-cust-name').val();
    let gender = $('#txt-cust-gender').val();
    if (gender === 'MALE') {
        gender = 0;
    } else {
        gender = 1;
    }
    let dob = $('#txt-cust-dob').val();
    let build_no = $('#txt-cust-build-no').val();
    let lane = $('#txt-cust-lane').val();
    let city = $('#txt-cust-city').val();
    let sate = $('#txt-cust-state').val();
    let postal_code = $('#txt-cust-post-code').val();
    let contact = $('#txt-cust-contact').val();
    let email = $('#txt-cust-email').val();
    let cust_code = $('#txt-cust-code').val();
    let level = $('#txt-cust-level').val();
    let reg_date = $('#txt-cust-reg-date').val();

    const customer = {
        name: name,
        gender: gender,
        dob: dob,
        building_number: build_no,
        lane: lane,
        city: city,
        state: sate,
        postal_code: postal_code,
        contact: contact,
        email: email,
        customer_code: cust_code,
        level: level,
        date: reg_date
    };

    console.log(customer);

    $.ajax({
        method: 'PUT',
        url: 'http://localhost:8081/api/v1/customer',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(customer),
        contentType: 'application/json',
        success: function (response) {
            alert('Customer has been update successfully');
            // loadAllCustomers();


            loadAllCustomers();
            navigateToPage('#customer-page');
            setCustomerCode();
            clerCustomerFields();

        }
    })
});

/*delete customer*/

$('#tbl-customer').on('click', '.btn-cust-delete', function () {
    const custId = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();
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
                url: `http://localhost:8081/api/v1/customer?customer_code=${custId}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function (response) {
                    if (response === true) {
                        loadAllCustomers();
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


/*clear customer fields*/

function clerCustomerFields() {
    $('#txt-cust-name').val('');
    $('#txt-cust-dob').val('');
    $('#txt-cust-build-no').val('');
    $('#txt-cust-lane').val('');
    $('#txt-cust-city').val('');
    $('#txt-cust-state').val('');
    $('#txt-cust-post-code').val('');
    $('#txt-cust-contact').val('');
    $('#txt-cust-email').val('');
    $('#txt-cust-level').val('');
    $('#txt-cust-reg-date').val('');
    $('#txt-cust-gender').val('');
    setCustomerCode();
}


/*Set customer code*/

function setCustomerCode() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8081/api/v1/customer/id',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (customerCode) {
            $('#txt-cust-code').val(customerCode);
        }
    });
}


/*load all customers*/

function loadAllCustomers() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8081/api/v1/customer/all',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (customers) {
            $('#tbl-customer tbody tr').remove();
            for (let customer of customers) {
                let row = `
                <tr>
                                <td>
                                    <label class="action_label">${customer.customer_code}</label>
                                </td>
                                <td>
                                    <label>${customer.name}</label>
                                </td>
                                <td>
                                    <label class="action_label2">${customer.level}</label>
                                </td>
                                <td>
                                    <label>${customer.contact}</label>
                                </td>
                                <td>
                                    <label>${customer.email}</label>
                                </td>

                                <td>
                                    <div class="action-label">
                                        <a class="btn btn-warning btn-cust-update"><img src="../assets/img/edit.png"
                                                                                       alt="edit"
                                                                                       style="width: 20px; height: 20px;"/></a>
                                        <a class="btn btn-danger btn-cust-delete"><img src="../assets/img/remove.png"
                                                                                      alt="delete"
                                                                                      style="width: 20px; height: 20px;"/></a>
                                    </div>
                                </td>

                            </tr>
                
                `;
                $('#tbl-customer tbody').append(row);
            }
        }
    });
}

function clearCustomerFields() {
    $('#btn-cust-clear').click();
}

function setCustomerCount(){

    $.ajax({
        method: 'GET',
        url: 'http://localhost:8081/api/v1/customer/count',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (customerCount) {
            $('#lbl-cust-count').text(customerCount);
        }
    })
}

function validateCustomer() { //sweetalert
    const showError = (message) => {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 1500
        });
    };

    let name = $('#txt-cust-name').val().trim();
    if (!name) {
        showError("Customer name is missing");
        return false;
    }

    let gender = $('#txt-cust-gender').val();
    if (!gender || (gender !== 'MALE' && gender !== 'FEMALE')) {
        showError("Customer gender is invalid");
        return false;
    }

    let dob = $('#txt-cust-dob').val().trim();
    if (!dob) {
        showError("Customer date of birth is missing");
        return false;
    }
    if (new Date(dob) >= new Date()) {
        showError("Customer date of birth should be in the past");
        return false;
    }

    let build_no = $('#txt-cust-build-no').val().trim();
    if (!build_no) {
        showError("Building number is missing");
        return false;
    }

    let lane = $('#txt-cust-lane').val().trim();
    if (!lane) {
        showError("Lane is missing");
        return false;
    }

    let city = $('#txt-cust-city').val().trim();
    if (!city) {
        showError("City is missing");
        return false;
    }

    let state = $('#txt-cust-state').val().trim();
    if (!state) {
        showError("State is missing");
        return false;
    }

    let postal_code = $('#txt-cust-post-code').val().trim();
    if (!postal_code) {
        showError("Postal code is missing");
        return false;
    }

    let contact = $('#txt-cust-contact').val().trim();
    const contactPattern = /^[0-9]{10}$/; // Adjust the pattern based on the contact number format
    if (!contact) {
        showError("Contact number is missing");
        return false;
    }
    if (!contactPattern.test(contact)) {
        showError("Contact number is invalid");
        return false;
    }

    let email = $('#txt-cust-email').val().trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showError("Email is missing");
        return false;
    }
    if (!emailPattern.test(email)) {
        showError("Email is invalid");
        return false;
    }

    let cust_code = $('#txt-cust-code').val().trim();
    if (!cust_code) {
        showError("Customer code is missing");
        return false;
    }

    let level = $('#txt-cust-level').val().trim();
    if (!level) {
        showError("Customer level is missing");
        return false;
    }

    let reg_date = $('#txt-cust-reg-date').val().trim();
    if (!reg_date) {
        showError("Registration date is missing");
        return false;
    }
    if (new Date(reg_date) > new Date()) {
        showError("Registration date cannot be in the future");
        return false;
    }

    return true;
}