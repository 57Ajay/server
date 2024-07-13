class ApiResponse{
    message: string;
    data: [];
    statuscode: number;
    success: boolean;
    constructor(
        message = "successful",
        data: [],
        statuscode: number,
    ){
        this.message = message;
        this.data = data;
        this.statuscode = statuscode;
        this.success = statuscode < 400;
    }
};

export default ApiResponse;