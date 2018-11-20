
const DL = require('../dl/levelUserSignature');
const UserSignature = require('../dao/userSignature');
const bitcoinMessage = require('bitcoinjs-message')


class ValidateUserSignature {


    //valid if message signature was register is valid
    async isValid(address) {
        return new Promise((resolve, reject) => {
            DL.getSignature(address).then((value) => {
                value = JSON.parse(value);
                return value.status.messageSignature === 'valid' ? resolve(true) : resolve(false);
            }).catch((err) => {
                console.log(err);
                return reject(err);
            });
        });
    }

    //Delete user signature 
    invalidate(address) {
        DL.delSignature(address);
    }

    //Add new wallet address for validate
    async requestValidation(address) {
        return new Promise((resolve, reject) => {
            if (address != "undefined" && address != "") {
                DL.getSignature(address).then((value) => {
                    if (value) {
                        value = JSON.parse(value);
                        const sub = Date.now() - (5 * 60 * 1000)
                        const isExpired = value.status.requestTimeStamp < sub
                        if (isExpired) {
                            DL.delSignature(address);
                            value.status.validationWindow = 0
                            value.status.messageSignature = 'Validation window was expired'
                            resolve(value)
                        } else {
                            value.status.validationWindow = Math.floor((value.status.requestTimeStamp - sub) / 1000);
                            resolve(value);
                        }
                    } 
                }).catch((err) => {
                    this.buildRequest(address).then((request) => {
                        DL.addSignature(request.status.address, request);
                        resolve(request);
                    });
                });
            }
        });
    }

    //Map request in UserSignature object
    buildRequest(address) {
        return new Promise((resolve, reject) => {
            let userSignature = new UserSignature();
            userSignature.status.address = address;
            userSignature.status.requestTimeStamp = Date.now();
            userSignature.status.message = `${address}:${userSignature.status.requestTimeStamp}:starRegistry`;
            userSignature.status.validationWindow = 300;
            resolve(userSignature);
        });
    }

    //Validate signature 
    signatureValidate(address, signature) {
        return new Promise((resolve, reject) => {
            DL.getSignature(address).then((value) => {
                if (value == undefined) {
                    return reject("Not Found");
                } else {
                    value = JSON.parse(value);
                    if (value.status.messageSignature === 'valid') {
                        value.registerStar = true;
                        return resolve(value);
                    } else {
                        const sub = Date.now() - (5 * 60 * 1000)
                        const isExpired = value.status.requestTimeStamp < sub
                        let isValid = false

                        if (isExpired) {
                            value.status.validationWindow = 0
                            value.status.messageSignature = 'Validation window was expired'
                        } else {
                            value.status.validationWindow = Math.floor((value.status.requestTimeStamp - sub) / 1000)

                            try {
                                isValid = bitcoinMessage.verify(value.status.message, address, signature)
                            } catch (error) {
                                isValid = false
                            }

                            value.status.messageSignature = isValid ? 'valid' : 'invalid'
                        }

                        value.registerStar = !isExpired && isValid,
                            DL.addSignature(address, value);
                        return resolve(value);
                    }
                }
            }).catch((err) => {
                return reject(err);
            });
        });
    }
}
module.exports = ValidateUserSignature;