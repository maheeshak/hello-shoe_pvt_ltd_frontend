
/*const token = localStorage.getItem('token');
let role = localStorage.getItem('role');
let username = localStorage.getItem('username');*/

const token = getCookie('token');
let role = getCookie('role');
let username = getCookie('username');


$('#lbl-user-name').text(username);

handlePageFumctionsUsers();

if (!token) {
    window.location.href = '../index.html';

}

navigateToPage('#dashboard-page');
navBarActive('#btn-dashboard');


$('#btn-pos').click(function () {
    $('#app-content').css('display', 'none');
    $('#pos-content').css('display', 'block');
    hideOtherPages();
    /*change page title*/
    $('#page-title').text('Hello Shoe POS System');
    setOrderID();

})
$('#btn-app').click(function () {
    $('#app-content').css('display', 'block');
    $('#pos-content').css('display', 'none');

    /*change page title*/
    $('#page-title').text('Hello Shoe Management');

    navBarActive('#btn-dashboard');
    navigateToPage('#dashboard-page');
})
$('#btn-dashboard').click(function () {
    navBarActive('#btn-dashboard');
    navigateToPage('#dashboard-page');
})


$('#btn-employee').click(function () {
    console.log('Role', role);
    navBarActive('#btn-employee');
    navigateToPage('#employee-page');
});

$('#btn-register-employee').click(function () {

    navBarActive('#btn-employee');
    navigateToPage('#employee-register-page');
});

$('#btn-emp-home').click(function () {

    navBarActive('#btn-employee');
    navigateToPage('#employee-page');
});

$('#btn-customer').click(function () {
    loadAllCustomers();
    setCustomerCode();
    setCustomerCount();
    navBarActive('#btn-customer');
    navigateToPage('#customer-page');
});

$('#btn-register-customer').click(function () {
    clearCustomerFields()
    navBarActive('#btn-customer');
    navigateToPage('#customer-register-page');

});

$('#btn-cust-home').click(function () {
    loadAllCustomers();
    setCustomerCode();
    setCustomerCount();
    navBarActive('#btn-customer');
    navigateToPage('#customer-page');
});


$('#btn-supplier').click(function () {
    loadAllSupplier();
    setSupplierCode();
    setSupplierCount();

    navBarActive('#btn-supplier');
    navigateToPage('#supplier-page');

});

$('#btn-register-supplier').click(function () {
    clearSupplierFields()
    navBarActive('#btn-supplier');
    navigateToPage('#supplier-register-page');

});

$('#btn-sup-home').click(function () {
    loadAllSupplier();
    setSupplierCode();
    setSupplierCount();
    navBarActive('#btn-supplier');
    navigateToPage('#supplier-page');
});
$('#btn-inventory').click(function () {
    setSizeCodes();
    setInventoryCount();
    loadAllInventories();
    navBarActive('#btn-inventory');
    navigateToPage('#inventory-page');
});

$('#btn-add-inventory').click(function () {
    clearInventoryFields();
    changeInputFieldsRegister();
    navBarActive('#btn-inventory');
    navigateToPage('#inventory-register-page');
});


$('#btn-inventory-home').click(function () {
    setSizeCodes();
    loadAllInventories();
    setInventoryCount();
    navBarActive('#btn-inventory');
    navigateToPage('#inventory-page');

});

$('#btn-size').click(function () {
    navBarActive('#btn-size');
    navigateToPage('#size-page');

});

$('#btn-add-size').click(function () {
    clearSizeFields();
    navBarActive('#btn-size');
    navigateToPage('#size-register-page');

})

$('#btn-size-home').click(function () {
    navBarActive('#btn-size');
    navigateToPage('#size-page');

});


$('#btn-add-branch').click(function () {
    clearBranchFields();
    setBranchCode();
    navBarActive('#btn-branch');
    navigateToPage('#branch-register-page');
});

$('#btn-branch').click(function () {

    loadAllBranches();
    setBranchCode();
    navBarActive('#btn-branch');
    navigateToPage('#branch-page');
});

$('#btn-branch-home').click(function () {
    loadAllBranches();
    navBarActive('#btn-branch');
    navigateToPage('#branch-page');

});

$('#btn-return').click(function () {
    navBarActive('#btn-return');
    navigateToPage('#return-page');
});

$('#btn-report').click(function () {
    getEmpDesigCounts();
    getBranchSalesDetails();
    getTotalEmpBranch();
    getTotalESalesBranchThisMonth();
    setTopSaleInventoryThisMonth();
    setTopSaleInventoryThisYear();

    navBarActive('#btn-report');
    navigateToPage('#report-page');

});

function navigateToPage(page) {
    $('#dashboard-page').css('display', 'none');
    $('#employee-page').css('display', 'none');
    $('#employee-register-page').css('display', 'none');
    $('#customer-page').css('display', 'none');
    $('#customer-register-page').css('display', 'none');
    $('#supplier-register-page').css('display', 'none');
    $('#supplier-page').css('display', 'none');
    $('#inventory-page').css('display', 'none');
    $('#inventory-register-page').css('display', 'none');
    $('#size-page').css('display', 'none');
    $('#size-register-page').css('display', 'none');
    $('#branch-register-page').css('display', 'none');
    $('#branch-page').css('display', 'none');
    $('#return-page').css('display', 'none');
    $('#report-page').css('display', 'none');


    if (page === '#supplier-page') {
        loadAllSupplier();

    }
    if (page === '#employee-page') {
        loadAllEmployees();
        setEmployeeCounts();
    }
    if (page === '#customer-page') {
        loadAllCustomers();
    }
    if (page === '#size-page') {
        loadAllSizes();
    }


    $(page).css('display', 'block');
}

function navBarActive(page) {
    $('#btn-dashboard').parent().removeClass('active');
    $('#btn-employee').parent().removeClass('active');
    $('#btn-customer').parent().removeClass('active');
    $('#btn-supplier').parent().removeClass('active');
    $('#btn-inventory').parent().removeClass('active');
    $('#btn-size').parent().removeClass('active');
    $('#btn-branch').parent().removeClass('active');
    $('#btn-return').parent().removeClass('active');
    $('#btn-report').parent().removeClass('active');


    $(page).parent().addClass('active');
}

$('#btn-logout').click(function () {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh-token');
    window.location.href = '../index.html';
});

function handlePageFumctionsUsers() {
    if (role === 'ADMIN') {
        $('#btn-employee').css('display', 'block');
        $('#btn-customer').css('display', 'block');
        $('#btn-supplier').css('display', 'block');
        $('#btn-inventory').css('display', 'block');
        $('#btn-size').css('display', 'block');
        $('#btn-branch').css('display', 'block');
        $('#btn-return').css('display', 'block');
    } else {
        $('#btn-employee').css('display', 'none');
        $('#btn-supplier').css('display', 'none');
        $('#btn-branch').css('display', 'none');
        $('#btn-report').css('display', 'none');
    }
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

function hideOtherPages() {
    $('#dashboard-page').css('display', 'none');
    $('#employee-page').css('display', 'none');
    $('#employee-register-page').css('display', 'none');
    $('#customer-page').css('display', 'none');
    $('#customer-register-page').css('display', 'none');
    $('#supplier-register-page').css('display', 'none');
    $('#supplier-page').css('display', 'none');
    $('#inventory-page').css('display', 'none');
    $('#inventory-register-page').css('display', 'none');
    $('#size-page').css('display', 'none');
    $('#size-register-page').css('display', 'none');
    $('#branch-register-page').css('display', 'none');
    $('#branch-page').css('display', 'none');
    $('#return-page').css('display', 'none');
    $('#report-page').css('display', 'none');
}