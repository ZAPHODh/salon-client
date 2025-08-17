// "use client"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { toast } from "sonner"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
// import { Input } from "../ui/input"
// import { Button } from "../ui/button"
// import { useTranslations } from "next-intl"
// import { useSession } from "../providers/session"


// function ProfileForm() {
//     const t = useTranslations('account.profileForm');
//     const { session } = useSession()
//     const profileFormSchema = z.object({
//         name: z
//             .string()
//             .min(2, {
//                 message: t('errors.name.min'),
//             })
//             .max(30, {
//                 message: t('errors.name.max'),
//             }),
//     })
//     type ProfileFormValues = z.infer<typeof profileFormSchema>

//     const form = useForm<ProfileFormValues>({
//         resolver: zodResolver(profileFormSchema),
//         mode: "onChange",
//         defaultValues: {
//             name: session?.user.name || '',
//         }
//     })

//     function onSubmit(data: ProfileFormValues) {
//     }

//     return (
//         <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-md ">
//                 <FormField
//                     control={form.control}
//                     name="name"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>{t('labels.name')}</FormLabel>
//                             <FormControl>
//                                 <Input
//                                     className="w-[200px]"
//                                     placeholder={t('placeholders.name')}
//                                     {...field}
//                                 />
//                             </FormControl>
//                             <FormDescription>
//                                 {t('descriptions.name')}
//                             </FormDescription>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <Button type="submit">{t('buttons.update')}</Button>
//             </form>
//         </Form>
//     )
// }

// export { ProfileForm }
