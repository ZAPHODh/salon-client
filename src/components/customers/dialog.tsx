// 'use client';

// import { useForm } from "react-hook-form";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
// } from "../ui/dialog";
// import { Form } from "../ui/form";
// import { GenericFormsInput } from "../ui/input/generic";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { useLocale, useMessages, useTranslations } from "next-intl";
// import { Button } from "../ui/button";
// import { ComponentProps, useEffect } from "react";
// import { createCustomerSchema, defaultCustomerValues, GetCustomerConfig } from "@/schemas/customers";

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
// import {
//     ColumnDef,
//     flexRender,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getPaginationRowModel,
//     useReactTable,
// } from "@tanstack/react-table";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "../ui/table";
// import { useMemo } from "react";

// import { format } from "date-fns";
// import { ptBR } from "date-fns/locale";
// import { Badge } from "../ui/badge";


// type CustomerDialogProps = {
//     isDialogOpen: boolean
//     setIsDialogOpen: (open: boolean) => void
//     selectedRowData: Customer | null
// }
// function CustomerDialog({ isDialogOpen, setIsDialogOpen, selectedRowData }: CustomerDialogProps) {
//     const locale = useLocale();
//     const messages = useMessages();
//     const t = useTranslations('customer.dialog');
//     const form = useForm<z.infer<typeof createCustomerSchema>>({
//         resolver: zodResolver(createCustomerSchema),
//         defaultValues: selectedRowData || defaultCustomerValues,
//     });

//     useEffect(() => {
//         if (isDialogOpen) {
//             form.reset(selectedRowData || defaultCustomerValues);
//         }
//     }, [selectedRowData, isDialogOpen, form]);

//     function onSubmit(values: z.infer<typeof createCustomerSchema>) {
//         console.log('Valores do formulário:', values);
//         setIsDialogOpen(false);
//     }

//     const customerConfig = GetCustomerConfig(locale, messages);

//     const serviceColumns: ColumnDef<Service>[] = useMemo(
//         () => [
//             {
//                 accessorKey: "name",
//                 header: t('tabs.services_table.name'),
//             },
//             {
//                 accessorKey: "price",
//                 header: t('tabs.services_table.price'),
//                 cell: ({ row }) =>
//                     new Intl.NumberFormat(locale, {
//                         style: 'currency',
//                         currency: 'BRL',
//                     }).format(row.getValue("price") as number),
//             },
//             {
//                 accessorKey: "duration",
//                 header: t('tabs.services_table.duration'),
//                 cell: ({ row }) => `${row.getValue("duration")} ${t('common.minutes')}`,
//             },
//             {
//                 accessorKey: "createdAt",
//                 header: t('tabs.services_table.created_at'),
//                 cell: ({ row }) => format(new Date(row.getValue("createdAt") as Date), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
//             },
//         ],
//         [locale, t]
//     );

//     const servicesTable = useReactTable({
//         data: selectedRowData?.services || [],
//         columns: serviceColumns,
//         getCoreRowModel: getCoreRowModel(),
//         getPaginationRowModel: getPaginationRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//     });

//     const appointmentColumns: ColumnDef<Appointment>[] = useMemo(
//         () => [
//             {
//                 accessorKey: "date",
//                 header: t('tabs.appointments_table.date'),
//                 cell: ({ row }) => format(new Date(row.getValue("date") as Date), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
//             },
//             {
//                 accessorKey: "service.name",
//                 header: t('tabs.appointments_table.service'),
//             },
//             {
//                 accessorKey: "professional.name",
//                 header: t('tabs.appointments_table.professional'),
//             },
//             {
//                 accessorKey: "status",
//                 header: t('tabs.appointments_table.status'),
//                 cell: ({ row }) => {
//                     const status = row.getValue("status") as AppointmentStatus;

//                     return <Badge variant={getBadgeVariantFromStatus(status)}>{t(`appointment_status.${status.toLowerCase()}`)}</Badge>;
//                 },
//             },
//             {
//                 accessorKey: "notes",
//                 header: t('tabs.appointments_table.notes'),
//             },
//         ],
//         [locale, t]
//     );

//     const appointmentsTable = useReactTable({
//         data: selectedRowData?.appointments || [],
//         columns: appointmentColumns,
//         getCoreRowModel: getCoreRowModel(),
//         getPaginationRowModel: getPaginationRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//     });

//     return (
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//             <DialogContent className="max-w-6xl">
//                 <DialogHeader>
//                     <DialogTitle>{t('title')}</DialogTitle>
//                     <DialogDescription>
//                         {t('description')}
//                     </DialogDescription>
//                 </DialogHeader>

