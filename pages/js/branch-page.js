$('#btn-branch-update').css('display', 'none');

/*save branch*/

$('#btn-branch-save').click(function () {
    let code = $('#txt-branch-code').val();
    let name = $('#txt-branch-name').val();
    let manager = $('#txt-branch-manager').val();
    let emp = $('#txt-branch-emp').val();
    let address = $('#txt-branch-address').val();
    let contact = $('#txt-branch-contact').val();

    const branch = {
        branch_code: code,
        branch_name: name,
        branch_manager: manager,
        no_of_employee: emp,
        address: address,
        contact: contact
    };

    if(checkValidity(branch)){

        $.ajax({
            method: 'post',
            url: 'http://localhost:8081/api/v1/branch',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: JSON.stringify(branch),
            success: function () {
                alert('Branch has been saved successfully');
                clearBranchFields();
                loadAllBranches();
                setBranchCode();
            }
        });
    }

});


/*update branch*/

$('#tbl-branch').on('click', '.btn-branch-update', function () {
    const branch_code = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();

    $.ajax({
            method: 'GET',
            url: `http://localhost:8081/api/v1/branch?branch_code=${branch_code}`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (branch) {
                $('#txt-branch-code').val(branch.branch_code);
                $('#txt-branch-name').val(branch.branch_name);
                $('#txt-branch-manager').val(branch.branch_manager);
                $('#txt-branch-emp').val(branch.no_of_employee);
                $('#txt-branch-address').val(branch.address);
                $('#txt-branch-contact').val(branch.contact);
                $('#btn-branch-save').css('display', 'none');
                $('#btn-branch-update').css('display', 'block');
                navigateToPage('#branch-register-page');
            }
        }
    );
});

$('#btn-branch-update').click(function () {
    let code = $('#txt-branch-code').val();
    let name = $('#txt-branch-name').val();
    let manager = $('#txt-branch-manager').val();
    let emp = $('#txt-branch-emp').val();
    let address = $('#txt-branch-address').val();
    let contact = $('#txt-branch-contact').val();

    const branch = {
        branch_code: code,
        branch_name: name,
        branch_manager: manager,
        no_of_employee: emp,
        address: address,
        contact: contact
    };

    $.ajax({
        method: 'put',
        url: 'http://localhost:8081/api/v1/branch',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(branch),
        success: function () {
            alert('Branch has been updated successfully');
            clearBranchFields();
            loadAllBranches();
            setBranchCode();
            $('#btn-branch-save').css('display', 'block');
            $('#btn-branch-update').css('display', 'none');
            navigateToPage('#branch-page');
        }
    });
});



/*delete branch*/

$('#tbl-branch').on('click', '.btn-branch-delete', function () {
    const branch_code = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();
    Swal.fire({
        title: "Are you sure you want to delete this Branch?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            $.ajax({
                method: 'DELETE',
                url: `http://localhost:8081/api/v1/branch?branch_code=${branch_code}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function (response) {
                    if (response === true) {
                        loadAllBranches();1
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your Branch has been deleted.",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: "Your Branch has not been deleted.",
                            icon: "error"
                        });
                    }
                }
            });
        }
    });
});


/*clear branch fields*/

function clearBranchFields() {
    $('#txt-branch-code').val('');
    $('#txt-branch-name').val('');
    $('#txt-branch-manager').val('');
    $('#txt-branch-emp').val('');
    $('#txt-branch-address').val('');
    $('#txt-branch-contact').val('');
}

/*set branch code*/

function setBranchCode() {
    $.ajax({
        method: 'get',
        url: 'http://localhost:8081/api/v1/branch/id',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (branch_code) {
            $('#txt-branch-code').val(branch_code);
        }
    });
}


/*load all branches*/

function loadAllBranches() {
    $('#tbl-branch tbody tr').remove();
    $.ajax({
        method: 'get',
        url: 'http://localhost:8081/api/v1/branch/all',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (branches) {
            for (let branch of branches) {
                let row = `
                 <tr>
                            <td>
                                <label class="action_label">${branch.branch_code}</label>
                            </td>
                            <td>
                                <label>${branch.branch_name}</label>
                            </td>
                            <td>
                                <label>${branch.branch_manager}</label>
                            </td>
                            <td><label class="action_label2">${branch.no_of_employee}</label></td>
                            <td><label>${branch.contact}</label></td>
                            <td>
                            <div class="action-label">
                                        <a class="btn btn-warning btn-branch-update"><img src="../assets/img/edit.png"
                                                                                       alt="edit"
                                                                                       style="width: 20px; height: 20px;"/></a>
                                        <a class="btn btn-danger btn-branch-delete"><img src="../assets/img/remove.png"
                                                                                      alt="delete"
                                                                                      style="width: 20px; height: 20px;"/></a>
                                    </div>
                            
                            </td>
                        </tr>
                `;
                $('#tbl-branch tbody').append(row);
            }
        }
    });
}

function checkValidity(branch) {
    const showError = (message) => {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 1500
        });
    };

    if (branch.branch_code === '') {
        showError('Branch code is required');
        return;
    }
    if (branch.branch_name === '') {
        showError('Branch name is required');
        return;
    }
    if (branch.branch_manager === '') {
        showError('Branch manager is required');
        return;
    }
    if (branch.no_of_employee === '') {
        showError('Number of employees is required');
        return;
    }
    if (branch.address === '') {
        showError('Address is required');
        return;
    }
    if (branch.contact === '') {
        showError('Contact is required');
        return;
    }
    return true;
}