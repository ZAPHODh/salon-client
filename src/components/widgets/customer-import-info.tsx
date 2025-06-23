'use client';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, ChevronDown } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../ui/collapsible"
import { CodeBlock } from "@/components/ui/code-block"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { Separator } from "../ui/separator"
import { useTranslations } from "next-intl";


const jsonExample = (fileName: string) => [
    {
        title: fileName,
        code: `[
  {
    "name": "Maria Silva",
    "phone": "11987654321",
    "email": "maria@exemplo.com",
    "birthDay": "1985-04-23",
    "genre": "F"
  }
]`,
        language: "json"
    }
]



export function CustomerImportInfo() {
    const t = useTranslations('customer.import');
    return (
        <div className="space-y-4">
            <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertTitle>{t('alert.title')}</AlertTitle>
                <AlertDescription className="mt-2">
                    <ul className="list-disc pl-4 space-y-2">
                        <li><strong>{t('alert.description.list1')}</strong></li>
                        <li>{t('alert.description.list2')}</li>
                        <li>{t('alert.description.list3')}<span className="font-semibold">{t('alert.description.fields')}</span></li>
                        <li>{t('alert.description.list4')}</li>
                    </ul>
                </AlertDescription>
            </Alert>

            <Collapsible>
                <CollapsibleTrigger className="flex items-center gap-2 w-full font-semibold py-2">
                    <ChevronDown className="h-4 w-4 transition-transform" />
                    {t('technicalRequirements')}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                    <div className="space-y-4 pl-6">
                        <Accordion type="single" collapsible>
                            <AccordionItem value="structure">
                                <AccordionTrigger>{t('structure.title')}</AccordionTrigger>
                                <AccordionContent>
                                    <CodeBlock
                                        files={jsonExample(t('structure.fileName'))}
                                        defaultTitle={t('structure.fileName')}
                                        className="max-h-[300px]"
                                    />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="csv">
                                <AccordionTrigger>{t('csv.title')}</AccordionTrigger>
                                <AccordionContent>
                                    <ScrollArea className="rounded-md border p-4 max-w-full">
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted">
                                                <tr>
                                                    {t.raw('csv.headers').map((header: string) => (
                                                        <th key={header} className="p-2 text-left">{header}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-t">
                                                    <td className="p-2">Maria Silva</td>
                                                    <td className="p-2">11987654321</td>
                                                    <td className="p-2">maria@exemplo.com</td>
                                                    <td className="p-2">1985-04-23</td>
                                                </tr>
                                                <tr className="border-t bg-muted">
                                                    <td className="p-2">João Souza</td>
                                                    <td className="p-2">21999887766</td>
                                                    <td className="p-2"></td>
                                                    <td className="p-2"></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <ScrollBar orientation="horizontal" />
                                    </ScrollArea>
                                    <p className="mt-3 text-sm font-medium">
                                        {t('csv.note')}
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </CollapsibleContent>
            </Collapsible>

            <Collapsible>
                <CollapsibleTrigger className="flex items-center gap-2 w-full font-semibold py-2">
                    <ChevronDown className="h-4 w-4 transition-transform" />
                    {t('validation.title')}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 pl-6">
                    <Accordion type="single" collapsible>
                        <AccordionItem value="format-rules">
                            <AccordionTrigger>{t('validation.formatRules')}</AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-3">
                                    <li>
                                        <strong>{t('validation.phone')}</strong>
                                        <div className="mt-1 text-muted-foreground text-sm">
                                            {t('validation.phoneNote')}
                                        </div>
                                    </li>

                                    <li>
                                        <strong>{t('validation.birthday')}</strong>
                                        <div className="mt-1 text-muted-foreground text-sm">
                                            {t('validation.birthdayNote')}
                                        </div>
                                    </li>

                                    <li>
                                        <strong>{t('validation.gender')}</strong>
                                        <div className="mt-1 text-muted-foreground text-sm">
                                            {t('validation.genderNote')}
                                            {t.raw('validation.genderValues').map((value: string, index: number) => (
                                                <span key={value} className="font-medium ml-1">
                                                    {value}{index < 2 ? ',' : ''}
                                                </span>
                                            ))}
                                        </div>
                                    </li>

                                    <li>
                                        <strong>{t('validation.email')}</strong>
                                        <div className="mt-1 text-muted-foreground text-sm">
                                            {t('validation.emailNote')}
                                        </div>
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CollapsibleContent>
            </Collapsible>
            <Separator className="mb-4" />
        </div>
    )
}