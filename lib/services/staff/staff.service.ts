// ─── Staff Service Interface ─────────────────────────────────────────────────

import { ApiStaffService } from './staff.service.api';

// Re-export types from the authoritative source so callers get the full type
export type { StaffMember, StaffStatus } from '@/lib/data/mockStaff';
import type { StaffMember, StaffStatus } from '@/lib/data/mockStaff';
import type { StaffRole } from '@/types/order';

export interface StaffUser {
    id: string;
    name: string;
    role: StaffRole;
    branch: string;
}

export interface StaffFilter {
    branchId?: string;
    role?: StaffRole;
    status?: StaffStatus;
}

export interface StaffService {
    resolveByCredentials(identifier: string, password: string): Promise<StaffUser | null>;
    resolveByPin(pin: string): Promise<StaffMember | null>;
    getAll(filter?: StaffFilter): Promise<StaffMember[]>;
    getById(id: string): Promise<StaffMember | null>;
}

// ─── Factory ─────────────────────────────────────────────────────────────────

let _instance: StaffService | null = null;

export function getStaffService(): StaffService {
    if (!_instance) {
        _instance = new ApiStaffService();
    }
    return _instance;
}
