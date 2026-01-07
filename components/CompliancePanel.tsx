
import React from 'react';
import { AuditEntry, DocumentVersion, UserRole } from '../types';
import { ShieldCheck, History, Clock, User, Info, Save } from 'lucide-react';

interface CompliancePanelProps {
  auditLogs: AuditEntry[];
  versions: DocumentVersion[];
  userRole: UserRole;
  onRestoreVersion: (version: DocumentVersion) => void;
}

export const CompliancePanel: React.FC<CompliancePanelProps> = ({ 
  auditLogs, 
  versions, 
  userRole, 
  onRestoreVersion 
}) => {
  return (
    <div className="flex flex-col h-full bg-white border-l w-96 no-print overflow-hidden shadow-2xl">
      <div className="p-6 border-b bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-blue-600" size={20} />
          <h2 className="font-bold text-slate-800">Compliance & Safety</h2>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
          userRole === 'Admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
        }`}>
          {userRole} Mode
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Version History Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <History size={16} className="text-slate-400" />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Version History</h3>
          </div>
          <div className="space-y-3">
            {versions.length === 0 ? (
              <div className="text-[11px] text-slate-400 italic bg-slate-50 p-4 rounded-lg border border-dashed text-center">
                No versions saved yet. Use the "Save Version" action.
              </div>
            ) : (
              versions.map((v) => (
                <div key={v.id} className="p-3 border rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Version {v.version}.0</span>
                    <button 
                      onClick={() => onRestoreVersion(v)}
                      className="text-[10px] text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase underline"
                    >
                      Restore
                    </button>
                  </div>
                  <div className="text-xs font-medium text-slate-700 truncate mb-1">
                    {v.data.clientName || 'Untitled Document'}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Clock size={10} />
                    {new Date(v.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Audit Trail Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-slate-400" />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Audit Trail</h3>
          </div>
          <div className="relative border-l-2 border-slate-100 ml-2 pl-4 space-y-6">
            {auditLogs.map((log) => (
              <div key={log.id} className="relative">
                <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-slate-300 border-2 border-white" />
                <div className="flex flex-col gap-0.5">
                  <div className="text-[10px] font-bold text-slate-800 uppercase leading-none">{log.action}</div>
                  <div className="text-[11px] text-slate-500 mb-1">{log.details}</div>
                  <div className="flex items-center gap-3 text-[9px] font-medium text-slate-400 uppercase">
                    <span className="flex items-center gap-1"><User size={8} /> {log.user}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Locked Language Notice */}
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <div className="flex gap-2 mb-2">
            <Info size={16} className="text-amber-600 shrink-0" />
            <h4 className="text-[11px] font-bold text-amber-900 uppercase">Legal Integrity Notice</h4>
          </div>
          <p className="text-[10px] text-amber-800 leading-normal">
            LexiForge enforces <span className="font-bold">Immutable Core Clauses</span>. 
            Standard jurisdictional language and definitions cannot be modified by non-admin users to ensure legal validity.
          </p>
        </div>
      </div>
    </div>
  );
};
