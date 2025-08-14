// Tipos auxiliares
type TransactionType = 'income' | 'expense';
type InventoryMovementType = 'entry' | 'exit' | 'adjustment';
type AppointmentStatus = 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'SCHEDULED';
type CashRegisterStatus = 'open' | 'closed' | 'reconciled';
type CommissionType = 'percentage' | 'fixed';
type SubscriptionPlan = {
    name: string;
    description: string;
    stripePriceId: string;
};
type UserSubscriptionPlan = SubscriptionPlan &
    Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
        stripeCurrentPeriodEnd: number;
        isPro: boolean;
    };
// Interfaces principais
interface User {
    id: string;
    name?: string;
    email: string;
    emailVerified?: Date;
    image?: string;
    password?: string;
    subscriptionId?: string;
    subscriptionRole?: string;
    subscriptionStatus?: string;
    createdAt: Date;
    updatedAt: Date;
    accounts: Account[];
    sessions: Session[];
    authenticators: Authenticator[];
    salons: Salon[];
    roles: UserRole[];
    auditLogs: AuditLog[];
}
interface Price {
    id: string;
    product_id: string;
    free: boolean;
    unit_amount: number;
    unit_type: "ONE_TIME";
    name: string;
    description: string;
}

type TCalendarView = "day" | "week" | "month" | "year" | "agenda";
type TEventColor = "blue" | "green" | "red" | "yellow" | "purple" | "orange" | "gray";
type TBadgeVariant = "dot" | "colored" | "mixed";
type TWorkingHours = { [key: number]: { from: number; to: number } };
type TVisibleHours = { from: number; to: number };
interface Salon {
    id: string;
    workingHours: TWorkingHours
    visibleHours: TVisibleHours
    ownerId: string;
    owner: User;
    name: string;
    address: string;
    city?: string;
    cep: string;
    createdAt: Date;
    updatedAt: Date;
    professionals: Professional[];
    customers: Customer[];
    services: Service[];
    products: Product[];
    sales: Sale[];
    expenses: Expense[];
    commissions: Commission[];
    paymentMethods: PaymentMethod[];
    appointments: Appointment[];
    financialAccounts: FinancialAccount[];
    roles: Role[];
    inventoryMovements: InventoryMovement[];
    cashRegisters: CashRegister[];
    auditLogs: AuditLog[];
}

interface Professional {
    id: string;
    name: string;
    slug: string;
    category: string;
    cpf?: string;
    phone?: string;
    email?: string;
    salonId: string;
    salon?: Salon;
    services: Service[];
    commissions: Commission[];
    appointments: Appointment[];
    userRoles: UserRole[];
    transactions?: Transaction[];
    commissionRate: string;
}

interface Customer {
    id: string;
    name: string;
    slug: string;
    city?: string;
    address?: string;
    genre?: string;
    phone?: string;
    email?: string;
    birthDay?: Date;
    salonId: string;
    salon?: Salon;
    sales?: Sale[];
    appointments?: Appointment[];
    transactions?: Transaction[];
    createdAt: Date
}

interface Sale {
    id: string;
    salonId: string;
    customerId?: string;
    professionalId?: string;
    totalAmount: number;
    paymentMethodId: string;
    createdAt: Date;
    updatedAt: Date;
    salon: Salon;
    customer?: Customer;
    professional?: Professional;
    items: SaleItem[];
    paymentMethod: PaymentMethod;
    transaction?: Transaction;
}

interface SaleItem {
    id: string;
    saleId: string;
    serviceId?: string;
    productId?: string;
    quantity: number;
    price: number;
    total: number;
    sale: Sale;
    service?: Service;
    product?: Product;
}

interface Service {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration: number;
    salonId: string;
    professionalId?: string;
    createdAt: Date;
    updatedAt: Date;
    salon?: Salon;
    professional?: Professional;
    saleItems?: SaleItem[];
    appointments: Appointment[];
}

interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    salonId: string;
    createdAt: Date;
    updatedAt: Date;
    salon: Salon;
    saleItems: SaleItem[];
    inventoryMovements: InventoryMovement[];
}

interface Expense {
    id: string;
    description: string;
    date: Date;
    amount: number;
    categoryId: string;
    salonId: string;
    createdAt: Date;
    updatedAt: Date;
    salon: Salon;
    category: ExpenseCategory;
}

interface ExpenseCategory {
    id: string;
    name: string;
    salonId: string;
    createdAt: Date;
    updatedAt: Date;
    salon: Salon;
    expenses: Expense[];
}

interface Commission {
    id: string;
    amount: number;
    professionalId: string;
    salonId: string;
    createdAt: Date;
    updatedAt: Date;
    professional: Professional;
    salon: Salon;
}

interface PaymentMethod {
    id: string;
    name: string;
    salonId: string;
    createdAt: Date;
    updatedAt: Date;
    salon: Salon;
    sales: Sale[];
}

interface Appointment {
    id: string;
    professionalId: string;
    customerId: string;
    serviceId: string;
    startDate: Date;
    status: AppointmentStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    professional: Professional;
    customer: Customer;
    service: Service;
}

interface Role {
    id: string;
    name: string;
    permissions: string[];
    salonId: string;
    createdAt: Date;
    updatedAt: Date;
    salon: Salon;
    userRoles: UserRole[];
}

interface UserRole {
    userId: string;
    roleId: string;
    salonId: string;
    user: User;
    role: Role;
    salon: Salon;
    createdAt: Date;
}

interface FinancialAccount {
    id: string;
    salonId: string;
    balance: number;
    currency: string;
    transactions: Transaction[];
    createdAt: Date;
    updatedAt: Date;
}

interface Transaction {
    id: string;
    accountId: string;
    type: TransactionType;
    amount: number;
    category: string;
    description: string;
    date: Date;
    referenceId?: string;
    createdAt: Date;
    financialAccount: FinancialAccount;
}

interface InventoryMovement {
    id: string;
    productId: string;
    quantity: number;
    type: InventoryMovementType;
    reason: string;
    createdAt: Date;
    product: Product;
}

interface CashRegister {
    id: string;
    salonId: string;
    openingBalance: number;
    closingBalance?: number;
    startAt: Date;
    endAt?: Date;
    transactions: Transaction[];
    responsibleId: string;
    status: CashRegisterStatus;
    createdAt: Date;
    updatedAt: Date;
    salon: Salon;
    responsible: Professional;
}

interface AuditLog {
    id: string;
    action: string;
    entity: string;
    entityId: string;
    userId: string;
    user: User;
    details: Record<string, unknown>;
    createdAt: Date;
}


// Interfaces para integração com Stripe
interface StripeIntegration {
    id: string;
    salonId: string;
    accountId: string;
    enabled: boolean;
    currency: string;
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
    createdAt: Date;
    updatedAt: Date;
    salon: Salon;
}

interface StripeCustomer {
    id: string;
    userId: string;
    salonId: string;
    stripeId: string;
    paymentMethodId?: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    salon: Salon;
}

interface DataExport {
    id: string;
    userId: string;
    salonId: string;
    format: 'CSV' | 'JSON' | 'XLSX';
    type: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    fileUrl?: string;
    filters?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    salon: Salon;
}

interface DataImport {
    id: string;
    userId: string;
    salonId: string;
    format: 'CSV' | 'JSON' | 'XLSX';
    type: string;
    status: 'PENDING' | 'VALIDATING' | 'IMPORTING' | 'COMPLETED' | 'FAILED';
    fileUrl: string;
    mapping?: Record<string, unknown>;
    stats?: Record<string, unknown>;
    errors?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    salon: Salon;
}