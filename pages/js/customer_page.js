$('#btn-cust-update').css('display', 'none');// Define a global variable to store the base64 string


/*save customer*/
$('#btn-cust-save').click(function () {
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