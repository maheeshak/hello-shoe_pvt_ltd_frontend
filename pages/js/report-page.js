/*Sales Report - Branch*/

let allBranches = [];
let saleTotals = [];
let totalSaleThisMonthBranches = [];
let totalSaleThisMonthValues = [];

function setTopSaleInventoryThisMonth() {
    $.ajax({
        url: `http://localhost:8081/api/v1/sale/totalSalesInventoryThis`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (inventory) {

            let item_pic = '';
            let desc = inventory.description;
            let total = inventory.total_sale;
            let branch = inventory.branch;

            if (inventory.inventory_pic === null || inventory.inventory_pic === '' || inventory.inventory_pic === undefined) {
                item_pic = '../assets/img/sample-shoe.png';
            } else {
                // Set the base64 image
                item_pic = `data:image/png;base64,${inventory.inventory_pic}`;
            }

            $('#top-sale-month-card').html(`
            <div class="row justify-content-center">
                                            <div class="card p-5" style="width: 100%; max-width: 600px;">
                                                <div class="d-flex justify-content-center">
                                                    <img class="card-img-top" src=${item_pic} alt="Card image cap" style="width: 50%;">
                                                </div>
                                                <div class="card-body">
                                                    <h4 class="mb-3 text-danger">${desc}</h4>
                                                    <h5>Total Sales: Rs. ${total}</h5>
                                                    <h5>Most Sale Branch: ${branch}</h5>
                                                </div>
                                            </div>
                                        </div>
            `);


        }
    });
}function setTopSaleInventoryThisYear() {
    $.ajax({
        url: `http://localhost:8081/api/v1/sale/totalSalesInventoryThisYear`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (inventory) {

            let item_pic = '';
            let desc = inventory.description;
            let total = inventory.total_sale;
            let branch = inventory.branch;

            if (inventory.inventory_pic === null || inventory.inventory_pic === '' || inventory.inventory_pic === undefined) {
                item_pic = '../assets/img/sample-shoe.png';
            } else {
                // Set the base64 image
                item_pic = `data:image/png;base64,${inventory.inventory_pic}`;
            }

            $('#top-sale-year-card').html(`
            <div class="row justify-content-center">
                                            <div class="card p-5" style="width: 100%; max-width: 600px;">
                                                <div class="d-flex justify-content-center">
                                                    <img class="card-img-top" src=${item_pic} alt="Card image cap" style="width: 50%;">
                                                </div>
                                                <div class="card-body">
                                                    <h4 class="mb-3 text-success">${desc}</h4>
                                                    <h5>Total Sales: Rs. ${total}</h5>
                                                    <h5>Most Sale Branch: ${branch}</h5>
                                                </div>
                                            </div>
                                        </div>
            `);


        }
    });
}


function getTotalESalesBranchThisMonth() {

    totalSaleThisMonthBranches = [];
    totalSaleThisMonthValues = [];

    $.ajax({
        url: `http://localhost:8081/api/v1/sale/totalSalesBranchesThis`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (details) {
            console.log(details);
            for (let i = 0; i < details.length; i++) {
                if (i % 2 == 0) {
                    totalSaleThisMonthBranches.push(details[i]);
                } else {
                    totalSaleThisMonthValues.push(details[i]);
                }
            }

            totalSaleBranchThisMonth();

        }
    });

}
var chart01;
function totalSaleBranchThisMonth() {
    var columnCtx = document.getElementById("total-sales-this-branch-chart");

    if (chart01) {
        chart01.destroy();
    }
    var columnConfig = {
        colors: ['#1ec1b0'],
        series: [{
            name: "Sales",
            type: "column",
            data: totalSaleThisMonthValues
        }],
        chart: {
            type: 'bar',
            fontFamily: 'Poppins, sans-serif',
            height: 350,
            toolbar: {show: false}
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '10%',
                endingShape: 'rounded'
            }
        },
        dataLabels: {enabled: false},
        stroke: {show: true, width: 2, colors: ['transparent']},
        xaxis: {categories: totalSaleThisMonthBranches},
        yaxis: {title: {text: 'Rs.'}},
        fill: {opacity: 1},
        tooltip: {
            y: {
                formatter: function (val) {
                    return "Rs" + val;
                }
            }
        }
    };

    chart01 = new ApexCharts(columnCtx, columnConfig);
    chart01.render();
}


