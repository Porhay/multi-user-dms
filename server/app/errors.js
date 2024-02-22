class BaseError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode || 500;
    }
}

class BadRequest extends BaseError {
    constructor(message) {
        super(message, 400);
    }
}

class NotFound extends BaseError {
    constructor(message) {
        super(message, 404);
    }
}

const handleErrors = (res, error) => {
    console.error('Error:', error);
    if (error instanceof BaseError) {
        res.status(error.statusCode).json({ error: error.message, statusCode: error.statusCode });
    } else {
        res.status(500).json({ error: 'Internal Server Error', statusCode: 500});
    }
};

export default {
    BaseError,
    BadRequest,
    NotFound,
    handleErrors,
};
