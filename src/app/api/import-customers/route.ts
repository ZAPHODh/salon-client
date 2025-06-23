import { verifySession } from "@/lib/auth/dal";
import { ALLOWED_MIME_TYPES } from "@/lib/service/import/helper";
import { processFile } from "@/lib/service/import/process-file";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { session } = await verifySession()
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        if (!file) {
            return NextResponse.json(
                { message: 'Nenhum arquivo enviado' },
                { status: 400 }
            );
        }

        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return NextResponse.json(
                { message: 'Formato de arquivo não suportado' },
                { status: 400 }
            );
        }

        const buffer = await file.arrayBuffer();
        const result = await processFile(buffer, file.name);
        if (result.customers.length === 0) {
            return NextResponse.json(
                { message: 'Erros de validação', errors: result.errors, customers: result.customers },
                { status: 422 }
            );
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customers/many`, {
            method: "POST",
            headers: { Authorization: `Bearer ${session?.accessToken}` },
            body: JSON.stringify(result.customers)
        })
        if (!res.ok) {
            return NextResponse.json({ message: 'The customers cant be created' }, { status: 404 })
        }
        return NextResponse.json({ customers: result.customers });

    } catch (error) {
        console.error('Import Error:', error);
        return NextResponse.json(
            { message: 'Erro interno no processamento' },
            { status: 500 }
        );
    }
}
