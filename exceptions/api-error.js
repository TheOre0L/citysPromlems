module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован')
    }
    static UnPermissionError() {
        return new ApiError(403, 'У вас недостаточно прав')
    }
    static UnActiveError() {
        return new ApiError(403, 'Ваш аккаунт не активирован и ограничен в возможностях')
    }
    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }
}
