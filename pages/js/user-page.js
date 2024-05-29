notSetAddUserFields();
$('#txt-user-emp-id').on('keypress', function (event) {
    if (event.key === "Enter") {

        var empId = $('#txt-user-emp-id').val();
        var empExists = false;
        $('#tbl-users tbody tr').each(function () {
            var existingEmpId = $(this).find('td:eq(2)').text();
            if (existingEmpId === empId) {
                empExists = true;
                return false; // Break out of the loop
            }
        });

        if (!empExists) {

            $.ajax({
                url: `http://localhost:8081/api/v1/employee?employee_code=${empId}`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function (employee) {
                    console.log(employee);
                    if (employee == null || employee === "" || employee === undefined) {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Employee ID is invalid",
                        });
                    } else {

                        $.ajax({
                            url: `http://localhost:8081/api/v1/employee/branch?employee_code=${employee.employee_code}`,
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                            success: function (branch) {


                                $('#lbl-user-emp-name').text(employee.name);
                                $('#lbl-user-emp-designation').text(employee.designation);

                                $('#lbl-user-emp-branch').text(branch.branch_name);

                                /*STOCK_KEEPER, DELIVERY, CLEANER, SECURITY_GUARD*/
                                if (employee.designation === "STOCK_KEEPER" || employee.designation === "DELIVERY" || employee.designation === "CLEANER" || employee.designation === "SECURITY_GUARD") {

                                    Swal.fire({
                                        icon: "error",
                                        title: "Oops...",
                                        text: "This Employee is not allowed to create a user account",
                                    });


                                    notSetAddUserFields();

                                } else {
                                    setAddUserFields();
                                }


                            }
                        });

                    }
                }, error: function (xhr) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Employee ID is invalid",
                    });

                    notSetAddUserFields();
                }
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "User already exists",
            });

            notSetAddUserFields();
        }

    }
});

function setAddUserFields() {
    $('#txt-user-name').removeAttr('disabled');
    $('#txt-user-password').removeAttr('disabled');
    $('#txt-user-role').removeAttr('disabled');

    $('#txt-user-name').val('');
    $('#txt-user-password').text('');


}

function notSetAddUserFields() {
    $('#txt-user-name').val('');
    $('#txt-user-password').text('');


    $('#txt-user-name').attr('disabled', true);
    $('#txt-user-password').attr('disabled', true);
    $('#txt-user-role').attr('disabled', true);

}

$('#btn-user-add').click(function () {
    var empId = $('#txt-user-emp-id').val();
    var name = $('#txt-user-name').val();
    var password = $('#txt-user-password').val();
    var role = $('#txt-user-role').val();

    if (name === "" || password === "" || role === "") {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill all fields",
        });
    } else {

        if ($('#txt-user-name').css('border-color') === 'rgb(255, 0, 0)') {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "User name already exists",
            });
            return;
        }
        /*      {
                  "email": "irosh@gmail.com",
                  "password": "1234",
                  "role": "USER",
                  "employee_code": "E001"
              }*/
        let signUp = {
            "email": name,
            "password": password,
            "role": role,
            "employee_code": empId
        };

        console.log(signUp);


        $.ajax({
            url: `http://localhost:8081/api/v1/user/signup`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(signUp),
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "User created successfully",
                });

                notSetAddUserFields();
                loadAllUsers();

            }, error: function (xhr) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "User creation failed",
                });
            }
        });
    }

});

function loadAllUsers() {
    $.ajax({
        url: `http://localhost:8081/api/v1/user/all`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (users) {

            console.log(users);

            $('#tbl-users tbody tr').remove();
            users.forEach(function (user) {
                var row = `<tr>
                                    <td>${user.email}</td>
                                    <td>${user.role}</td>
                                    <td>${user.employee_code}</td>
                                    <td>
                                    <div class="action-label">
                                        <a class="btn btn-danger btn-user-delete"><img src="../assets/img/remove.png" alt="delete" style="width: 20px; height: 20px;"/></a>
                                    </div>
                                </td>
                                   </tr>`;
                $('#tbl-users tbody').append(row);
            });
        }
    });
}


$('#txt-user-name').on('input', function () {
    let name = $('#txt-user-name').val();

    var emailExists = false;
    $('#tbl-users tbody tr').each(function () {
        var existingEmail = $(this).find('td:eq(0)').text();
        if (existingEmail === name) {
            emailExists = true;
            return false; // Break out of the loop
        }
    });

    if (emailExists) {
        $('#txt-user-name').css('border-color', 'red');
    } else {
        $('#txt-user-name').css('border-color', '');
    }
});


$('#tbl-users tbody').on('click', 'tr td .btn-user-delete', function () {
    let email = $(this).parents('tr').find('td:first-child').text();
    console.log(email);

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {

            console.log(email);

            $.ajax({
                url: `http://localhost:8081/api/v1/user?email=${email}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function (response) {
                    Swal.fire(
                        'Deleted!',
                        'User has been deleted.',
                        'success'
                    );
                    loadAllUsers();
                }, error: function (xhr) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "User deletion failed",
                    });
                }
            });
        }
    });
});
