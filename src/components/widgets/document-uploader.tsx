"use client";

import { Button } from "@/components/ui/button"
import { useFileInput } from "@/hooks/use-file-input";
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { toast } from "sonner";
import { useCustomer } from "../providers/customer";
import { useSession } from "../providers/session";


export function DocumentUploader(props: { setOpen: (open: boolean) => void }) {
    const t = useTranslations('customer.import.DocumentUploader');
    const { session } = useSession()
    const { setCustomers } = useCustomer()
    const {
        fileName,
        error,
        fileInputRef,
        handleFileSelect,
        clearFile,
    } = useFileInput({
        accept: ".json,.csv",
        maxSize: 10
    });
    const handleUpload = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/import-customers", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                toast(data.message, {
                    description: `Um ou mais clientes não foram indexados por conta do erro:${data.errors}`,
                })
                clearFile();
            }
            setCustomers(data.customers)
            props.setOpen(false)
            clearFile()
        } catch {

        }
    };
    return (
        <>
            <div className="space-y-4">

                <h3 className="text-lg font-medium">{t('title')}</h3>
                <div
                    className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center",
                        "hover:border-brand/50 transition-colors cursor-pointer",
                        error && "border-red-500"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {fileName ? (
                        <div className="space-y-2">
                            <p className="text-sm font-medium">{fileName}</p>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearFile();
                                }}
                                variant="ghost"
                                size="sm"
                            >
                                {t('button')}
                            </Button>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {t('upload.line1')}<br />
                            {t('upload.line2', { maxSize: 10 })}
                        </p>
                    )}
                </div>
                <input
                    type="file"
                    accept=".json,.csv"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                />

                {error && (
                    <p className="text-sm text-red-500">
                        {t('errorPrefix')}{error}
                    </p>
                )}
            </div>
            <div className="w-full flex items-center justify-end">
                <Button onClick={handleUpload} >
                    {t('send')}
                </Button>
            </div>
        </>
    )
}