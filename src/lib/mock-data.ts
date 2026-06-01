export type MockRecord = {
  id: number;
  name: string;
  age: number;
  email: string;
  status: string;
  country: string;
  createdAt: string;
  verified: boolean;
};

export const MOCK_DATA: MockRecord[] = [
  { id: 1,  name: "Amara Osei",      age: 24, email: "amara@mail.com",   status: "active",   country: "Ghana",        createdAt: "2023-03-12", verified: true  },
  { id: 2,  name: "Chidi Nwosu",     age: 17, email: "chidi@mail.com",   status: "inactive", country: "Nigeria",      createdAt: "2022-11-05", verified: false },
  { id: 3,  name: "Fatima El-Amin",  age: 31, email: "fatima@mail.com",  status: "active",   country: "Egypt",        createdAt: "2023-07-19", verified: true  },
  { id: 4,  name: "Kofi Mensah",     age: 22, email: "kofi@mail.com",    status: "pending",  country: "Ghana",        createdAt: "2024-01-08", verified: false },
  { id: 5,  name: "Ngozi Adeyemi",   age: 28, email: "ngozi@mail.com",   status: "active",   country: "Nigeria",      createdAt: "2023-09-30", verified: true  },
  { id: 6,  name: "Tariq Salim",     age: 35, email: "tariq@mail.com",   status: "active",   country: "Egypt",        createdAt: "2022-06-14", verified: true  },
  { id: 7,  name: "Zara Kimani",     age: 19, email: "zara@mail.com",    status: "inactive", country: "Kenya",        createdAt: "2024-02-27", verified: false },
  { id: 8,  name: "Emeka Okafor",    age: 42, email: "emeka@mail.com",   status: "active",   country: "Nigeria",      createdAt: "2021-12-01", verified: true  },
  { id: 9,  name: "Ama Darko",       age: 26, email: "ama@mail.com",     status: "pending",  country: "Ghana",        createdAt: "2023-05-17", verified: true  },
  { id: 10, name: "Sipho Dlamini",   age: 33, email: "sipho@mail.com",   status: "active",   country: "South Africa", createdAt: "2022-08-22", verified: false },
  { id: 11, name: "Aisha Musa",      age: 15, email: "aisha@mail.com",   status: "inactive", country: "Nigeria",      createdAt: "2024-03-11", verified: false },
  { id: 12, name: "Kwame Asante",    age: 29, email: "kwame@mail.com",   status: "active",   country: "Ghana",        createdAt: "2023-10-05", verified: true  },
  { id: 13, name: "Leila Hassan",    age: 38, email: "leila@mail.com",   status: "active",   country: "Egypt",        createdAt: "2021-04-18", verified: true  },
  { id: 14, name: "Tunde Bakare",    age: 21, email: "tunde@mail.com",   status: "pending",  country: "Nigeria",      createdAt: "2024-04-02", verified: false },
  { id: 15, name: "Nadia Okonkwo",   age: 44, email: "nadia@mail.com",   status: "active",   country: "South Africa", createdAt: "2020-09-09", verified: true  },
];
