
class ApiResponse<T>{
    message: string;
    data: T;
    statuscode: number;
    success: boolean;
    constructor(
        message = "successful",
        data: T,
        statuscode: number,
    ){
        this.message = message;
        this.data = data;
        this.statuscode = statuscode;
        this.success = statuscode < 400;
    }
};

export default ApiResponse;