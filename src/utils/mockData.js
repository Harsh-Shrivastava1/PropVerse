
import { Timestamp } from 'firebase/firestore';

// Helper to create Timestamps (simulating Firestore)
const now = new Date();
const daysAgo = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return Timestamp.fromDate(d);
};

export const mockUser = {
    uid: 'demo-user-123',
    email: 'demo@propvera.com',
    displayName: 'Demo Builder',
    photoURL: null,
    emailVerified: true
};

export const mockBuilder = {
    id: 'demo-user-123',
    name: 'Demo Builder',
    email: 'demo@propvera.com',
    companyName: 'Propvera Demo Construction',
    phone: '9876543210',
    createdAt: daysAgo(30),
    plan: 'pro',
    totalUnits: 34,
    rentedUnits: 25,
    activeProjects: 3
};

export const mockProjects = [
    {
        id: 'proj-1',
        name: 'Skyline Towers',
        location: 'Mumbai, India',
        builderId: 'demo-user-123',
        createdAt: daysAgo(25),
        isDeleted: false
    },
    {
        id: 'proj-2',
        name: 'Green Valley Estates',
        location: 'Bangalore, India',
        builderId: 'demo-user-123',
        createdAt: daysAgo(15),
        isDeleted: false
    },
    {
        id: 'proj-3',
        name: 'Ocean View Residency',
        location: 'Goa, India',
        builderId: 'demo-user-123',
        createdAt: daysAgo(5),
        isDeleted: false
    }
];

// Helper for realistic names
const tenants = [
    { name: "Rahul Sharma", email: "rahul.s@gmail.com", phone: "9876543001" },
    { name: "Priya Patel", email: "priya.p@yahoo.com", phone: "9876543002" },
    { name: "Amit Verma", email: "amit.v@outlook.com", phone: "9876543003" },
    { name: "Sneha Gupta", email: "sneha.g@gmail.com", phone: "9876543004" },
    { name: "Vikram Singh", email: "vikram.s@hotmail.com", phone: "9876543005" },
    { name: "Anjali Mehta", email: "anjali.m@gmail.com", phone: "9876543006" },
    { name: "Rohan Das", email: "rohan.d@gmail.com", phone: "9876543007" },
    { name: "Kavita Reddy", email: "kavita.r@gmail.com", phone: "9876543008" },
    { name: "Suresh Nair", email: "suresh.n@yahoo.com", phone: "9876543009" },
    { name: "Meera Iyer", email: "meera.i@gmail.com", phone: "9876543010" },
    { name: "Arjun Malhotra", email: "arjun.m@gmail.com", phone: "9876543011" },
    { name: "Divya Kapoor", email: "divya.k@gmail.com", phone: "9876543012" },
    { name: "Rajesh Kumar", email: "rajesh.k@outlook.com", phone: "9876543013" },
    { name: "Neastro Properties", email: "admin@neastro.com", phone: "9876543014" }, // Corporate
    { name: "Zoya Khan", email: "zoya.k@gmail.com", phone: "9876543015" }
];

