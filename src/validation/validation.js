const isValidTitle = function (title) {
    const regex = /^(Mr|Mrs|Miss)+$\b/
    return regex.test(title)
}

const isValidPhone = function (number) {
    const regex = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return regex.test(number)
}
//  Example of mobile valid Numbers  +919367788755
//                                      89898293041
//                                      918765431234
//                                      +16308520397
//                                      786-307-3615 

const isValidMail = function (email) {
    const regex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    return regex.test(email)
}

const isValidFullName = function (name) {
    const regex = /^([a-zA-Z]+|[a-zA-Z]+\s{1}[a-zA-Z]{1,}|[a-zA-Z]+\s{1}[a-zA-Z]{3,}\s{1}[a-zA-Z]{1,})$/
    return regex.test(name)
}

const isValidPassword = function (password) {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
    return regex.test(password)
}

const isEmpty = function (value) {
    if (typeof (value) === 'string' && value.trim().length == 0) { return false }
    return true
}

const isValidRating = function (Number) {
    const regex = /^[1-5]*$/
    return regex.test(Number)
}

const isValidPincode = function (pincode) {
    const regex = /^[1-9][0-9]{5}$/
    return regex.test(pincode)
}

const isValidISBN = function (ISBN) {
    const regex = /^\+?([1-9]{3})\)?[-. ]?([0-9]{10})$/
    return regex.test(ISBN)
}

const isValidDate = function (Date) {
    const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
    return regex.test(Date)
}

module.exports = { isEmpty, isValidTitle, isValidPhone, isValidMail, isValidFullName, isValidPassword, isValidRating, isValidPincode, isValidISBN, isValidDate }