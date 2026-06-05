export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  level: "junior" | "mid" | "senior" | "lead";
  salary: number;
  remote: boolean;
  status: "open" | "closed" | "paused";
  postedAt: string;
  applicantCount: number;
}

export const MOCK_JOBS: Job[] = [
  { id: "JOB001", title: "Frontend Engineer", company: "Paystack", location: "Lagos", type: "full-time", level: "mid", salary: 120000, remote: true, status: "open", postedAt: "2024-03-01", applicantCount: 84 },
  { id: "JOB002", title: "Backend Engineer", company: "Flutterwave", location: "Lagos", type: "full-time", level: "senior", salary: 180000, remote: false, status: "open", postedAt: "2024-03-05", applicantCount: 62 },
  { id: "JOB003", title: "Product Designer", company: "Cowrywise", location: "Abuja", type: "full-time", level: "mid", salary: 95000, remote: true, status: "open", postedAt: "2024-02-20", applicantCount: 47 },
  { id: "JOB004", title: "DevOps Engineer", company: "PiggyVest", location: "Lagos", type: "full-time", level: "senior", salary: 160000, remote: true, status: "closed", postedAt: "2024-01-15", applicantCount: 110 },
  { id: "JOB005", title: "Data Analyst", company: "Kuda Bank", location: "Lagos", type: "full-time", level: "junior", salary: 70000, remote: false, status: "open", postedAt: "2024-03-10", applicantCount: 130 },
  { id: "JOB006", title: "Mobile Engineer (iOS)", company: "Carbon", location: "Lagos", type: "full-time", level: "mid", salary: 140000, remote: true, status: "open", postedAt: "2024-03-08", applicantCount: 39 },
  { id: "JOB007", title: "Technical Writer", company: "Andela", location: "Remote", type: "contract", level: "mid", salary: 85000, remote: true, status: "open", postedAt: "2024-02-28", applicantCount: 55 },
  { id: "JOB008", title: "QA Engineer", company: "Interswitch", location: "Lagos", type: "full-time", level: "junior", salary: 65000, remote: false, status: "paused", postedAt: "2024-02-10", applicantCount: 23 },
  { id: "JOB009", title: "ML Engineer", company: "Flutterwave", location: "Lagos", type: "full-time", level: "senior", salary: 200000, remote: true, status: "open", postedAt: "2024-03-12", applicantCount: 71 },
  { id: "JOB010", title: "Engineering Manager", company: "Paystack", location: "Lagos", type: "full-time", level: "lead", salary: 250000, remote: false, status: "open", postedAt: "2024-03-14", applicantCount: 18 },
  { id: "JOB011", title: "UI/UX Designer", company: "Kuda Bank", location: "Abuja", type: "full-time", level: "junior", salary: 60000, remote: true, status: "open", postedAt: "2024-03-15", applicantCount: 92 },
  { id: "JOB012", title: "Backend Engineer", company: "PiggyVest", location: "Lagos", type: "full-time", level: "mid", salary: 130000, remote: true, status: "open", postedAt: "2024-03-03", applicantCount: 44 },
  { id: "JOB013", title: "Data Engineer", company: "Cowrywise", location: "Lagos", type: "full-time", level: "senior", salary: 175000, remote: false, status: "closed", postedAt: "2024-01-20", applicantCount: 35 },
  { id: "JOB014", title: "Frontend Intern", company: "Carbon", location: "Lagos", type: "internship", level: "junior", salary: 35000, remote: false, status: "open", postedAt: "2024-03-16", applicantCount: 210 },
  { id: "JOB015", title: "Security Engineer", company: "Interswitch", location: "Lagos", type: "full-time", level: "senior", salary: 190000, remote: false, status: "open", postedAt: "2024-02-25", applicantCount: 28 },
  { id: "JOB016", title: "Product Manager", company: "Andela", location: "Remote", type: "full-time", level: "lead", salary: 220000, remote: true, status: "open", postedAt: "2024-03-11", applicantCount: 76 },
  { id: "JOB017", title: "Cloud Architect", company: "Flutterwave", location: "Lagos", type: "contract", level: "lead", salary: 300000, remote: true, status: "paused", postedAt: "2024-02-05", applicantCount: 12 },
  { id: "JOB018", title: "Full Stack Engineer", company: "Paystack", location: "Lagos", type: "full-time", level: "mid", salary: 145000, remote: true, status: "open", postedAt: "2024-03-17", applicantCount: 98 },
  { id: "JOB019", title: "Business Analyst", company: "Kuda Bank", location: "Abuja", type: "full-time", level: "junior", salary: 55000, remote: false, status: "open", postedAt: "2024-03-18", applicantCount: 143 },
  { id: "JOB020", title: "Site Reliability Engineer", company: "PiggyVest", location: "Lagos", type: "full-time", level: "senior", salary: 185000, remote: true, status: "open", postedAt: "2024-03-19", applicantCount: 31 },
];
