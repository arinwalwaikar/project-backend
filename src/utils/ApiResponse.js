//api response class to handle all the responses in the application

class ApiResponse {
    constructor(statusCode,data,message="Sucess"){
        this.statusCode = statusCode;
        this.dat = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}