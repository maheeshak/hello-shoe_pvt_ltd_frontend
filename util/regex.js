
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

function checkRegex(value , field) {

    switch (field) {
        case 'EMAIL':
            return emailRegex.test(value);
        default:
            return false;
    }

}