export const mockUnits = [
    // --- Project 1: Skyline Towers (Mumbai) - 20 Units ---
    // Floor 1
    { id: 'u-101', projectId: 'proj-1', unitNumber: 'A-101', type: '2BHK', floor: '1', status: 'Rented', rentAmount: '45000', deposit: '150000', tenant: { ...tenants[0], monthlyRent: '45000', rentDueDay: '5', leaseStart: daysAgo(200).toDate().toISOString() }, createdAt: daysAgo(300), updatedAt: daysAgo(10), isDeleted: false },
    { id: 'u-102', projectId: 'proj-1', unitNumber: 'A-102', type: '2BHK', floor: '1', status: 'Rented', rentAmount: '45000', deposit: '150000', tenant: { ...tenants[1], monthlyRent: '45000', rentDueDay: '5', leaseStart: daysAgo(180).toDate().toISOString() }, createdAt: daysAgo(300), updatedAt: daysAgo(12), isDeleted: false },
    { id: 'u-103', projectId: 'proj-1', unitNumber: 'A-103', type: '3BHK', floor: '1', status: 'Rented', rentAmount: '60000', deposit: '200000', tenant: { ...tenants[2], monthlyRent: '60000', rentDueDay: '1', leaseStart: daysAgo(400).toDate().toISOString() }, createdAt: daysAgo(300), updatedAt: daysAgo(5), isDeleted: false },
    { id: 'u-104', projectId: 'proj-1', unitNumber: 'A-104', type: '3BHK', floor: '1', status: 'Vacant', rentAmount: '62000', deposit: '200000', tenant: null, createdAt: daysAgo(300), updatedAt: daysAgo(45), isDeleted: false },

    // Floor 2
    { id: 'u-105', projectId: 'proj-1', unitNumber: 'A-201', type: '2BHK', floor: '2', status: 'Rented', rentAmount: '46000', deposit: '150000', tenant: { ...tenants[3], monthlyRent: '46000', rentDueDay: '7', leaseStart: daysAgo(90).toDate().toISOString() }, createdAt: daysAgo(300), updatedAt: daysAgo(2), isDeleted: false },
    { id: 'u-106', projectId: 'proj-1', unitNumber: 'A-202', type: '2BHK', floor: '2', status: 'Rented', rentAmount: '46000', deposit: '150000', tenant: { ...tenants[4], monthlyRent: '46000', rentDueDay: '7', leaseStart: daysAgo(60).toDate().toISOString() }, createdAt: daysAgo(300), updatedAt: daysAgo(8), isDeleted: false },
    { id: 'u-107', projectId: 'proj-1', unitNumber: 'A-203', type: '3BHK', floor: '2', status: 'Sold', rentAmount: '0', deposit: '0', tenant: null, createdAt: daysAgo(300), updatedAt: daysAgo(200), isDeleted: false },
    { id: 'u-108', projectId: 'proj-1', unitNumber: 'A-204', type: '3BHK', floor: '2', status: 'Rented', rentAmount: '62000', deposit: '200000', tenant: { ...tenants[5], monthlyRent: '62000', rentDueDay: '10', leaseStart: daysAgo(120).toDate().toISOString() }, createdAt: daysAgo(300), updatedAt: daysAgo(15), isDeleted: false },

    // Floor 3
    { id: 'u-109', projectId: 'proj-1', unitNumber: 'B-301', type: '2BHK', floor: '3', status: 'Rented', rentAmount: '48000', deposit: '150000', tenant: { ...tenants[6], monthlyRent: '48000', rentDueDay: '1', leaseStart: daysAgo(30).toDate().toISOString() }, createdAt: daysAgo(200), updatedAt: daysAgo(5), isDeleted: false },
    { id: 'u-110', projectId: 'proj-1', unitNumber: 'B-302', type: '2BHK', floor: '3', status: 'Vacant', rentAmount: '48000', deposit: '150000', tenant: null, createdAt: daysAgo(200), updatedAt: daysAgo(10), isDeleted: false },
    { id: 'u-111', projectId: 'proj-1', unitNumber: 'B-303', type: '3BHK', floor: '3', status: 'Rented', rentAmount: '65000', deposit: '220000', tenant: { ...tenants[7], monthlyRent: '65000', rentDueDay: '5', leaseStart: daysAgo(300).toDate().toISOString() }, createdAt: daysAgo(200), updatedAt: daysAgo(3), isDeleted: false },
    { id: 'u-112', projectId: 'proj-1', unitNumber: 'B-304', type: '3BHK', floor: '3', status: 'Sold', rentAmount: '0', deposit: '0', tenant: null, createdAt: daysAgo(200), updatedAt: daysAgo(150), isDeleted: false },

    // Floor 4 & 5 (Penthouse/Special)
    { id: 'u-113', projectId: 'proj-1', unitNumber: 'C-401', type: 'Penthouse', floor: '4', status: 'Rented', rentAmount: '120000', deposit: '500000', tenant: { ...tenants[13], monthlyRent: '120000', rentDueDay: '1', leaseStart: daysAgo(20).toDate().toISOString() }, createdAt: daysAgo(200), updatedAt: daysAgo(20), isDeleted: false },
    { id: 'u-114', projectId: 'proj-1', unitNumber: 'C-501', type: 'Penthouse', floor: '5', status: 'Rented', rentAmount: '125000', deposit: '500000', tenant: { ...tenants[14], monthlyRent: '125000', rentDueDay: '15', leaseStart: daysAgo(60).toDate().toISOString() }, createdAt: daysAgo(200), updatedAt: daysAgo(10), isDeleted: false },


    // --- Project 2: Green Valley Estates (Bangalore) - 6 Villas ---
    { id: 'u-201', projectId: 'proj-2', unitNumber: 'Villa-01', type: 'Villa', floor: 'G', status: 'Rented', rentAmount: '85000', deposit: '400000', tenant: { ...tenants[8], monthlyRent: '85000', rentDueDay: '1', leaseStart: daysAgo(365).toDate().toISOString() }, createdAt: daysAgo(150), updatedAt: daysAgo(30), isDeleted: false },
    { id: 'u-202', projectId: 'proj-2', unitNumber: 'Villa-02', type: 'Villa', floor: 'G', status: 'Rented', rentAmount: '85000', deposit: '400000', tenant: { ...tenants[9], monthlyRent: '85000', rentDueDay: '5', leaseStart: daysAgo(200).toDate().toISOString() }, createdAt: daysAgo(150), updatedAt: daysAgo(10), isDeleted: false },
    { id: 'u-203', projectId: 'proj-2', unitNumber: 'Villa-03', type: 'Villa', floor: 'G', status: 'Sold', rentAmount: '0', deposit: '0', tenant: null, createdAt: daysAgo(150), updatedAt: daysAgo(100), isDeleted: false },
    { id: 'u-204', projectId: 'proj-2', unitNumber: 'Villa-04', type: 'Villa', floor: 'G', status: 'Rented', rentAmount: '90000', deposit: '400000', tenant: { ...tenants[10], monthlyRent: '90000', rentDueDay: '3', leaseStart: daysAgo(40).toDate().toISOString() }, createdAt: daysAgo(150), updatedAt: daysAgo(5), isDeleted: false },
    { id: 'u-205', projectId: 'proj-2', unitNumber: 'Villa-05', type: 'Villa', floor: 'G', status: 'Vacant', rentAmount: '95000', deposit: '450000', tenant: null, createdAt: daysAgo(150), updatedAt: daysAgo(25), isDeleted: false },
    { id: 'u-206', projectId: 'proj-2', unitNumber: 'Villa-06', type: 'Villa', floor: 'G', status: 'Rented', rentAmount: '95000', deposit: '450000', tenant: { ...tenants[11], monthlyRent: '95000', rentDueDay: '1', leaseStart: daysAgo(10).toDate().toISOString() }, createdAt: daysAgo(150), updatedAt: daysAgo(2), isDeleted: false },

    // --- Project 3: Ocean View Residency (Goa) - 8 Units ---
    { id: 'u-301', projectId: 'proj-3', unitNumber: 'G-101', type: '1BHK', floor: 'G', status: 'Rented', rentAmount: '35000', deposit: '100000', tenant: { ...tenants[12], monthlyRent: '35000', rentDueDay: '10', leaseStart: daysAgo(90).toDate().toISOString() }, createdAt: daysAgo(100), updatedAt: daysAgo(5), isDeleted: false },
    { id: 'u-302', projectId: 'proj-3', unitNumber: 'G-102', type: '1BHK', floor: 'G', status: 'Vacant', rentAmount: '35000', deposit: '100000', tenant: null, createdAt: daysAgo(100), updatedAt: daysAgo(10), isDeleted: false },
    { id: 'u-303', projectId: 'proj-3', unitNumber: 'F-201', type: '2BHK', floor: '1', status: 'Rented', rentAmount: '55000', deposit: '200000', tenant: { name: "Robert D'Souza", email: "robert@goa.com", phone: "9870000001", monthlyRent: '55000', rentDueDay: '1', leaseStart: daysAgo(300).toDate().toISOString() }, createdAt: daysAgo(100), updatedAt: daysAgo(2), isDeleted: false },
    { id: 'u-304', projectId: 'proj-3', unitNumber: 'F-202', type: '2BHK', floor: '1', status: 'Rented', rentAmount: '55000', deposit: '200000', tenant: { name: "Maria Fernandes", email: "maria@goa.com", phone: "9870000002", monthlyRent: '55000', rentDueDay: '1', leaseStart: daysAgo(250).toDate().toISOString() }, createdAt: daysAgo(100), updatedAt: daysAgo(15), isDeleted: false },
    { id: 'u-305', projectId: 'proj-3', unitNumber: 'S-301', type: 'Studio', floor: '2', status: 'Rented', rentAmount: '28000', deposit: '80000', tenant: { name: "Alex Pereira", email: "alex@goa.com", phone: "9870000003", monthlyRent: '28000', rentDueDay: '5', leaseStart: daysAgo(60).toDate().toISOString() }, createdAt: daysAgo(100), updatedAt: daysAgo(8), isDeleted: false },
    { id: 'u-306', projectId: 'proj-3', unitNumber: 'S-302', type: 'Studio', floor: '2', status: 'Vacant', rentAmount: '28000', deposit: '80000', tenant: null, createdAt: daysAgo(100), updatedAt: daysAgo(40), isDeleted: false },
    { id: 'u-307', projectId: 'proj-3', unitNumber: 'T-401', type: '3BHK', floor: '3', status: 'Sold', rentAmount: '0', deposit: '0', tenant: null, createdAt: daysAgo(100), updatedAt: daysAgo(90), isDeleted: false },
    { id: 'u-308', projectId: 'proj-3', unitNumber: 'T-402', type: '3BHK', floor: '3', status: 'Rented', rentAmount: '70000', deposit: '300000', tenant: { name: "Karan Johar", email: "karan@bollywood.com", phone: "9870000004", monthlyRent: '70000', rentDueDay: '1', leaseStart: daysAgo(15).toDate().toISOString() }, createdAt: daysAgo(100), updatedAt: daysAgo(5), isDeleted: false }
];

