
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { useCalendar } from "@/calendar/contexts/calendar";
import { useTranslations } from "next-intl";

export function ProfessionalSelect() {
    const t = useTranslations('calendar.common')
    const { professionals, selectedProfessionalId, setSelectedProfessionalId } = useCalendar();

    return (
        <Select value={selectedProfessionalId} onValueChange={setSelectedProfessionalId}>
            <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecione um profissional" />
            </SelectTrigger>

            <SelectContent align="end" position="popper" className="w-64">
                <SelectItem value="all">
                    <div className="flex items-center gap-2">
                        <AvatarGroup max={3}>
                            {professionals.map((professional) => (
                                <Avatar key={professional.id} className="h-6 w-6 text-xs">
                                    <AvatarImage src={professional.name ?? undefined} />
                                    <AvatarFallback>{professional.name[0]}</AvatarFallback>
                                </Avatar>
                            ))}
                        </AvatarGroup>
                        <span>{t('all')}</span>
                    </div>
                </SelectItem>

                {professionals.map((professional) => (
                    <SelectItem key={professional.id} value={professional.id}>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={professional.name ?? undefined} />
                                <AvatarFallback>{professional.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="truncate">{professional.name}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}