const isValidTitle = function(title){
    const regex =  /^(Mr|Mrs|Miss)+$\b/
    return regex.test(title)
}

const isValidPhone = function(number){
    const regex =  /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return regex.test(number)
}
    //  Example of mobile valid Numbers  +919367788755
    //                                      89898293041
    //                                      918765431234
    //                                      +16308520397
    //                                      786-307-3615 
         
const isValidMail = function(email){
    const regex =  /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    return regex.test(email)
}

const isValidFullName = function(name){
    const regex =  /^[.a-zA-Z\s,-]+$/
    return regex.test(name)
}

const isValidPassword = function(password){
    const regex = "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
    return regex.test(password)
}

const isEmpty = function(value){
    if(typeof(value) === 'string' && value.trim().length==0){return false}
    return true
}

module.exports = {isEmpty, isValidTitle, isValidPhone, isValidMail, isValidFullName, isValidPassword}