export const mockRentHistory = [
    // --- THIS MONTH PAYMENTS (Collected Revenue) ---
    // Skyline Towers (High value)
    { id: 'r-101', unitId: 'u-101', unitNumber: 'A-101', amount: 45000, date: daysAgo(2), tenantName: 'Rahul Sharma', paymentMode: 'UPI', status: 'PAID', createdAt: daysAgo(2), builderId: 'demo-user-123' },
    { id: 'r-102', unitId: 'u-103', unitNumber: 'A-103', amount: 60000, date: daysAgo(15), tenantName: 'Amit Verma', paymentMode: 'Bank Transfer', status: 'PAID', createdAt: daysAgo(15), builderId: 'demo-user-123' },
    { id: 'r-103', unitId: 'u-105', unitNumber: 'A-201', amount: 46000, date: daysAgo(5), tenantName: 'Sneha Gupta', paymentMode: 'UPI', status: 'PAID', createdAt: daysAgo(5), builderId: 'demo-user-123' },
    { id: 'r-104', unitId: 'u-106', unitNumber: 'A-202', amount: 46000, date: daysAgo(7), tenantName: 'Vikram Singh', paymentMode: 'Cheque', status: 'PAID', createdAt: daysAgo(7), builderId: 'demo-user-123' },
    { id: 'r-105', unitId: 'u-108', unitNumber: 'A-204', amount: 62000, date: daysAgo(10), tenantName: 'Anjali Mehta', paymentMode: 'Bank Transfer', status: 'PAID', createdAt: daysAgo(10), builderId: 'demo-user-123' },
    { id: 'r-106', unitId: 'u-109', unitNumber: 'B-301', amount: 48000, date: daysAgo(1), tenantName: 'Rohan Das', paymentMode: 'Cash', status: 'PAID', createdAt: daysAgo(1), builderId: 'demo-user-123' },

    // Penthouse - Big Ticket
    { id: 'r-107', unitId: 'u-113', unitNumber: 'C-401', amount: 120000, date: daysAgo(3), tenantName: 'Neastro Properties', paymentMode: 'Bank Transfer', status: 'PAID', createdAt: daysAgo(3), builderId: 'demo-user-123' },
    { id: 'r-108', unitId: 'u-114', unitNumber: 'C-501', amount: 125000, date: daysAgo(15), tenantName: 'Zoya Khan', paymentMode: 'Bank Transfer', status: 'PAID', createdAt: daysAgo(15), builderId: 'demo-user-123' },

    // Green Valley (Villas)
    { id: 'r-201', unitId: 'u-201', unitNumber: 'Villa-01', amount: 85000, date: daysAgo(12), tenantName: 'Suresh Nair', paymentMode: 'Bank Transfer', status: 'PAID', createdAt: daysAgo(12), builderId: 'demo-user-123' },
    { id: 'r-202', unitId: 'u-202', unitNumber: 'Villa-02', amount: 85000, date: daysAgo(5), tenantName: 'Meera Iyer', paymentMode: 'Cheque', status: 'PAID', createdAt: daysAgo(5), builderId: 'demo-user-123' },
    { id: 'r-204', unitId: 'u-204', unitNumber: 'Villa-04', amount: 90000, date: daysAgo(3), tenantName: 'Arjun Malhotra', paymentMode: 'UPI', status: 'PAID', createdAt: daysAgo(3), builderId: 'demo-user-123' },

    // Ocean View
    { id: 'r-301', unitId: 'u-301', unitNumber: 'G-101', amount: 35000, date: daysAgo(10), tenantName: 'Rajesh Kumar', paymentMode: 'Cash', status: 'PAID', createdAt: daysAgo(10), builderId: 'demo-user-123' },
    { id: 'r-303', unitId: 'u-303', unitNumber: 'F-201', amount: 55000, date: daysAgo(1), tenantName: 'Robert D\'Souza', paymentMode: 'UPI', status: 'PAID', createdAt: daysAgo(1), builderId: 'demo-user-123' },
    { id: 'r-305', unitId: 'u-305', unitNumber: 'S-301', amount: 28000, date: daysAgo(6), tenantName: 'Alex Pereira', paymentMode: 'UPI', status: 'PAID', createdAt: daysAgo(6), builderId: 'demo-user-123' },
    { id: 'r-308', unitId: 'u-308', unitNumber: 'T-402', amount: 70000, date: daysAgo(2), tenantName: 'Karan Johar', paymentMode: 'Bank Transfer', status: 'PAID', createdAt: daysAgo(2), builderId: 'demo-user-123' },

    // --- LAST MONTH (Historical Data) ---
    { id: 'r-prev-1', unitId: 'u-101', unitNumber: 'A-101', amount: 45000, date: daysAgo(32), tenantName: 'Rahul Sharma', paymentMode: 'UPI', status: 'PAID', createdAt: daysAgo(32), builderId: 'demo-user-123' },
    { id: 'r-prev-2', unitId: 'u-103', unitNumber: 'A-103', amount: 60000, date: daysAgo(45), tenantName: 'Amit Verma', paymentMode: 'Bank Transfer', status: 'PAID', createdAt: daysAgo(45), builderId: 'demo-user-123' },
    { id: 'r-prev-3', unitId: 'u-113', unitNumber: 'C-401', amount: 120000, date: daysAgo(33), tenantName: 'Neastro Properties', paymentMode: 'Bank Transfer', status: 'PAID', createdAt: daysAgo(33), builderId: 'demo-user-123' },
    { id: 'r-prev-4', unitId: 'u-201', unitNumber: 'Villa-01', amount: 85000, date: daysAgo(42), tenantName: 'Suresh Nair', paymentMode: 'Bank Transfer', status: 'PAID', createdAt: daysAgo(42), builderId: 'demo-user-123' },

    // --- 2 MONTHS AGO (Historical Data) ---
    { id: 'r-old-1', unitId: 'u-101', unitNumber: 'A-101', amount: 45000, date: daysAgo(62), tenantName: 'Rahul Sharma', paymentMode: 'UPI', status: 'PAID', createdAt: daysAgo(62), builderId: 'demo-user-123' },
    { id: 'r-old-2', unitId: 'u-103', unitNumber: 'A-103', amount: 60000, date: daysAgo(75), tenantName: 'Amit Verma', paymentMode: 'Bank Transfer', status: 'PAID', createdAt: daysAgo(75), builderId: 'demo-user-123' },
    { id: 'r-old-3', unitId: 'u-113', unitNumber: 'C-401', amount: 120000, date: daysAgo(65), tenantName: 'Neastro Properties', paymentMode: 'Bank Transfer', status: 'PAID', createdAt: daysAgo(65), builderId: 'demo-user-123' },
    { id: 'r-old-4', unitId: 'u-201', unitNumber: 'Villa-01', amount: 85000, date: daysAgo(72), tenantName: 'Suresh Nair', paymentMode: 'Bank Transfer', status: 'PAID', createdAt: daysAgo(72), builderId: 'demo-user-123' },
    { id: 'r-old-5', unitId: 'u-114', unitNumber: 'C-501', amount: 125000, date: daysAgo(80), tenantName: 'Zoya Khan', paymentMode: 'Cheque', status: 'PAID', createdAt: daysAgo(80), builderId: 'demo-user-123' },

    // --- 3 MONTHS AGO (Historical Data) ---
    { id: 'r-vold-1', unitId: 'u-113', unitNumber: 'C-401', amount: 120000, date: daysAgo(95), tenantName: 'Neastro Properties', paymentMode: 'Bank Transfer', status: 'PAID', createdAt: daysAgo(95), builderId: 'demo-user-123' },
    { id: 'r-vold-2', unitId: 'u-308', unitNumber: 'T-402', amount: 70000, date: daysAgo(100), tenantName: 'Karan Johar', paymentMode: 'UPI', status: 'PAID', createdAt: daysAgo(100), builderId: 'demo-user-123' },
    { id: 'r-vold-3', unitId: 'u-204', unitNumber: 'Villa-04', amount: 90000, date: daysAgo(110), tenantName: 'Arjun Malhotra', paymentMode: 'Bank Transfer', status: 'PAID', createdAt: daysAgo(110), builderId: 'demo-user-123' },
];

export const mockStaff = [
    {
        id: 'st-1',
        name: 'Suresh Kumar',
        role: 'Site Manager',
        email: 'suresh.k@propvera.com',
        phone: '9876500123',
        salary: '45000',
        createdAt: daysAgo(30)
    },
    {
        id: 'st-2',
        name: 'Ramesh Yadav',
        role: 'Security Guard',
        email: 'ramesh.guard@propvera.com',
        phone: '9876500456',
        salary: '18000',
        createdAt: daysAgo(25)
    },
    {
        id: 'st-3',
        name: 'Anjali Desai',
        role: 'Accountant',
        email: 'anjali.accounts@propvera.com',
        phone: '9876500789',
        salary: '35000',
        createdAt: daysAgo(10)
    },
    {
        id: 'st-4',
        name: 'Vikram Singh',
        role: 'Maintenance Supervisor',
        email: 'vikram.s@propvera.com',
        phone: '9876500111',
        salary: '28000',
        createdAt: daysAgo(5)
    }
];
