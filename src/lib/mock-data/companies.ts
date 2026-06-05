export interface Company {
  id: string;
  name: string;
  industry: string;
  size: "1-10" | "11-50" | "51-200" | "201-500" | "500+";
  location: string;
  country: string;
  rating: number;
  openRoles: number;
  founded: number;
  remote: boolean;
  verified: boolean;
}

export const MOCK_COMPANIES: Company[] = [
  { id: "CMP001", name: "Paystack", industry: "Fintech", size: "201-500", location: "Lagos", country: "Nigeria", rating: 4.7, openRoles: 12, founded: 2015, remote: true, verified: true },
  { id: "CMP002", name: "Flutterwave", industry: "Fintech", size: "201-500", location: "Lagos", country: "Nigeria", rating: 4.4, openRoles: 8, founded: 2016, remote: true, verified: true },
  { id: "CMP003", name: "Andela", industry: "Tech Talent", size: "500+", location: "New York", country: "USA", rating: 4.2, openRoles: 25, founded: 2014, remote: true, verified: true },
  { id: "CMP004", name: "Cowrywise", industry: "Fintech", size: "51-200", location: "Lagos", country: "Nigeria", rating: 4.5, openRoles: 5, founded: 2017, remote: false, verified: true },
  { id: "CMP005", name: "Kuda Bank", industry: "Banking", size: "201-500", location: "Lagos", country: "Nigeria", rating: 4.1, openRoles: 7, founded: 2019, remote: false, verified: true },
  { id: "CMP006", name: "PiggyVest", industry: "Fintech", size: "51-200", location: "Lagos", country: "Nigeria", rating: 4.6, openRoles: 4, founded: 2016, remote: true, verified: true },
  { id: "CMP007", name: "Carbon", industry: "Lending", size: "51-200", location: "Lagos", country: "Nigeria", rating: 3.9, openRoles: 6, founded: 2012, remote: false, verified: true },
  { id: "CMP008", name: "Interswitch", industry: "Payments", size: "500+", location: "Lagos", country: "Nigeria", rating: 3.7, openRoles: 15, founded: 2002, remote: false, verified: true },
  { id: "CMP009", name: "TechCabal", industry: "Media", size: "11-50", location: "Lagos", country: "Nigeria", rating: 4.0, openRoles: 3, founded: 2012, remote: true, verified: false },
  { id: "CMP010", name: "Mono", industry: "Open Finance", size: "11-50", location: "Lagos", country: "Nigeria", rating: 4.8, openRoles: 9, founded: 2020, remote: true, verified: true },
  { id: "CMP011", name: "Risevest", industry: "Fintech", size: "11-50", location: "Lagos", country: "Nigeria", rating: 4.3, openRoles: 2, founded: 2019, remote: true, verified: false },
  { id: "CMP012", name: "Stears", industry: "Data & Analytics", size: "11-50", location: "Lagos", country: "Nigeria", rating: 4.5, openRoles: 4, founded: 2018, remote: true, verified: true },
  { id: "CMP013", name: "SeamlessHR", industry: "HR Tech", size: "51-200", location: "Lagos", country: "Nigeria", rating: 4.1, openRoles: 6, founded: 2018, remote: false, verified: true },
  { id: "CMP014", name: "Helium Health", industry: "Health Tech", size: "51-200", location: "Lagos", country: "Nigeria", rating: 4.4, openRoles: 7, founded: 2016, remote: false, verified: true },
  { id: "CMP015", name: "Termii", industry: "Communication APIs", size: "11-50", location: "Lagos", country: "Nigeria", rating: 4.2, openRoles: 3, founded: 2019, remote: true, verified: true },
  { id: "CMP016", name: "Buycoins", industry: "Crypto", size: "11-50", location: "Lagos", country: "Nigeria", rating: 3.8, openRoles: 2, founded: 2017, remote: true, verified: false },
  { id: "CMP017", name: "Farmcrowdy", industry: "Agritech", size: "51-200", location: "Lagos", country: "Nigeria", rating: 3.6, openRoles: 1, founded: 2016, remote: false, verified: false },
  { id: "CMP018", name: "Patricia", industry: "Crypto", size: "11-50", location: "Lagos", country: "Nigeria", rating: 3.5, openRoles: 0, founded: 2018, remote: false, verified: false },
  { id: "CMP019", name: "Brass", industry: "Banking", size: "11-50", location: "Lagos", country: "Nigeria", rating: 4.3, openRoles: 5, founded: 2020, remote: true, verified: true },
  { id: "CMP020", name: "Eden Life", industry: "Lifestyle", size: "51-200", location: "Lagos", country: "Nigeria", rating: 4.0, openRoles: 3, founded: 2019, remote: false, verified: true },
];
