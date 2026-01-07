
import React, { useState, useMemo, useRef } from 'react';
import { DocType, FormData, DocSection } from '../types';
import { DOC_TEMPLATES } from '../constants';
import { FileDown, Download, Sparkles, Loader2, Zap, Lock, ShieldCheck, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { explainClause } from '../services/gemini';

interface DocPreviewProps {
  docType: DocType;
  data: FormData;
}

export const DocPreview: React.FC<DocPreviewProps> = ({ docType, data }) => {
  const [explainingId, setExplainingId] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const docRef = useRef<HTMLDivElement>(null);

  const template = useMemo(() => DOC_TEMPLATES.find(t => t.id === docType), [docType]);
  if (!template) return null;

  const replacePlaceholders = (text: string) => {
    let result = text;
    const placeholders: Record<string, string | undefined> = {
      clientName: data.clientName || '[CLIENT NAME]',
      clientAddress: data.clientAddress || '[CLIENT ADDRESS]',
      firmName: data.firmName,
      attorneyName: data.attorneyName,
      effectiveDate: data.effectiveDate,
      matterDescription: data.matterDescription || '[MATTER DESCRIPTION]',
      jurisdiction: data.jurisdiction,
      hourlyRate: data.hourlyRate,
      retainerAmount: data.retainerAmount,
      flatFeeAmount: data.flatFeeAmount,
      totalDebt: data.totalDebt || '[AMOUNT]',
      dueDate: data.dueDate || '[DUE DATE]',
    };

    Object.entries(placeholders).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value || '');
    });

    return result;
  };

  const activeSections = useMemo(() => {
    return template.sections.filter(section => {
      if (section.condition) return section.condition(data);
      return true;
    });
  }, [template, data]);

  const missingFields = useMemo(() => {
    return template.requiredFields.filter(field => !data[field]);
  }, [template, data]);

  const isComplete = missingFields.length === 0;

  const handleExplain = async (section: DocSection) => {
    if (explainingId === section.id) {
      setExplainingId(null);
      setAiExplanation(null);
      return;
    }
    setExplainingId(section.id);
    setIsLoadingAi(true);
    const explanation = await explainClause(section.title, section.content);
    setAiExplanation(explanation);
    setIsLoadingAi(false);
  };

  // High Fidelity PDF Download - Fixed whitespace and page spillover
  const downloadPdf = () => {
    if (!docRef.current) return;
    const element = docRef.current;
    
    const opt = {
      margin: [10, 10, 10, 10], // Tighter margins for better fit
      filename: `${template.name}_${data.clientName || 'Draft'}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        scrollY: 0 // Ensure it starts from top of element
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all'] }
    };

    // @ts-ignore - html2pdf is global
    window.html2pdf().from(element).set(opt).save();
  };

  const downloadDoc = () => {
    const filename = `${template.name}_${data.clientName || 'Draft'}.doc`;
    
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${template.name}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page WordSection1 {
            size: 595.3pt 841.9pt;
            margin: 72.0pt 72.0pt 72.0pt 72.0pt;
            mso-header-margin: 35.4pt;
            mso-footer-margin: 35.4pt;
            mso-header: h1;
            mso-footer: f1;
          }
          div.WordSection1 { page: WordSection1; }
          table#hrdftrtbl { margin: 0in 0in 0in 900in; width: 1px; height: 1px; overflow: hidden; }
          .header-text { font-family: 'Arial'; font-size: 10pt; color: #666666; }
          .footer-text { font-family: 'Arial'; font-size: 8pt; color: #999999; text-align: center; }
        </style>
      </head>
      <body>
        <div class="WordSection1">
    `;

    const headerFooterDefs = `
      <table id='hrdftrtbl' border='0' cellspacing='0' cellpadding='0'>
        <tr>
          <td>
            <div style='mso-element:header' id='h1'>
              <p class='header-text' style='text-align:left;'>
                ${data.firmName} &bull; ${data.jurisdiction}
                <span style='float:right;'>${new Date().toLocaleDateString()}</span>
              </p>
              <div style='border-bottom: 0.5pt solid #000; margin-bottom: 10pt;'></div>
            </div>
          </td>
          <td>
            <div style='mso-element:footer' id='f1'>
              <div style='border-top: 0.5pt solid #ddd; margin-top: 5pt;'></div>
              <p class='footer-text'>
                Generated by LexiForge Document Automation &bull; Confidential &bull; Page <span style='mso-field-code:" PAGE "'></span> of <span style='mso-field-code:" NUMPAGES "'></span>
              </p>
            </div>
          </td>
        </tr>
      </table>
    `;

    let bodyContent = `
      <div style="text-align: center; margin-bottom: 15px;">
        <h1 style="font-family: 'Times New Roman'; font-size: 16pt; text-transform: uppercase;">${template.name}</h1>
      </div>
    `;
    
    activeSections.forEach((section, idx) => {
      bodyContent += `
        <div style="margin-bottom: 10pt; font-family: 'Times New Roman'; font-size: 11pt;">
          <h4 style="text-transform: uppercase; margin-bottom: 3pt;">${idx + 1}. ${section.title}</h4>
          <p style="margin-top: 0; line-height: 1.2;">${replacePlaceholders(section.content).replace(/\n/g, '<br>')}</p>
        </div>
      `;
    });

    const footer = "</div></body></html>";
    const source = header + headerFooterDefs + bodyContent + footer;
    const blob = new Blob(['\ufeff', source], { type: 'application/msword' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-white border-b no-print">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase ${isComplete ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            {isComplete ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
            {isComplete ? 'Ready to Export' : `${missingFields.length} Missing Fields`}
          </div>
          <h2 className="text-sm font-semibold text-slate-700 ml-2">{template.name}</h2>
          <div className="h-4 w-px bg-slate-200 mx-2" />
          <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 uppercase">
            <Zap size={10} className="text-amber-500" />
            {activeSections.filter(s => s.tag && s.tag !== 'standard').length} Logic Rules
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={downloadPdf}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
          >
            <FileDown size={14} />
            Download PDF
          </button>
          <button 
            onClick={downloadDoc}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-800 text-white hover:bg-slate-900 rounded-lg transition-colors shadow-sm"
          >
            <Download size={14} />
            Download Word
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-8 print-area">
        {/* Tightened document layout: reduced padding from p-12 to p-6/p-10 */}
        <div 
          ref={docRef} 
          className="max-w-[800px] mx-auto bg-white shadow-xl p-6 sm:p-10 font-serif text-slate-900 relative"
          style={{ minHeight: 'fit-content', paddingTop: '40px' }}
        >
          {/* Reduced header margin-bottom from mb-8 to mb-6 */}
          <div className="mb-6 border-b-2 border-slate-900 pb-3 flex justify-between items-end">
            <div>
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tighter leading-none">{data.firmName}</h3>
              <p className="text-[9px] sm:text-[10px] font-sans text-slate-500 uppercase tracking-widest mt-1">Attorney at Law &bull; {data.jurisdiction}</p>
            </div>
            <div className="text-right text-[9px] sm:text-[10px] font-sans text-slate-500">
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Reduced margin-bottom from mb-8 to mb-6 */}
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-6 uppercase underline decoration-1 underline-offset-4">
            {template.name}
          </h1>

          <div className="space-y-4 sm:space-y-5 text-xs sm:text-sm leading-relaxed">
            {activeSections.map((section, idx) => {
              const rawContent = replacePlaceholders(section.content);
              const isExplaining = explainingId === section.id;
              const isLogicDriven = section.tag === 'jurisdiction' || section.tag === 'billing';
              const isImmutable = section.isImmutable;

              return (
                <div key={section.id} className={`group relative p-2 -m-2 rounded-lg transition-all ${isLogicDriven ? 'bg-amber-50/10' : ''} ${isImmutable ? 'hover:bg-slate-50/50' : 'hover:bg-blue-50/10'}`}>
                  
                  {isImmutable && (
                    <div className="absolute -left-10 top-2 no-print">
                      <div className="group/lock relative">
                        <Lock size={12} className="text-slate-300 opacity-60 hover:text-slate-500 cursor-help" />
                        <div className="hidden group-hover/lock:block absolute left-full ml-2 top-0 p-2 bg-slate-800 text-white text-[9px] rounded w-32 leading-tight z-10 font-sans shadow-lg">
                          Locked Legal language.
                        </div>
                      </div>
                    </div>
                  )}

                  {isLogicDriven && !isImmutable && (
                    <div className="absolute -left-10 top-2 no-print">
                      <div className="group/logic relative">
                        <Zap size={12} className="text-amber-400 opacity-60 hover:opacity-100 cursor-help" />
                        <div className="hidden group-hover/logic:block absolute left-full ml-2 top-0 p-2 bg-slate-800 text-white text-[9px] rounded w-32 leading-tight z-10 font-sans shadow-lg">
                          Dynamic logic rule applied.
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="absolute -left-10 top-7 no-print opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleExplain(section)}
                      className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors shadow-sm"
                      title="Explain clause"
                    >
                      {isExplaining && isLoadingAi ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    </button>
                  </div>

                  <div className="flex gap-3 sm:gap-4">
                    <span className="font-bold shrink-0">{idx + 1}.</span>
                    <div className="flex-1">
                      <h4 className="font-bold uppercase mb-1 flex items-center gap-2 text-xs sm:text-sm">
                        {section.title}
                      </h4>
                      <p className="whitespace-pre-line text-slate-800 text-[11px] sm:text-sm">
                        {rawContent.split(/(\[.*?\])/).map((part, i) => 
                          part.startsWith('[') ? (
                            <span key={i} className="text-red-500 font-bold bg-red-50 px-1 rounded">{part}</span>
                          ) : part
                        )}
                      </p>
                    </div>
                  </div>

                  {isExplaining && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl animate-in slide-in-from-top-2 no-print relative">
                      <div className="absolute -top-2 left-4 w-4 h-4 bg-blue-50 border-l border-t border-blue-100 rotate-45"></div>
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-600 p-1 rounded mt-0.5">
                          <Sparkles size={12} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-[10px] font-bold text-blue-800 uppercase mb-1">AI Explanation</h5>
                          {isLoadingAi ? (
                            <div className="flex items-center gap-2 text-blue-600 text-xs italic">
                              <Loader2 size={12} className="animate-spin" /> Analyzing clause...
                            </div>
                          ) : (
                            <p className="text-[11px] text-blue-900 leading-normal font-sans">
                              {aiExplanation}
                            </p>
                          )}
                        </div>
                        <button onClick={() => setExplainingId(null)} className="text-blue-400 hover:text-blue-600">
                          &times;
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Reduced margin-top from mt-16 to mt-10 to keep footer on same page */}
          <div className="mt-10 pt-6 border-t border-slate-100 text-[9px] text-slate-400 font-sans text-center">
            LexiForge Digital Asset ID: LXF-{Math.random().toString(36).substring(7).toUpperCase()}
            <br />
            Confidentiality privileged under {data.jurisdiction} professional conduct rules.
          </div>
        </div>
      </div>
    </div>
  );
};
