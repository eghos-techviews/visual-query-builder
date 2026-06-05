export interface Applicant {
  id: string;
  name: string;
  email: string;
  role: string;
  experience: number;
  skills: string;
  location: string;
  status: "applied" | "screening" | "interview" | "offer" | "rejected";
  source: "linkedin" | "referral" | "direct" | "job-board";
  appliedAt: string;
  salaryExpectation: number;
  available: boolean;
}

export const MOCK_APPLICANTS: Applicant[] = [
  { id: "APP001", name: "Chidi Okeke", email: "chidi@gmail.com", role: "Frontend Engineer", experience: 3, skills: "React, TypeScript, CSS", location: "Lagos", status: "interview", source: "linkedin", appliedAt: "2024-03-01", salaryExpectation: 120000, available: true },
  { id: "APP002", name: "Amara Obi", email: "amara@gmail.com", role: "Backend Engineer", experience: 5, skills: "Node.js, PostgreSQL, AWS", location: "Abuja", status: "offer", source: "referral", appliedAt: "2024-03-02", salaryExpectation: 180000, available: true },
  { id: "APP003", name: "Tunde Adeyemi", email: "tunde@gmail.com", role: "Data Analyst", experience: 2, skills: "Python, SQL, Tableau", location: "Lagos", status: "applied", source: "job-board", appliedAt: "2024-03-10", salaryExpectation: 75000, available: true },
  { id: "APP004", name: "Ngozi Eze", email: "ngozi@gmail.com", role: "Product Designer", experience: 4, skills: "Figma, Sketch, Research", location: "Lagos", status: "screening", source: "linkedin", appliedAt: "2024-03-05", salaryExpectation: 100000, available: false },
  { id: "APP005", name: "Emeka Nwosu", email: "emeka@gmail.com", role: "DevOps Engineer", experience: 6, skills: "Kubernetes, Terraform, CI/CD", location: "Lagos", status: "rejected", source: "direct", appliedAt: "2024-02-20", salaryExpectation: 160000, available: true },
  { id: "APP006", name: "Fatima Bello", email: "fatima@gmail.com", role: "Mobile Engineer", experience: 3, skills: "React Native, Swift, Kotlin", location: "Kano", status: "applied", source: "linkedin", appliedAt: "2024-03-12", salaryExpectation: 130000, available: true },
  { id: "APP007", name: "Seun Alade", email: "seun@gmail.com", role: "ML Engineer", experience: 4, skills: "Python, TensorFlow, MLOps", location: "Lagos", status: "interview", source: "referral", appliedAt: "2024-03-08", salaryExpectation: 190000, available: false },
  { id: "APP008", name: "Kemi Adediran", email: "kemi@gmail.com", role: "QA Engineer", experience: 2, skills: "Cypress, Jest, Selenium", location: "Ibadan", status: "screening", source: "job-board", appliedAt: "2024-03-15", salaryExpectation: 65000, available: true },
  { id: "APP009", name: "Obinna Ihejirika", email: "obinna@gmail.com", role: "Engineering Manager", experience: 8, skills: "Leadership, Agile, System Design", location: "Lagos", status: "applied", source: "linkedin", appliedAt: "2024-03-16", salaryExpectation: 250000, available: true },
  { id: "APP010", name: "Bisi Olanrewaju", email: "bisi@gmail.com", role: "Full Stack Engineer", experience: 4, skills: "React, Django, Docker", location: "Lagos", status: "offer", source: "direct", appliedAt: "2024-03-03", salaryExpectation: 140000, available: true },
  { id: "APP011", name: "Dami Falola", email: "dami@gmail.com", role: "Frontend Engineer", experience: 1, skills: "React, JavaScript, HTML/CSS", location: "Lagos", status: "rejected", source: "job-board", appliedAt: "2024-03-17", salaryExpectation: 60000, available: true },
  { id: "APP012", name: "Yemi Lawson", email: "yemi@gmail.com", role: "Backend Engineer", experience: 7, skills: "Go, Kafka, Redis", location: "Lagos", status: "interview", source: "referral", appliedAt: "2024-03-04", salaryExpectation: 200000, available: false },
  { id: "APP013", name: "Ify Okonkwo", email: "ify@gmail.com", role: "Data Engineer", experience: 5, skills: "Spark, dbt, Airflow", location: "Enugu", status: "screening", source: "linkedin", appliedAt: "2024-03-09", salaryExpectation: 170000, available: true },
  { id: "APP014", name: "Tobi Adesina", email: "tobi@gmail.com", role: "Security Engineer", experience: 6, skills: "Pentesting, SOC, SIEM", location: "Lagos", status: "applied", source: "direct", appliedAt: "2024-03-18", salaryExpectation: 185000, available: true },
  { id: "APP015", name: "Chiamaka Udeh", email: "chiamaka@gmail.com", role: "Product Manager", experience: 5, skills: "Roadmapping, Analytics, Agile", location: "Lagos", status: "interview", source: "linkedin", appliedAt: "2024-03-06", salaryExpectation: 220000, available: false },
  { id: "APP016", name: "Ade Martins", email: "ade@gmail.com", role: "Frontend Intern", experience: 0, skills: "HTML, CSS, JavaScript", location: "Lagos", status: "applied", source: "job-board", appliedAt: "2024-03-19", salaryExpectation: 35000, available: true },
  { id: "APP017", name: "Sade Ogundimu", email: "sade@gmail.com", role: "UI/UX Designer", experience: 3, skills: "Figma, Prototyping, User Research", location: "Abuja", status: "screening", source: "referral", appliedAt: "2024-03-13", salaryExpectation: 95000, available: true },
  { id: "APP018", name: "Femi Adeola", email: "femi@gmail.com", role: "Cloud Architect", experience: 9, skills: "AWS, GCP, Azure", location: "Lagos", status: "offer", source: "linkedin", appliedAt: "2024-03-07", salaryExpectation: 290000, available: false },
  { id: "APP019", name: "Zara Ibrahim", email: "zara@gmail.com", role: "Business Analyst", experience: 2, skills: "SQL, Excel, Power BI", location: "Kano", status: "applied", source: "job-board", appliedAt: "2024-03-20", salaryExpectation: 55000, available: true },
  { id: "APP020", name: "Kunle Obi", email: "kunle@gmail.com", role: "Site Reliability Engineer", experience: 6, skills: "Linux, Prometheus, Grafana", location: "Lagos", status: "interview", source: "referral", appliedAt: "2024-03-11", salaryExpectation: 180000, available: true },
];
