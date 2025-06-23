import { parse } from 'papaparse';
import { CustomerImportRaw, validateData } from './helper';

interface ValidationResult {
    customers: Partial<Customer>[];
    errors: string[];
}

export async function processFile(buffer: ArrayBuffer, fileName: string): Promise<ValidationResult> {
    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'json':
            return processJSON(buffer);
        case 'csv':
            return processCSV(buffer);
        default:
            throw new Error('Formato não suportado');
    }
}

function processCSV(buffer: ArrayBuffer): ValidationResult {
    const decoder = new TextDecoder('utf-8');
    const csvString = decoder.decode(buffer);

    const { data, errors } = parse<CustomerImportRaw>(csvString, {
        header: true,
        skipEmptyLines: true,
        transformHeader: h => h.trim()
    });

    if (errors.length > 0) throw new Error('Erro no CSV');
    return validateData(data);
}


function processJSON(buffer: ArrayBuffer): ValidationResult {
    try {
        const decoder = new TextDecoder('utf-8');
        const jsonData = JSON.parse(decoder.decode(buffer)) as CustomerImportRaw[];
        return validateData(jsonData);
    } catch (error) {
        throw new Error('Erro na análise do JSON');
    }
}