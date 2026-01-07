
import React, { useState } from 'react';
import { FormData, DocType, BillingType } from '../types';
import { User, Briefcase, DollarSign, MapPin, CheckCircle2, ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface WizardFormProps {
  data: FormData;
  onChange: (newData: Partial<FormData>) => void;
  docType: DocType;
}

export const WizardForm: React.FC<WizardFormProps> = ({ data, onChange, docType }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    onChange({ [name]: val });
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-blue-600" size={20} />
              <h3 className="font-semibold text-slate-800">Client Information</h3>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Full Legal Name</label>
              <input
                type="text"
                name="clientName"
                value={data.clientName}
                onChange={handleChange}
                placeholder="e.g. Acme Corp or John Smith"
                className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Physical Address</label>
              <textarea
                name="clientAddress"
                value={data.clientAddress}
                onChange={handleChange}
                rows={2}
                placeholder="123 Legal Lane, Suite 100..."
                className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Email Address</label>
              <input
                type="email"
                name="clientEmail"
                value={data.clientEmail}
                onChange={handleChange}
                placeholder="client@example.com"
                className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                name="isBusinessEntity"
                checked={data.isBusinessEntity}
                onChange={handleChange}
                id="isBusinessEntity"
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 bg-white"
              />
              <label htmlFor="isBusinessEntity" className="text-sm text-slate-600">Client is a Business Entity</label>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="text-blue-600" size={20} />
              <h3 className="font-semibold text-slate-800">Matter Details</h3>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Matter Description</label>
              <textarea
                name="matterDescription"
                value={data.matterDescription}
                onChange={handleChange}
                rows={3}
                placeholder="Provide a brief description of the legal matter..."
                className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1 flex items-center gap-1">
                  Jurisdiction
                  <div className="group relative">
                    <Info size={12} className="text-slate-400 cursor-help" />
                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-slate-800 text-white text-[10px] rounded w-32 leading-tight z-10">
                      Try entering "California" to see logic in action.
                    </div>
                  </div>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="text"
                    name="jurisdiction"
                    value={data.jurisdiction}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Effective Date</label>
                <input
                  type="date"
                  name="effectiveDate"
                  value={data.effectiveDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="text-blue-600" size={20} />
              <h3 className="font-semibold text-slate-800">Financial Terms</h3>
            </div>
            
            {docType === 'retainer' && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Billing Arrangement</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onChange({ billingType: 'hourly' })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${data.billingType === 'hourly' ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                  >
                    Hourly Billing
                  </button>
                  <button
                    onClick={() => onChange({ billingType: 'flat_fee' })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${data.billingType === 'flat_fee' ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                  >
                    Flat Fee
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {data.billingType === 'hourly' ? (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Hourly Rate ($)</label>
                    <input
                      type="number"
                      name="hourlyRate"
                      value={data.hourlyRate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Retainer Amount ($)</label>
                    <input
                      type="number"
                      name="retainerAmount"
                      value={data.retainerAmount}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </>
              ) : (
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Total Flat Fee ($)</label>
                  <input
                    type="number"
                    name="flatFeeAmount"
                    value={data.flatFeeAmount}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}
            </div>

            {docType === 'collection' && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Total Debt Amount</label>
                  <input
                    type="text"
                    name="totalDebt"
                    value={data.totalDebt}
                    onChange={handleChange}
                    placeholder="e.g. 5,000.00"
                    className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={data.dueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="text-blue-600" size={20} />
              <h3 className="font-semibold text-slate-800">Document Options</h3>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                <div>
                  <div className="text-sm font-medium text-slate-800">Include Termination Clause</div>
                  <div className="text-xs text-slate-500">Adds language regarding ending representation.</div>
                </div>
                <input
                  type="checkbox"
                  name="includeTerminationClause"
                  checked={data.includeTerminationClause}
                  onChange={handleChange}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 bg-white"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                <div>
                  <div className="text-sm font-medium text-slate-800">Standard Arbitration</div>
                  <div className="text-xs text-slate-500">Requires ADR for dispute resolution.</div>
                </div>
                <input
                  type="checkbox"
                  name="includeArbitrationClause"
                  checked={data.includeArbitrationClause}
                  onChange={handleChange}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 bg-white"
                />
              </div>
            </div>
            <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center">
              <p className="text-sm text-slate-500">Your document is being generated in real-time on the right.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step {step} of {totalSteps}</span>
          <span className="text-xs font-medium text-slate-400">
            {step === 1 ? 'Client' : step === 2 ? 'Details' : step === 3 ? 'Financials' : 'Options'}
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="min-h-[400px]">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            step === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ChevronLeft size={20} />
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={step === totalSteps}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
            step === totalSteps ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
