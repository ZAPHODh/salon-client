// Supondo que as interfaces estejam importadas de algum módulo:

import { DataType } from "@/components/widgets/data-table";


const dummyOwner: User = {
    id: "user-1",
    name: "Owner Name",
    email: "owner@example.com",
    emailVerified: new Date("2025-01-01T00:00:00Z"),
    image: "",
    password: "secret",
    accounts: [],
    sessions: [],
    authenticators: [],
    subscriptionId: undefined,
    subscriptionRole: undefined,
    subscriptionStatus: undefined,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z"),
    salons: [],
    roles: [],
    auditLogs: []
};
const dummySalon: Salon = {
    owner: dummyOwner,
    ownerId: dummyOwner.id,
    id: "salon-1",
    name: "Dummy Salon",
    address: "Rua Exemplo, 123",
    city: "Cidade Exemplo",
    cep: "12345-678",
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z"),
    professionals: [],
    customers: [],
    services: [],
    products: [],
    sales: [],
    expenses: [],
    commissions: [],
    paymentMethods: [],
    appointments: [],
    financialAccounts: [],
    roles: [],
    inventoryMovements: [],
    cashRegisters: [],
    auditLogs: [],
    commissionRules: []
};

// Objeto mínimo para o PaymentMethod
const dummyPaymentMethod: PaymentMethod = {
    id: "pm-1",
    name: "Credit Card",
    salonId: dummySalon.id,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z"),
    salon: dummySalon,
    sales: []
};

// Objeto mínimo para o ExpenseCategory
const dummyExpenseCategory: ExpenseCategory = {
    id: "cat-1",
    name: "Utilities",
    salonId: dummySalon.id,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z"),
    salon: dummySalon,
    expenses: []
};

// Objeto mínimo para o Service (utilizado no SaleItem)
const dummyService: Service = {
    id: "service-1",
    name: "Haircut",
    description: "Basic haircut",
    price: 250,
    duration: 30,
    salonId: dummySalon.id,
    professionalId: undefined,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z"),
    salon: dummySalon,
    professional: undefined,
    saleItems: [],
    appointments: [],
    commissionRules: []
};

// Criação do objeto do tipo SaleItem (lembre-se de evitar circularidade)
const saleItem1: SaleItem = {
    id: "saleitem-1",
    saleId: "sale-1", // Será igual ao id do Sale
    quantity: 1,
    price: 250,
    total: 250,
    // Inicialmente, deixamos a referência para o sale como undefined e depois atribuiremos
    sale: {} as Sale,
    service: dummyService,
    product: undefined
};

// Criação do objeto do tipo Sale
const sale1: Sale = {
    id: "sale-1",
    salonId: dummySalon.id,
    customerId: "customer-1", // Opcional: pode ser string ou undefined
    professionalId: "professional-1", // Opcional
    totalAmount: 250,
    paymentMethodId: dummyPaymentMethod.id,
    createdAt: new Date("2025-02-02T14:00:00Z"),
    updatedAt: new Date("2025-02-02T14:00:00Z"),
    salon: dummySalon,
    customer: undefined, // Para teste, podemos deixar como undefined
    professional: undefined,
    items: [],
    paymentMethod: dummyPaymentMethod,
    transaction: undefined
};

// Agora, atribuímos a referência do Sale ao SaleItem e adicionamos ao array de items do Sale
saleItem1.sale = sale1;
sale1.items.push(saleItem1);

// Criação do objeto do tipo Expense
const expense1: Expense = {
    id: "expense-1",
    description: "Electricity Bill",
    date: new Date("2025-02-01T12:00:00Z"),
    amount: 100,
    categoryId: dummyExpenseCategory.id,
    salonId: dummySalon.id,
    createdAt: new Date("2025-02-01T12:00:00Z"),
    updatedAt: new Date("2025-02-01T12:00:00Z"),
    salon: dummySalon,
    category: dummyExpenseCategory
};

// Agora, criamos o array de dados do tipo DataType (Sale | Expense)
export const mockData: DataType[] = [sale1, expense1];

console.log(mockData);
