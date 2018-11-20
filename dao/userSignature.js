
/* ===== User Signature Class ==============================
|  Class with a constructor for User Signature			   |
|  ===============================================*/

class UserSignature {
    constructor(data) {
        this.registerStar = false;
        this.status =
            {
                address: "",
                requestTimeStamp: "",
                message: "",
                validationWindow: 0,
                messageSignature: ""
            }
    }
}

module.exports = UserSignature;
