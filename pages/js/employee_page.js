$('#btn-emp-save').click(function () {
    let name = $('#txt-emp-name').val();
    let gender = $('#txt-emp-gender').val();
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

    let employee = {
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
        branch: branch,
        join_date: join_date,
        role: role
    };
    console.log(employee);


});