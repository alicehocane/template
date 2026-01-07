
import React from 'react';
import { DocType } from '../types';
import { DOC_TEMPLATES } from '../constants';
import { FileText, ChevronRight, Gavel, Scale, Receipt, FileSearch } from 'lucide-react';

interface SidebarProps {
  currentDoc: DocType;
  onSelectDoc: (id: DocType) => void;
}

const getIcon = (id: DocType) => {
  switch (id) {
    case 'retainer': return <Gavel size={20} />;
    case 'end_rep': return <Scale size={20} />;
    case 'collection': return <Receipt size={20} />;
    case 'fdd_review': return <FileSearch size={20} />;
    default: return <FileText size={20} />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ currentDoc, onSelectDoc }) => {
  return (
    <div className="w-80 border-r bg-slate-900 text-white h-screen flex flex-col no-print">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Scale className="text-blue-400" />
          LexiForge
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Document Automation</p>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <h2 className="px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Initial Templates</h2>
        <nav className="space-y-1">
          {DOC_TEMPLATES.map((doc) => (
            <button
              key={doc.id}
              onClick={() => onSelectDoc(doc.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-all ${
                currentDoc === doc.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className={currentDoc === doc.id ? 'text-white' : 'text-slate-500'}>
                {getIcon(doc.id)}
              </span>
              <div className="flex-1">
                <div className="font-medium">{doc.name}</div>
                <div className={`text-[10px] leading-tight mt-0.5 ${currentDoc === doc.id ? 'text-blue-100' : 'text-slate-500'}`}>
                  {doc.description}
                </div>
              </div>
              {currentDoc === doc.id && <ChevronRight size={16} />}
            </button>
          ))}
        </nav>

        <div className="mt-8 px-6">
          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
            <h3 className="text-xs font-semibold text-blue-400 uppercase mb-2">Pro Tip</h3>
            <p className="text-[11px] text-slate-300">
              Fill common fields like <span className="text-white italic">Client Name</span> once; they propagate across all document types.
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6 border-t border-slate-700 text-[10px] text-slate-500 text-center">
        &copy; 2024 LexiForge Legal Systems v1.0
      </div>
    </div>
  );
};
