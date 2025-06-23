

export interface IProfessional {
    id: string;
    name: string;
    categroy: string;
    cpf?: string;
    address?: string;
    profile?: string;
    phone?: string;
    email?: string;
    description?: string;
    salonId: string;
    birthDay?: Date;
    createdAt: Date;
    updatedAt: Date;
    picturePath: string | null;
    services?: Service[];
    salon?: Salon;
    sales?: Sale[];
    Commission: Commission[];
    schedules?: ISchedule[];
}

export interface ISchedule {
    id: number;
    startDate: string;
    startTime: {
        hour: number,
        minute: number,
    },
    endTime: {
        hour: number,
        minute: number,
    }
    endDate: string;
    title: string;
    color: TEventColor;
    status: Status;
    notes?: string;
    professional: IProfessional;
    service: Service
    customer: Customer
}
type Status = 'SCHEDULED' |
    'COMPLETED' |
    'CANCELLED' |
    'NO_SHOW'
export interface ICalendarCell {
    day: number;
    currentMonth: boolean;
    date: Date;
}