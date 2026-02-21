export interface User {
  username: string;
  name: string;
  state: string;
  district: string;
  landArea: string; // Stored as string to handle inputs easily, but represents number
  income: string;   // Stored as string
  crops: string[];
  email?: string;
  age?: number;
}
