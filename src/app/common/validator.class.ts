export class Validation {
    constructor(private func: (value: any, params?: any) => boolean, public errorMessage?: string, private params?: any){}

    isValid(value) {
        return this.func(value, this.params);
    }
}

export class Validate {
    public static getErrorMessage(validators: Validation[], value) {
        for (const validator of validators) {
            if (!validator.isValid(value)) {
                return validator.errorMessage;
            }
        }
    }

    public static required(errorMessage?: string) {
        return new Validation(validateRequired, errorMessage);
    }

    public static min(value: number, errorMessage?: string) {
        return new Validation(validateMin, errorMessage || 'Please enter a value over ' + value, value);
    }

    public static max(value: number, errorMessage?: string) {
        return new Validation(validateMax, errorMessage || 'Please enter a value under ' + value, value);
    }

    public static number(errorMessage = 'Please enter a valid number') {
        return new Validation(validateNumber, errorMessage);
    }
}

function validateRequired(value) {
    return !!value;
}

function validateMin(value, params) {
    return value >= params;
}

function validateMax(value, params) {
    return value <= params;
}

function validateNumber(value) {
    return !isNaN(parseFloat(value));
}
