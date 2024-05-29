$('#btn-emp-update').css('display', 'none');
let employeeImageBase64 = ''; // Define a global variable to store the base64 string

/*save customer*/

$('#btn-register-employee').click(function () {


    $('#btn-emp-update').css('display', 'none');
    $('#btn-emp-save').css('display', 'block');
    $('#btn-emp-clear').click();
    setBranches();
    setEmployeeCode();
    setDesignations();

});


$('#btn-emp-save').click(function () {

    let profile_pic = employeeImageBase64;
    let name = $('#txt-emp-name').val();
    let gender = $('#txt-emp-gender').val();
    if (gender === 'MALE') {
        gender = 0;
    } else if (gender === 'FEMALE') {
        gender = 1;
    } else {
        gender = null;
    }
    let status = $('#txt-emp-status').val();
    let dob = $('#txt-emp-dob').val();
    let build_no = $('#txt-emp-build-no').val();
    let lane = $('#txt-emp-lane').val();
    let city = $('#txt-emp-city').val();
    let state = $('#txt-emp-state').val();
    let postal_code = $('#txt-emp-post-code').val();
    let contact = $('#txt-emp-contact').val();
    let emergency = $('#txt-emp-emergency').val();
    let guardian = $('#txt-emp-guardian').val();
    let email = $('#txt-emp-email').val();
    let code = $('#txt-emp-code').val();
    let designation = $('#txt-emp-designation').val();
    let branch = $('#txt-emp-branch').val();
    let join_date = $('#txt-emp-join-date').val();
    let role = $('#txt-emp-role').val();
    if (role === 'ADMIN') {
        role = 0;
    } else {
        role = 1;
    }


    let employeeDTO = {
        profile_pic: profile_pic,
        name: name,
        gender: gender,
        status: status,
        dob: dob,
        building_number: build_no,
        lane: lane,
        city: city,
        state: state,
        postal_code: postal_code,
        contact: contact,
        guardian_contact: emergency,
        guardian_name: guardian,
        email: email,
        employee_code: code,
        designation: designation,
        branch: {
            branch_code: branch
        },
        joined_date: join_date,
        role: role
    };

    let valid = checkValidity(employeeDTO);

    if (valid) {

        $.ajax({
            url: `http://localhost:8081/api/v1/employee`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            contentType: 'application/json',
            data: JSON.stringify(employeeDTO),
            success: function (response) {
                if (response === true) {
                    alert('Employee Added');
                    loadAllEmployees();
                    setBranches();
                    setEmployeeCode();
                    setDesignations();
                    $('#btn-emp-clear').click();
                } else {
                    alert('Employee Not Added');
                }
            }
        });
    }

})
;

/*edit customer*/

$('#tbl-employee').on('click', '.btn-emp-update', function () {

    setBranches();
    setDesignations();
    const empId = $(this).closest('tr').find('td:eq(0) .action_label').text().trim(); // Trim any extra spaces


    $.ajax({
        url: `http://localhost:8081/api/v1/employee?employee_code=${empId}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (employee) {

            $.ajax({
                url: `http://localhost:8081/api/v1/employee/branch?employee_code=${empId}`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function (branch) {
                    $('#txt-emp-branch').val(branch.branch_code);
                    console.log(branch);
                }
            })

            console.log(employee);

            if (employee.profile_pic === null || employee.profile_pic === '' || employee.profile_pic === undefined) {
                $('#emp-img-preview').attr('src', '../assets/img/no-image-img.jpg');
            } else {
                $('#emp-img-preview').attr('src', 'data:image/jpeg;base64,' + employee.profile_pic);
            }
            $('#txt-emp-name').val(employee.name);
            $('#txt-emp-gender').val(employee.gender);
            $('#txt-emp-status').val(employee.status);
            $('#txt-emp-dob').val(employee.dob);
            $('#txt-emp-build-no').val(employee.building_number);
            $('#txt-emp-lane').val(employee.lane);
            $('#txt-emp-city').val(employee.city);
            $('#txt-emp-state').val(employee.state);
            $('#txt-emp-post-code').val(employee.postal_code);
            $('#txt-emp-contact').val(employee.contact);
            $('#txt-emp-emergency').val(employee.guardian_contact);
            $('#txt-emp-guardian').val(employee.guardian_name);
            $('#txt-emp-email').val(employee.email);
            $('#txt-emp-code').val(employee.employee_code);
            $('#txt-emp-designation').val(employee.designation);
            $('#txt-emp-join-date').val(employee.joined_date);
            $('#txt-emp-role').val(employee.role);

            $('#btn-emp-save').css('display', 'none');
            $('#btn-emp-update').css('display', 'block');
            navigateToPage('#employee-register-page');


        }
    });

})

