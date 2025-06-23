
import validator from 'validator';

export const ALLOWED_MIME_TYPES = [
    'application/json',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
];

export interface CustomerImportRaw {
    name?: string;
    phone?: string;
    email?: string;
    birthDay?: string;
    genre?: string;
    city?: string;
    address?: string;
}

export const EXPECTED_HEADERS = ['name', 'phone', 'email', 'birthDay'];

export const isValidPhone = (phone: string): boolean => /^\d{11}$/.test(phone);

function isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) &&
        date.toISOString().split('T')[0] === dateString;
}

interface ValidationResult {
    customers: Partial<Customer>[];
    errors: string[];
}

export function validateData(data: CustomerImportRaw[]): ValidationResult {
    const result: ValidationResult = {
        customers: [],
        errors: []
    };

    data.forEach((row, index) => {
        const lineNumber = index + 2;
        const rowErrors: string[] = [];
        const customer: Partial<Customer> = {};

        // Validação de nome
        if (!row.name?.trim()) {
            rowErrors.push(`Linha ${lineNumber}: Nome é obrigatório`);
        } else {
            customer.name = row.name.trim();
        }

        if (!row.phone) {
            rowErrors.push(`Linha ${lineNumber}: Telefone é obrigatório`);
        } else if (!/^\d{11}$/.test(row.phone)) {
            rowErrors.push(`Linha ${lineNumber}: Telefone inválido (formato 11999990000)`);
        } else {
            customer.phone = row.phone;
        }


        if (row.email && !validator.isEmail(row.email)) {
            rowErrors.push(`Linha ${lineNumber}: E-mail inválido`);
        } else if (row.email) {
            customer.email = row.email.trim();
        }

        if (row.birthDay) {
            if (!isValidDate(row.birthDay)) {
                rowErrors.push(`Linha ${lineNumber}: Data inválida`);
            } else {
                customer.birthDay = new Date(row.birthDay);
            }
        }

        if (row.genre && !['M', 'F', 'O'].includes(row.genre.toUpperCase())) {
            result.customers.push(customer as Customer);
        } else if (row.genre) {
            customer.genre = row.genre.toUpperCase();
        }

        if (row.city) customer.city = row.city;
        if (row.address) customer.address = row.address;

        if (rowErrors.length === 0) {
            result.customers.push(customer);
        } else {
            result.errors.push(...rowErrors);
        }
    });

    return result;
}