//                 <Tabs defaultValue="services" className="w-full">
//                     <TabsList className="grid w-full grid-cols-3">
//                         <TabsTrigger value="services">
//                             {t(('tabs.services'))}
//                         </TabsTrigger>
//                         <TabsTrigger value="appointments">
//                             {t(('tabs.appointments'))}
//                         </TabsTrigger>
//                         <TabsTrigger value="edit">
//                             {t(('tabs.edit'))}
//                         </TabsTrigger>
//                     </TabsList>

//                     <TabsContent value="services" className="mt-4 space-y-4">
//                         {selectedRowData?.services && selectedRowData.services.length > 0 ? (
//                             <div className="rounded-md border">
//                                 <Table>
//                                     <TableHeader>
//                                         {servicesTable.getHeaderGroups().map((headerGroup) => (
//                                             <TableRow key={headerGroup.id}>
//                                                 {headerGroup.headers.map((header) => (
//                                                     <TableHead key={header.id}>
//                                                         {header.isPlaceholder
//                                                             ? null
//                                                             : flexRender(
//                                                                 header.column.columnDef.header,
//                                                                 header.getContext()
//                                                             )}
//                                                     </TableHead>
//                                                 ))}
//                                             </TableRow>
//                                         ))}
//                                     </TableHeader>
//                                     <TableBody>
//                                         {servicesTable.getRowModel().rows.map((row) => (
//                                             <TableRow key={row.id}>
//                                                 {row.getVisibleCells().map((cell) => (
//                                                     <TableCell key={cell.id}>
//                                                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                                                     </TableCell>
//                                                 ))}
//                                             </TableRow>
//                                         ))}
//                                         {servicesTable.getRowModel().rows.length === 0 && (
//                                             <TableRow>
//                                                 <TableCell colSpan={serviceColumns.length} className="text-center">
//                                                     {t('tabs.services_table.empty')}
//                                                 </TableCell>
//                                             </TableRow>
//                                         )}
//                                     </TableBody>
//                                 </Table>
//                             </div>
//                         ) : (
//                             <p>{t('tabs.services_table.empty')}</p>
//                         )}
//                     </TabsContent>

//                     <TabsContent value="appointments" className="mt-4 space-y-4 max-w-full">
//                         {selectedRowData?.appointments && selectedRowData.appointments.length > 0 ? (
//                             <div className="rounded-md border">
//                                 <Table>
//                                     <TableHeader>
//                                         {appointmentsTable.getHeaderGroups().map((headerGroup) => (
//                                             <TableRow key={headerGroup.id}>
//                                                 {headerGroup.headers.map((header) => (
//                                                     <TableHead key={header.id}>
//                                                         {header.isPlaceholder
//                                                             ? null
//                                                             : flexRender(
//                                                                 header.column.columnDef.header,
//                                                                 header.getContext()
//                                                             )}
//                                                     </TableHead>
//                                                 ))}
//                                             </TableRow>
//                                         ))}
//                                     </TableHeader>
//                                     <TableBody>
//                                         {appointmentsTable.getRowModel().rows.map((row) => (
//                                             <TableRow key={row.id}>
//                                                 {row.getVisibleCells().map((cell) => (
//                                                     <TableCell key={cell.id}>
//                                                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                                                     </TableCell>
//                                                 ))}
//                                             </TableRow>
//                                         ))}
//                                         {appointmentsTable.getRowModel().rows.length === 0 && (
//                                             <TableRow>
//                                                 <TableCell colSpan={appointmentColumns.length} className="text-center">
//                                                     {t('tabs.appointments_table.empty')}
//                                                 </TableCell>
//                                             </TableRow>
//                                         )}
//                                     </TableBody>
//                                 </Table>
//                             </div>
//                         ) : (
//                             <p>{t('tabs.appointments_table.empty')}</p>
//                         )}
//                     </TabsContent>

//                     <TabsContent value="edit" className="mt-4">
//                         <Form {...form}>
//                             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                                 <GenericFormsInput variants="single" fieldConfig={customerConfig} />

//                                 <div className="flex justify-end gap-4 pt-6">
//                                     <Button
//                                         type="button"
//                                         variant="secondary"
//                                         onClick={() => setIsDialogOpen(false)}
//                                     >
//                                         {t('common.cancel')}
//                                     </Button>
//                                     <Button type="submit" className="min-w-[120px]">
//                                         {t('common.save')}
//                                     </Button>
//                                 </div>
//                             </form>
//                         </Form>
//                     </TabsContent>
//                 </Tabs>
//             </DialogContent>
//         </Dialog>
//     );
// }
// function getBadgeVariantFromStatus(
//     label: AppointmentStatus
// ): ComponentProps<typeof Badge>["variant"] {
//     if (["completed"].includes(label.toLowerCase())) {
//         return "default"
//     }

//     if (["scheduled"].includes(label.toLowerCase())) {
//         return "outline"
//     }

//     return "secondary"
// }
// export { CustomerDialog };