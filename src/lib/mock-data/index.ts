/**
 * Mock dataset for query execution simulator
 * Contains realistic sample data with various field types
 */

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  status: "active" | "inactive" | "pending";
  country: string;
  createdAt: string;
  isVerified: boolean;
  purchaseCount: number;
}

export const MOCK_USERS: User[] = [
  {
    id: "USR001",
    name: "Alice Johnson",
    email: "alice@example.com",
    age: 28,
    status: "active",
    country: "Nigeria",
    createdAt: "2024-01-15",
    isVerified: true,
    purchaseCount: 12,
  },
  {
    id: "USR002",
    name: "Bob Smith",
    email: "bob@example.com",
    age: 34,
    status: "active",
    country: "USA",
    createdAt: "2024-02-20",
    isVerified: true,
    purchaseCount: 8,
  },
  {
    id: "USR003",
    name: "Carol White",
    email: "carol@example.com",
    age: 22,
    status: "inactive",
    country: "Canada",
    createdAt: "2024-03-10",
    isVerified: false,
    purchaseCount: 2,
  },
  {
    id: "USR004",
    name: "David Brown",
    email: "david@example.com",
    age: 45,
    status: "active",
    country: "Nigeria",
    createdAt: "2024-01-05",
    isVerified: true,
    purchaseCount: 25,
  },
  {
    id: "USR005",
    name: "Emma Davis",
    email: "emma@example.com",
    age: 31,
    status: "pending",
    country: "UK",
    createdAt: "2024-04-12",
    isVerified: false,
    purchaseCount: 0,
  },
  {
    id: "USR006",
    name: "Frank Miller",
    email: "frank@example.com",
    age: 27,
    status: "active",
    country: "Australia",
    createdAt: "2024-02-08",
    isVerified: true,
    purchaseCount: 15,
  },
  {
    id: "USR007",
    name: "Grace Lee",
    email: "grace@example.com",
    age: 26,
    status: "active",
    country: "Nigeria",
    createdAt: "2024-03-25",
    isVerified: true,
    purchaseCount: 6,
  },
  {
    id: "USR008",
    name: "Henry Wilson",
    email: "henry@example.com",
    age: 52,
    status: "inactive",
    country: "USA",
    createdAt: "2023-12-01",
    isVerified: true,
    purchaseCount: 18,
  },
  {
    id: "USR009",
    name: "Ivy Martinez",
    email: "ivy@example.com",
    age: 24,
    status: "active",
    country: "Nigeria",
    createdAt: "2024-04-01",
    isVerified: false,
    purchaseCount: 3,
  },
  {
    id: "USR010",
    name: "Jack Taylor",
    email: "jack@example.com",
    age: 38,
    status: "active",
    country: "Canada",
    createdAt: "2024-01-20",
    isVerified: true,
    purchaseCount: 20,
  },
  {
    id: "USR011",
    name: "Kate Anderson",
    email: "kate@example.com",
    age: 29,
    status: "pending",
    country: "USA",
    createdAt: "2024-04-05",
    isVerified: false,
    purchaseCount: 1,
  },
  {
    id: "USR012",
    name: "Leo Thomas",
    email: "leo@example.com",
    age: 33,
    status: "active",
    country: "Nigeria",
    createdAt: "2024-02-14",
    isVerified: true,
    purchaseCount: 11,
  },
  {
    id: "USR013",
    name: "Mia Jackson",
    email: "mia@example.com",
    age: 25,
    status: "inactive",
    country: "UK",
    createdAt: "2024-03-30",
    isVerified: false,
    purchaseCount: 4,
  },
  {
    id: "USR014",
    name: "Noah Harris",
    email: "noah@example.com",
    age: 41,
    status: "active",
    country: "Australia",
    createdAt: "2024-01-10",
    isVerified: true,
    purchaseCount: 22,
  },
  {
    id: "USR015",
    name: "Olivia Martin",
    email: "olivia@example.com",
    age: 23,
    status: "active",
    country: "Nigeria",
    createdAt: "2024-04-08",
    isVerified: true,
    purchaseCount: 5,
  },
  {
    id: "USR016",
    name: "Paul Thompson",
    email: "paul@example.com",
    age: 48,
    status: "inactive",
    country: "USA",
    createdAt: "2023-11-15",
    isVerified: true,
    purchaseCount: 30,
  },
  {
    id: "USR017",
    name: "Quinn Garcia",
    email: "quinn@example.com",
    age: 30,
    status: "active",
    country: "Canada",
    createdAt: "2024-02-22",
    isVerified: false,
    purchaseCount: 7,
  },
  {
    id: "USR018",
    name: "Rachel Rodriguez",
    email: "rachel@example.com",
    age: 26,
    status: "pending",
    country: "Nigeria",
    createdAt: "2024-04-10",
    isVerified: false,
    purchaseCount: 0,
  },
  {
    id: "USR019",
    name: "Sam Clark",
    email: "sam@example.com",
    age: 35,
    status: "active",
    country: "UK",
    createdAt: "2024-01-28",
    isVerified: true,
    purchaseCount: 16,
  },
  {
    id: "USR020",
    name: "Tina Lewis",
    email: "tina@example.com",
    age: 27,
    status: "active",
    country: "Australia",
    createdAt: "2024-03-05",
    isVerified: true,
    purchaseCount: 9,
  },
];

/**
 * Get all mock users
 */
export function getAllUsers(): User[] {
  return MOCK_USERS;
}

/**
 * Get user by ID
 */
export function getUserById(id: string): User | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}
