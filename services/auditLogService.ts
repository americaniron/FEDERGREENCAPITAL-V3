
import { AuditLogEntry } from '../types';

const AUDIT_LOG_KEY = 'fc_audit_log';

export const auditLogService = {
    logChange: (
        adminEmail: string,
        action: string,
        entity: string,
        before: any,
        after: any
    ) => {
        const logs = auditLogService.getLogs();
        const newLog: AuditLogEntry = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            adminEmail,
            action,
            entity,
            details: { before, after }
        };
        logs.unshift(newLog); // Add to the beginning
        localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));
    },

    getLogs: (): AuditLogEntry[] => {
        const data = localStorage.getItem(AUDIT_LOG_KEY);
        return data ? JSON.parse(data) : [];
    }
};
