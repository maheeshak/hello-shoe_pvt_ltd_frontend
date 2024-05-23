setCuurentDateAndTime();
function setCuurentDateAndTime() {
    let date = new Date();
    let dateStr = date.toDateString();
    let timeStr = date.toLocaleTimeString();
    $('#lbl-dashboard-date').text(dateStr);
    $('#lbl-dashboard-time').text(timeStr);
    setTimeout(setCuurentDateAndTime, 1000);
}