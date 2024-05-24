const sizeCodePattern = /^SIZE([1-9]|[1-9][0-9]|100)$/;
loadAllSizes();
// Hide the update button initially
$('#btn-size-update').hide();

// Handle click event for save button
$('#btn-size-save').click(function () {
    $('#btn-size-update').hide();
    $('#btn-size-save').show();

    const sizeCode = $('#txt-size-code').val();
    const sizeName = $('#txt-size').val();

    // Check if the size code matches the pattern
    if (!sizeCodePattern.test(sizeCode)) {
        $('#txt-size-code').focus().css('border-color', 'red');
        return;
    }

    // Make AJAX call to save the size
    const size = {
        size_code: sizeCode,
        size: sizeName,
    };

    $.ajax({
        method: 'POST',
        url: 'http://localhost:8081/api/v1/size',
        contentType: 'application/json',
        data: JSON.stringify(size),
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function () {
            alert('Size has been saved successfully')
            loadAllSizes();
            clearSizeFields();
        }
    });
});

// Handle keypress event for size code input
$('#txt-size-code').on('keypress', function (event) {
    if (event.key === "Enter") {
        const sizeCodeValue = $(this).val();

        // Check if the size code matches the pattern
        if (!sizeCodePattern.test(sizeCodeValue)) {
            $(this).css('border-color', 'red');
            $('#txt-size').val('').focus();
            return;
        } else {
            $(this).css('border-color', 'green');
        }

        // Extract integer value from size code and set it to size input
        const sizeNumber = parseInt(sizeCodeValue.slice(4), 10);
        $('#txt-size').val(sizeNumber).focus();
    }
});

/*delete size */
$('#tbl-size tbody').on('click', '.btn-size-delete', function () {
    const size_code = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();
    Swal.fire({
        title: "Are you sure you want to delete this Size?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            $.ajax({
                method: 'DELETE',
                url: `http://localhost:8081/api/v1/size?size_code=${size_code}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function (response) {
                    if (response === true) {
                        loadAllSizes();
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your Size has been deleted.",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: "Your Size has not been deleted.",
                            icon: "error"
                        });
                    }
                }
            });
        }
    });

});





$('#btn-size-clear').click(function () {
    clearSizeFields();
});

/*clear size fields*/
function clearSizeFields() {
    $('#txt-size-code').val('');
    $('#txt-size').val('');
}

/*load all size*/
function loadAllSizes() {

    $('#tbl-size tbody tr').remove();

    $.ajax({
        method: 'GET',
        url: 'http://localhost:8081/api/v1/size/all',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (sizes) {
            $('#tbl-size tbody tr').remove();
            for (let size of sizes) {
                console.log(size);
                let row = `<tr>
                                     <td>
                                    <label class="action_label">${size.size_code}</label>
                                </td>
                                <td>
                                    <label>${size.size}</label>
                                </td>
                                <td>
                                    <div class="action-label">
                                        <a class="btn btn-danger btn-size-delete"><img src="../assets/img/remove.png" alt="delete" style="width: 20px; height: 20px;"/></a>
                                    </div>
                                </td>
                                </tr>
                
                `;
                $('#tbl-size tbody').append(row);
            }
        }
    });
}

