
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { WizardForm } from './components/WizardForm';
import { DocPreview } from './components/DocPreview';
import { CompliancePanel } from './components/CompliancePanel';
import { DocType, FormData, INITIAL_FORM_DATA, AuditEntry, DocumentVersion, UserRole } from './types';
import { Settings, HelpCircle, UserCircle, Bell, ShieldCheck, Database, Save, FileEdit, FileCheck } from 'lucide-react';

const App: React.FC = () => {
  const [currentDoc, setCurrentDoc] = useState<DocType>('retainer');
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [userRole, setUserRole] = useState<UserRole>('Admin');
  const [showCompliance, setShowCompliance] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  
  // Compliance & History States
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const lastSavedRef = useRef<string>(JSON.stringify(INITIAL_FORM_DATA));

  // Utility to add audit log
  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      user: userRole === 'Admin' ? 'Admin (Legal Lead)' : 'Associate (Drafting)',
      action,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const handleFormChange = (newData: Partial<FormData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      if (newData.clientName !== undefined) addAuditLog('Modified Field', `Updated Client Name: ${newData.clientName}`);
      if (newData.jurisdiction !== undefined) addAuditLog('Jurisdiction Change', `Applied rules for: ${newData.jurisdiction}`);
      return updated;
    });
  };

  const handleSaveVersion = () => {
    const newVersion: DocumentVersion = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      data: { ...formData },
      docType: currentDoc,
      version: versions.length + 1,
    };
    setVersions(prev => [newVersion, ...prev]);
    addAuditLog('Saved Version', `Created Version ${newVersion.version}.0`);
    lastSavedRef.current = JSON.stringify(formData);
  };

  const handleRestoreVersion = (v: DocumentVersion) => {
    setFormData(v.data);
    setCurrentDoc(v.docType);
    addAuditLog('Restored Version', `Reverted to Version ${v.version}.0`);
  };

  const toggleRole = () => {
    const newRole = userRole === 'Admin' ? 'Legal Associate' : 'Admin';
    setUserRole(newRole);
    addAuditLog('Security Elevation', `Switched to ${newRole}`);
  };

  useEffect(() => {
    addAuditLog('Session Initiated', 'LexiForge secure session started.');
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <Sidebar currentDoc={currentDoc} onSelectDoc={setCurrentDoc} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 no-print z-20">
          <div className="flex items-center gap-4">
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">LexiForge Workspace</h2>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 uppercase">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isFinal ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                Status: <span className={isFinal ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>{isFinal ? 'Final Review' : 'Drafting'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsFinal(!isFinal)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all border ${
                isFinal ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {isFinal ? <FileCheck size={14} /> : <FileEdit size={14} />}
              {isFinal ? 'Lock Draft' : 'Unlock Draft'}
            </button>

            <button 
              onClick={handleSaveVersion}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase hover:bg-blue-100 transition-colors"
            >
              <Save size={14} />
              Save Version
            </button>

            <div className="h-6 w-px bg-slate-200" />

            <button 
              onClick={() => setShowCompliance(!showCompliance)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                showCompliance ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Database size={14} />
              Compliance Logs
            </button>

            <div className="h-6 w-px bg-slate-200" />
            
            <div className="flex items-center gap-3">
              <button onClick={toggleRole} className="text-right group cursor-pointer">
                <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">John Legal, Esq.</div>
                <div className={`text-[9px] font-bold uppercase tracking-tighter ${userRole === 'Admin' ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {userRole} &bull; Click to switch
                </div>
              </button>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 shadow-inner">
                <UserCircle size={20} />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-[40%] overflow-y-auto p-8 border-r bg-slate-50/50 no-print">
            <div className="max-w-xl mx-auto">
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Document Designer</h1>
                  <p className="text-sm text-slate-500 italic">Secure document generation active.</p>
                </div>
                {userRole === 'Admin' && (
                  <div className="bg-indigo-50 text-indigo-700 p-2 rounded-lg" title="Admin features active">
                    <ShieldCheck size={18} />
                  </div>
                )}
              </div>
              
              <div className={isFinal ? 'opacity-50 pointer-events-none' : ''}>
                <WizardForm 
                  data={formData} 
                  onChange={handleFormChange} 
                  docType={currentDoc} 
                />
              </div>

              {isFinal && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
                  <HelpCircle className="text-amber-600 shrink-0" size={20} />
                  <p className="text-xs text-amber-800">
                    Draft is locked for final review. Click <strong>Unlock Draft</strong> above to make further edits.
                  </p>
                </div>
              )}
              
              <div className="mt-8 p-4 bg-slate-800 rounded-2xl shadow-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-600/20 p-1.5 rounded-lg">
                    <HelpCircle size={16} className="text-blue-400" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Note</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Exporting to Word will create an editable document. Always perform a final legal review before transmitting to a client.
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-slate-100 h-full relative">
            <DocPreview docType={currentDoc} data={formData} />
          </div>

          {showCompliance && (
            <div className="animate-in slide-in-from-right duration-300">
              <CompliancePanel 
                auditLogs={auditLogs} 
                versions={versions} 
                userRole={userRole}
                onRestoreVersion={handleRestoreVersion}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
