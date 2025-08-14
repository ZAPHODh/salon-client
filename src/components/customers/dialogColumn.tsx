// components/customers/columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../ui/data-table/col-header";
import { createTranslator } from "next-intl";
import { formatDate } from "@/lib/helper";
import NumberFlow from "@number-flow/react";


export function getServiceHistoryColumns(locale: string, messages: Record<string, any>): ColumnDef<Appointment>[] {
    const t = createTranslator({ locale, namespace: "customer.dialog", messages });

    return [
        {
            accessorKey: "date",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t("serviceDate")} />
            ),
            cell: ({ row }) => formatDate(row.original.startDate, locale),
        },
        {
            accessorKey: "service.name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t("serviceType")} />
            ),
        },
        {
            accessorKey: "professional.name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t("professional")} />
            ),
        },
        {
            accessorKey: "salon.name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t("salon")} />
            ),
        },
        {
            id: "price",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t("price")} />
            ),
            cell: ({ row }) => (
                <NumberFlow
                    format={{
                        style: "currency",
                        currency: t('currency.code'),
                        trailingZeroDisplay: "stripIfInteger",
                    }}
                    value={row.original.service.price}
                    className="text-right font-medium"
                />
            ),

        },
        {
            id: "duration",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t("dialog.duration")} />
            ),
            cell: ({ row }) => {
                const duration = row.original.service.duration;
                return `${Math.floor(duration / 60)}h ${duration % 60}m`;
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t("dialog.status")} />
            ),
            cell: ({ row }) => (
                <span className="capitalize">
                    {row.original.status.toLowerCase()}
                </span>
            ),
        },
    ];
}

export function getAppointmentHistoryColumns(locale: string, messages: Record<string, any>): ColumnDef<Appointment>[] {
    const t = createTranslator({ locale, namespace: "customer.dialog", messages });

    return [
        {
            accessorKey: "date",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t("appointmentDate")} />
            ),
            cell: ({ row }) => formatDate(row.original.startDate, locale),
        },
        {
            accessorKey: "service.name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t("serviceType")} />
            ),
        },
        {
            accessorKey: "professional.name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t("professional")} />
            ),
        },
        {
            accessorKey: "salon.name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t("salon")} />
            ),
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t("status")} />
            ),
            cell: ({ row }) => (
                <span className="capitalize">
                    {row.original.status.toLowerCase()}
                </span>
            ),
        },
        {
            accessorKey: "notes",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t("notes")} />
            ),
            cell: ({ row }) => (
                <span className="text-muted-foreground">
                    {row.original.notes || t("common.none")}
                </span>
            ),
        },
    ];
}