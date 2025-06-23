// import type { TEventColor } from "@/calendar/types";
// import { IProfessional, ISchedule } from "./interfaces";



// export const PROFESSIONALS_MOCK: IProfessional[] = [
//     {
//         id: "f3b035ac-49f7-4e92-a715-35680bf63175",
//         name: "Dr. João Silva",
//         categroy: "Cardiologia",
//         cpf: "123.456.789-00",
//         address: "Av. Paulista, 1000 - São Paulo/SP",
//         profile: "Cardiologista com 10 anos de experiência em hospitais de referência",
//         phone: "(11) 9999-9999",
//         email: "joao.silva@clinica.com",
//         description: "Especialista em arritmias cardíacas e prevenção de doenças cardiovasculares",
//         salonId: "CLINICA_SP_01",
//         birthDay: new Date("1980-05-15"),
//         createdAt: new Date("2020-01-01"),
//         updatedAt: new Date("2024-01-01"),
//         picturePath: "/images/professionals/joao-silva.jpg",
//     },
//     {
//         id: "3e36ea6e-78f3-40dd-ab8c-a6c737c3c422",
//         name: "Dra. Maria Souza",
//         categroy: "Dermatologia",
//         phone: "(11) 8888-8888",
//         email: "maria.souza@clinica.com",
//         salonId: "CLINICA_SP_02",
//         createdAt: new Date("2021-03-15"),
//         updatedAt: new Date("2023-12-01"),
//         picturePath: "/images/professionals/maria-souza.jpg",
//     },
//     {

//         id: "a7aff6bd-a50a-4d6a-ab57-76f76bb27cf5",
//         name: "Dr. Pedro Oliveira",
//         categroy: "Ortopedia",
//         address: "R. Oscar Freire, 2000 - São Paulo/SP",
//         salonId: "CLINICA_SP_03",
//         birthDay: new Date("1975-11-30"),
//         createdAt: new Date("2019-06-01"),
//         updatedAt: new Date("2024-02-15"),
//         picturePath: null,
//     },
// ];



// const colors: TEventColor[] = ["blue", "green", "red", "yellow", "purple", "orange"];

// const mockGenerator = (numberOfSchedules: number): ISchedule[] => {
//     const result: ISchedule[] = [];
//     let currentId = 1;


//     const now = new Date();
//     const startRange = new Date(now);
//     startRange.setDate(now.getDate() - 30);
//     const endRange = new Date(now);
//     endRange.setDate(now.getDate() + 30);

//     // Gera os agendamentos
//     for (let i = 0; i < numberOfSchedules; i++) {
//         const isMultiDay = Math.random() < 0.1;
//         const startDate = new Date(startRange.getTime() + Math.random() * (endRange.getTime() - startRange.getTime()));
//         const professional = PROFESSIONALS_MOCK[Math.floor(Math.random() * PROFESSIONALS_MOCK.length)];

//         // Configura horário comercial
//         startDate.setHours(8 + Math.floor(Math.random() * 9), Math.floor(Math.random() * 60), 0, 0);

//         const endDate = new Date(startDate);

//         if (isMultiDay) {
//             endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 3) + 1);
//             endDate.setHours(17, 0, 0, 0);
//         } else {
//             endDate.setHours(startDate.getHours() + Math.floor(Math.random() * 3) + 1);
//         }

//         result.push({
//             id: currentId++,
//             startDate: startDate.toISOString(),
//             endDate: endDate.toISOString(),
//             title: `Consulta com ${professional.name.split(' ')[0]}`,
//             color: colors[Math.floor(Math.random() * colors.length)],
//             description: "Consulta médica de rotina para avaliação e acompanhamento",
//             professional: {
//                 id: professional.id,
//                 name: professional.name,
//                 categroy: professional.categroy,
//                 salonId: professional.salonId,
//                 createdAt: professional.createdAt,
//                 updatedAt: professional.updatedAt,
//                 picturePath: professional.picturePath,
//             },
//         });
//     }

//     return result;
// };

// export const SCHEDULES_MOCK: ISchedule[] = mockGenerator(50);