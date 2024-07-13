class ApiError extends Error{
    statuscode: number;
    errors: never[];
    data: null;
    success: boolean;
    constructor(
        message = "something went wrong",
        statuscode: number,
        errors = [],
        stack = ""
    )
    {
        super(message);
        this.statuscode = statuscode;
        this.errors = errors;
        this.data = null;
        this.message = message;
        this.success = false;
        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
    
};

export default ApiError;