function getBranchSalesDetails() {

    allBranches = [];
    saleTotals = [];

    $.ajax({
        url: `http://localhost:8081/api/v1/sale/totalSalesBranches`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (details) {
            console.log(details);
            for (let i = 0; i < details.length; i++) {
                if (i % 2 == 0) {
                    allBranches.push(details[i]);
                } else {
                    saleTotals.push(details[i]);
                }
            }

            totalSales();


        }
    });
}

var chart02;
function totalSales() {
    var columnCtx = document.getElementById("total-sales-branch-chart");

    if (chart02) {
        chart02.destroy();
    }

    var columnConfig = {
        colors: ['#7638ff'],
        series: [{
            name: "Sales",
            type: "column",
            data: saleTotals
        }],
        chart: {
            type: 'bar',
            fontFamily: 'Poppins, sans-serif',
            height: 350,
            toolbar: {show: false}
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '10%',
                endingShape: 'rounded'
            }
        },
        dataLabels: {enabled: false},
        stroke: {show: true, width: 2, colors: ['transparent']},
        xaxis: {categories: allBranches},
        yaxis: {title: {text: 'Rs.'}},
        fill: {opacity: 1},
        tooltip: {
            y: {
                formatter: function (val) {
                    return "Rs" + val;
                }
            }
        }
    };

    chart02 = new ApexCharts(columnCtx, columnConfig);
    chart02.render();
}


/*Employee Reports*/

let totalEmpBranches = [];
let totalEmpBranchCount = [];
let empDesigCounts = [0, 0, 0, 0, 0, 0];


function getEmpDesigCounts() {

    empDesigCounts = [0, 0, 0, 0, 0, 0];

    $.ajax({
        url: `http://localhost:8081/api/v1/employee/countDesignation`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (data) {
            console.log(data);
            empDesigCounts[0] = data.manager;
            empDesigCounts[1] = data.stockKeeper;
            empDesigCounts[2] = data.delivery;
            empDesigCounts[3] = data.cashier;
            empDesigCounts[4] = data.cleaner;
            empDesigCounts[5] = data.securityGuard;
            console.log(empDesigCounts);


            allEmployeeCounts();
        }
    });
}

var chart03;
function allEmployeeCounts() {
    var pieCtx = document.getElementById("all-employees-count-chart");

    if (chart03) {
        chart03.destroy();
    }
    var pieConfig = {
        colors: ['#7638ff', '#ff737b', '#fda600', '#1ec1b0', '#3498DB', '#34495E'],
        series: empDesigCounts,
        chart: {
            fontFamily: 'Poppins, sans-serif',
            height: 350,
            type: 'donut'
        },
        labels: ['Manager', 'Stock Keeper', 'Delivery', 'Cashier', 'Cleaner', 'Security Guard'],
        legend: {show: false},
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {width: 200},
                legend: {position: 'bottom'}
            }
        }]
    };

    chart03 = new ApexCharts(pieCtx, pieConfig);
    chart03.render();
}


function getTotalEmpBranch() {

    totalEmpBranches = [];
    totalEmpBranchCount = [];

    $.ajax({
        url: `http://localhost:8081/api/v1/employee/totalBranch`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (details) {
            console.log(details);
            for (let i = 0; i < details.length; i++) {
                if (i % 2 == 0) {
                    totalEmpBranches.push(details[i]);
                } else {
                    totalEmpBranchCount.push(details[i]);
                }
            }

            totalEmpBranch();

        }
    });

}
var chart04;
function totalEmpBranch() {
    var columnCtx = document.getElementById("total-employees-branch-chart");

    if (chart04) {
        chart04.destroy();
    }

    var columnConfig = {
        colors: ['#7638ff'],
        series: [{
            name: "Total",
            type: "column",
            data: totalEmpBranchCount
        }],
        chart: {
            type: 'bar',
            fontFamily: 'Poppins, sans-serif',
            height: 350,
            toolbar: {show: false}
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '10%',
                endingShape: 'rounded'
            }
        },
        dataLabels: {enabled: false},
        stroke: {show: true, width: 2, colors: ['transparent']},
        xaxis: {categories: totalEmpBranches},
        yaxis: {title: {text: 'Count'}},
        fill: {opacity: 1},
        tooltip: {
            y: {
                formatter: function (val) {
                    return val;
                }
            }
        }
    };

    chart04 = new ApexCharts(columnCtx, columnConfig);
    chart04.render();
}

