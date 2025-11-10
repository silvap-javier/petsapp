import Constants from "expo-constants";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const API_URL =
  (Constants?.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:3000";

export type UserRole = "GUARDIAN" | "SITTER" | "ORGANIZATION_OWNER";
export type PetGuardianRole = "PRIMARY_OWNER" | "CO_OWNER" | "CARETAKER";
export type CaretakerStatus = "PENDING" | "ACTIVE" | "INACTIVE";
export type OrganizationPetStatus = "ACTIVE" | "ARCHIVED";

export type UserSummary = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
};

export type PetGuardian = {
  id: string;
  role: PetGuardianRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: UserSummary | null;
};

export type PetCaretaker = {
  id: string;
  status: CaretakerStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  sitter: UserSummary | null;
};

export type PetOrganization = {
  id: string;
  status: OrganizationPetStatus;
  createdAt: string;
  updatedAt: string;
  organization: {
    id: string;
    name: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type Pet = {
  id: string;
  name: string;
  species?: string | null;
  type?: string | null;
  breed?: string | null;
  color?: string | null;
  weightKg?: number | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  primaryOwner: UserSummary | null;
  guardians: PetGuardian[];
  caretakers: PetCaretaker[];
  organizations: PetOrganization[];
};

export type LoginResponse = {
  accessToken: string;
  user: UserSummary;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type CreateUserResponse = UserSummary;

export type CreatePetInput = {
  name: string;
  type?: string;
  breed?: string;
  color?: string;
  weightKg?: number;
  description?: string;
  primaryOwnerId?: string;
};

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return fetchJSON<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function registerUser(payload: CreateUserInput): Promise<CreateUserResponse> {
  return fetchJSON<CreateUserResponse>("/users", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function createPet(payload: CreatePetInput & { species?: string; caretakerIds?: string[]; organizationIds?: string[] }) {
  return fetchJSON<Pet>("/pets", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function usePets(): UseQueryResult<Pet[]> {
  return useQuery({
    queryKey: ["pets"],
    queryFn: () => fetchJSON<Pet[]>("/pets")
  });
}

export function usePet(id: string): UseQueryResult<Pet> {
  return useQuery({
    queryKey: ["pets", id],
    queryFn: () => fetchJSON<Pet>(`/pets/${id}`),
    enabled: !!id
  });
}
