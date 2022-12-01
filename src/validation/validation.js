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
    const regex =  /^([a-zA-Z]+|[a-zA-Z]+\s{1}[a-zA-Z]{1,}|[a-zA-Z]+\s{1}[a-zA-Z]{3,}\s{1}[a-zA-Z]{1,})$/
    return regex.test(name)
}

const isValidPassword = function(password){
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
    return regex.test(password)
}

const isEmpty = function(value){
    if(typeof(value) === 'string' && value.trim().length==0){return false}
    return true
}

const isValidNumber = function(Number){
    const regex = /^[1-5]*$/
    return regex.test(Number)
}

module.exports = {isEmpty, isValidTitle, isValidPhone, isValidMail, isValidFullName, isValidPassword, isValidNumber}