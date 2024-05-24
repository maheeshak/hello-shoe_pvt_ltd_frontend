$('#btn-user-login').click(function (event) {
    event.preventDefault();  // Pass the event object to the function and prevent the default form submission

    let username = $('#txt-user-email').val();
    let password = $('#txt-user-password').val();

    const user = {
        email: username,
        password: password
    };

    $.ajax({
        method: 'POST',
        url: 'http://localhost:8081/api/v1/user/signin',
        contentType: 'application/json',
        data: JSON.stringify(user),
        success: function (token) {
            if (!token || token === '') {
                alert('Invalid username or password');
                return;
            }
            const tokens = token.token.split(" : ");
            const token1 = tokens[0].trim();
            const token2 = tokens[1].trim();


            /*localStorage.removeItem('token');
            localStorage.removeItem('refresh-token');*/

            /*   localStorage.setItem('token', token1);
               localStorage.setItem('refresh-token', token2);*/

            /*set cookies token*/



            document.cookie = "token=" + token1 + "; path=/";


            $.ajax({
                method: 'GET',
                url: 'http://localhost:8081/api/v1/user/role?email=' + username,
                success: function (role) {


                    /*   localStorage.removeItem('role');
                       localStorage.removeItem('username');
                       localStorage.setItem('username', username);
                       localStorage.setItem('role', role);*/

                    /*set cookies role and username*/
                    document.cookie = "role=" + role + "; path=/";
                    document.cookie = "username=" + username + "; path=/";
                    window.location.href = 'pages/dashboard_page.html';
                }
            });


        },
        error: function (error) {
            alert('Invalid username or password');
        }
    });
});