$('#btn-emp-update').click(function () {
    let profile_pic = employeeImageBase64;
    let name = $('#txt-emp-name').val();
    let gender = $('#txt-emp-gender').val();
    if (gender === 'MALE') {
        gender = 0;
    } else {
        gender = 1;
    }
    let status = $('#txt-emp-status').val();
    let dob = $('#txt-emp-dob').val();
    let build_no = $('#txt-emp-build-no').val();
    let lane = $('#txt-emp-lane').val();
    let city = $('#txt-emp-city').val();
    let state = $('#txt-emp-state').val();
    let postal_code = $('#txt-emp-post-code').val();
    let contact = $('#txt-emp-contact').val();
    let emergency = $('#txt-emp-emergency').val();
    let guardian = $('#txt-emp-guardian').val();
    let email = $('#txt-emp-email').val();
    let code = $('#txt-emp-code').val();
    let designation = $('#txt-emp-designation').val();
    let branch = $('#txt-emp-branch').val();
    let join_date = $('#txt-emp-join-date').val();
    let role = $('#txt-emp-role').val();
    if (role === 'ADMIN') {
        role = 0;
    } else {
        role = 1;
    }
    console.log(join_date);

    let employeeDTO = {
        profile_pic: profile_pic,
        name: name,
        gender: gender,
        status: status,
        dob: dob,
        building_number: build_no,
        lane: lane,
        city: city,
        state: state,
        postal_code: postal_code,
        contact: contact,
        guardian_contact: emergency,
        guardian_name: guardian,
        email: email,
        employee_code: code,
        designation: designation,
        branch: {
            branch_code: branch
        },
        joined_date: join_date,
        role: role
    };
    console.log(employeeDTO);
    $.ajax({
        url: `http://localhost:8080/api/v1/employee`,
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        contentType: 'application/json',
        data: JSON.stringify(employeeDTO),
        success: function (response) {
            if (response === true) {
                alert('Employee Update Successfully');
                navigateToPage('#employee-page');
                $('#btn-emp-clear').click();
            } else {
                alert('Employee Not Update');
            }
        }
    });

});

/*Delete employee*/

$('#tbl-employee').on('click', '.btn-emp-delete', function () {

    const empId = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();
    Swal.fire({
        title: "Are you sure you want to delete this Employee?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {


            $.ajax({
                url: `http://localhost:8081/api/v1/employee?employee_code=${empId}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function (response) {
                    if (response === true) {
                        loadAllEmployees();
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: "Your file has not been deleted.",
                            icon: "error"
                        });
                    }
                }
            });
        }
    });
});


/*clear customer*/
$('#btn-emp-clear').click(function () {
    $('#txt-emp-name').val('');
    $('#txt-emp-gender').val('');
    $('#txt-emp-status').val('');
    $('#txt-emp-dob').val('');
    $('#txt-emp-build-no').val('');
    $('#txt-emp-lane').val('');
    $('#txt-emp-city').val('');
    $('#txt-emp-state').val('');
    $('#txt-emp-post-code').val('');
    $('#txt-emp-contact').val('');
    $('#txt-emp-emergency').val('');
    $('#txt-emp-guardian').val('');
    $('#txt-emp-email').val('');
    $('#txt-emp-designation').val('');
    $('#txt-emp-branch').val('');
    $('#txt-emp-join-date').val('');
    $('#txt-emp-role').val('');
    $('#emp-img-preview').attr('src', '../assets/img/no-image-img.jpg');
});

/*set employee code*/
function setEmployeeCode() {
    $.ajax({
        url: `http://localhost:8081/api/v1/employee/id`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (employeeCode) {
            $('#txt-emp-code').val(employeeCode);
        }
    });
}

/*set branches*/
function setBranches() {

    $('#txt-emp-branch').empty();
    $('#txt-emp-branch').append(new Option('Select Branch', ''));

    $.ajax({
        url: `http://localhost:8081/api/v1/branch/all`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (branches) {
            if (branches.length === 0) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No Branches Found! Please Add Branches First!",
                });
            } else {
                for (let i = 0; i < branches.length; i++) {
                    $('#txt-emp-branch').append(new Option(branches[i].branch_name, branches[i].branch_code));
                }
            }
        }
    });
}

/*set designations*/

