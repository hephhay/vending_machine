import { HTTPStatusCodes } from "../utils";

export abstract class CustomError extends Error{
    message!: string;
    statusCode!: HTTPStatusCodes;
}

export class NotFound extends CustomError{

    constructor(message?: string){

        super(message ?? "Request Not Found");
        this.statusCode = HTTPStatusCodes.NOT_FOUND
    }
}

export class ValidatonError extends CustomError{

    constructor(message?: string){

        super(message ?? "Invalid Request");
        this.statusCode = HTTPStatusCodes.BAD_REQUEST
    }
}

export class NotAuthenticated extends CustomError{

    constructor(message?: string){

        super(message ?? "User Not Authenticated");
        this.statusCode = HTTPStatusCodes.UNAUTHORIZED
    }
}

export class PermissionDenied extends CustomError{

    constructor(message?: string){

        super(message ?? "Permission Denied");
        this.statusCode = HTTPStatusCodes.FORBIDDEN
    }
}
