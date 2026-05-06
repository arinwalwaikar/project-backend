//api response class to handle all the responses in the applications  //

class ApiResponse {
    constructor(statusCode,data,message="Sucess"){
        this.statusCode = statusCode;
        this.dat = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export {ApiResponse};