function setDesignations() {
    $('#txt-emp-designation').empty();
    $('#txt-emp-designation').append(new Option('Select Designation', ''));
    $.ajax({
        url: `http://localhost:8081/api/v1/employee/designations`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (designations) {

            console.log(designations);
            for (let i = 0; i < designations.length; i++) {
                $('#txt-emp-designation').append(new Option(designations[i], designations[i]));

            }
        }
    });
}

/*set Image*/


function empImgPreview(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#emp-img-preview').attr('src', e.target.result);
            employeeImageBase64 = e.target.result.split(',')[1]; // Store the base64 string
        }
        reader.readAsDataURL(input.files[0]);
    } else {
        $('#emp-img-preview').attr('src', '../assets/img/no-image-img.jpg');
        employeeImageBase64 = ''; // Reset the base64 string if no image selected
    }
}

/*get all employee details*/
function loadAllEmployees() {
    $('#tbl-employee tbody tr').remove();
    $.ajax({
        url: `http://localhost:8081/api/v1/employee/all`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (employees) {

            console.log(employees);

            for (let i = 0; i < employees.length; i++) {
                let employee = employees[i];

                console.log(employee);
                (function (employee) { // Using a closure to maintain scope
                    $.ajax({
                        url: `http://localhost:8081/api/v1/employee/branch?employee_code=${employee.employee_code}`,
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        success: function (branch) {
                            let branch_name = branch.branch_name;
                            let row = `<tr>
                                <td>
                                    <label class="action_label">${employee.employee_code}</label>
                                </td>
                                <td>
                                    <label>${employee.name}</label>
                                </td>
                                <td>
                                    <label>${employee.designation}</label>
                                </td>
                                <td>
                                    <label>${employee.contact}</label>
                                </td>
                                <td>
                                    <label class="action_label">${branch_name}</label>
                                </td>
                                <td>
                                    <label>${employee.role}</label>
                                </td>
                                <td>
                                    <div class="action-label">
                                        <a class="btn btn-warning btn-emp-update"><img src="../assets/img/edit.png" alt="edit" style="width: 20px; height: 20px;"/></a>
                                        <a class="btn btn-danger btn-emp-delete"><img src="../assets/img/remove.png" alt="delete" style="width: 20px; height: 20px;"/></a>
                                    </div>
                                </td>
                            </tr>`;
                            $('#tbl-employee tbody').append(row);
                        }
                    });
                })(employee);
            }
        }
    });
}

function clearEmployeeFields() {
    $('#btn-emp-clear').click();
}


function setEmployeeCounts() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8081/api/v1/employee/count',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (count) {
            console.log(count);
            $('#total-employees').text(count.totalEmployeeCount);
            $('#total-admins').text(count.totalAdminEmployeeCount);
            $('#total-users').text(count.totalUserEmployeeCount);
        }
    });
}

function checkValidity(data) {
    const showError = (message) => {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 1500
        });
    };

    // Define regex patterns for specific validations
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactPattern = /^\d{10}$/;
    const currentDate = new Date();
    const dobDate = new Date(data.dob);
    const joinDate = new Date(data.joined_date);

    if (!data.name) {
        showError("Employee name is missing");
        return false;
    }
    if (!(data.gender === 0 || data.gender === 1)) {
        showError("Gender is missing");
        return false;
    }

    /*   if (!(data.gender.value ==="MALE" || data.gender.value === "FEMALE")){
           showError("Gender is missing");
           return false;
       }*/
    if (!data.status) {
        showError("Employee status is missing");
        return false;
    }

    if (!data.dob) {
        showError("Date of birth is missing");
        return false;
    } else if (dobDate >= currentDate) {
        showError("Date of birth cannot be in the future");
        return false;
    }

    if (!data.joined_date) {
        showError("Joining date is missing");
        return false;
    } else if (joinDate > currentDate) {
        showError("Joining date cannot be in the future");
        return false;
    }

    if (!data.contact) {
        showError("Contact number is missing");
        return false;
    } else if (!contactPattern.test(data.contact)) {
        showError("Contact number is invalid");
        return false;
    }

    if (!data.email) {
        showError("Email is missing");
        return false;
    } else if (!emailPattern.test(data.email)) {
        showError("Email is invalid");
        return false;
    }

    if (!data.building_number) {
        showError("Building number is missing");
        return false;
    }

    if (!data.lane) {
        showError("Lane is missing");
        return false;
    }

    if (!data.city) {
        showError("City is missing");
        return false;
    }


    if (!data.branch.branch_code) {
        showError("Branch is missing");
        return false;
    }


    if (!data.designation) {
        showError("Designation is missing");
        return false;
    }

    // Add more field validations as needed

    return true;
}