
import { DocTemplate } from './types';

export const DOC_TEMPLATES: DocTemplate[] = [
  {
    id: 'retainer',
    name: 'Retainer Agreement',
    description: 'Standard legal services engagement contract defining scope and fees.',
    requiredFields: ['clientName', 'matterDescription', 'jurisdiction', 'hourlyRate'],
    sections: [
      {
        id: 'parties',
        title: 'Parties & Definitions',
        tag: 'standard',
        isImmutable: true,
        content: `This Retainer Agreement ("Agreement") is entered into on {{effectiveDate}}, by and between {{firmName}} ("Attorney"), located in {{jurisdiction}}, and {{clientName}} ("Client"), residing at {{clientAddress}}.`,
        explanation: "This section identifies who is signing the contract and where they are located."
      },
      {
        id: 'ca_disclosure',
        title: 'California Business & Professions Code Disclosure',
        tag: 'jurisdiction',
        isImmutable: true,
        condition: (data) => data.jurisdiction.toLowerCase().includes('california'),
        content: `In accordance with California Business and Professions Code Section 6148, this Agreement discloses that Attorney maintains professional liability insurance. Client acknowledges receipt of this disclosure.`,
        explanation: "Mandatory disclosure for attorneys practicing under California jurisdiction."
      },
      {
        id: 'scope',
        title: 'Scope of Representation',
        tag: 'standard',
        content: `Attorney agrees to provide legal services to Client in connection with {{matterDescription}}. Any additional services outside this scope will require a separate written agreement.`,
        explanation: "Crucial for preventing 'scope creep'—it defines exactly what work the lawyer will and will not do."
      },
      {
        id: 'billing_hourly',
        title: 'Fees & Payment Terms (Hourly)',
        tag: 'billing',
        isImmutable: true,
        condition: (data) => data.billingType === 'hourly',
        content: `Client agrees to pay Attorney an hourly rate of \${{hourlyRate}} per hour. An initial retainer of \${{retainerAmount}} is due upon execution of this Agreement. Invoices will be issued monthly and are payable within 30 days.`,
        explanation: "Standard hourly billing arrangement common in litigation and complex advisory."
      },
      {
        id: 'billing_flat',
        title: 'Fees & Payment Terms (Flat Fee)',
        tag: 'billing',
        isImmutable: true,
        condition: (data) => data.billingType === 'flat_fee',
        content: `Client agrees to pay Attorney a flat fee of \${{flatFeeAmount}} for the entirety of the services described in the Scope of Representation. This fee is earned upon receipt and will be deposited into the Firm's operating account.`,
        explanation: "Fixed cost arrangement providing price certainty for the client."
      },
      {
        id: 'confidentiality',
        title: 'Confidentiality',
        tag: 'standard',
        isImmutable: true,
        content: `Attorney shall maintain the confidentiality of all information provided by Client as required by the Rules of Professional Conduct in the State of {{jurisdiction}}.`,
        explanation: "Protects your secrets and ensures the lawyer cannot disclose your private information."
      },
      {
        id: 'arbitration',
        title: 'Arbitration of Disputes',
        tag: 'optional',
        condition: (data) => data.includeArbitrationClause,
        content: `Any dispute, claim or controversy arising out of or relating to this Agreement shall be determined by arbitration in {{jurisdiction}} before one arbitrator. The parties shall equally share the costs of the arbitration.`,
        explanation: "Requires parties to settle disputes outside of court, usually faster and more private."
      },
      {
        id: 'termination',
        title: 'Termination Clause',
        tag: 'optional',
        condition: (data) => data.includeTerminationClause,
        content: `Either party may terminate this representation at any time upon written notice. Upon termination, Client shall pay all outstanding fees for services rendered through the date of termination.`,
        explanation: "Explains how the professional relationship can be ended by either side."
      },
      {
        id: 'governing_law',
        title: 'Governing Law',
        tag: 'standard',
        isImmutable: true,
        content: `This Agreement shall be governed by and construed in accordance with the laws of the State of {{jurisdiction}}.`,
        explanation: "Determines which state's laws will apply if there is a dispute."
      },
      {
        id: 'signatures',
        title: 'Signature Block',
        tag: 'standard',
        isImmutable: true,
        content: `IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.\n\n__________________________\n{{attorneyName}}, Attorney\n\n__________________________\n{{clientName}}, Client`,
        explanation: "The formal closing where both parties sign to make the document binding."
      }
    ]
  },
  {
    id: 'end_rep',
    name: 'End of Representation',
    description: 'Formal notification closing a legal matter and returning files.',
    requiredFields: ['clientName', 'matterDescription', 'effectiveDate'],
    sections: [
      {
        id: 'closing',
        title: 'Matter Closure',
        isImmutable: true,
        content: `Dear {{clientName}},\n\nWe are writing to formally conclude our legal representation regarding {{matterDescription}}, effective {{effectiveDate}}. Our work on this specific matter is now complete.`,
        explanation: "Clearly marks the end of the attorney-client relationship for a specific case."
      },
      {
        id: 'files',
        title: 'File Disposition & Retention',
        isImmutable: true,
        content: `We have enclosed your original documents and the final case file. We will maintain a digital copy for our records for the period required by {{jurisdiction}} law, typically seven years. After this period, the digital file will be destroyed without further notice.`,
        explanation: "Important notice regarding how long the firm will keep your data."
      },
      {
        id: 'limitations',
        title: 'Statute of Limitations Notice',
        tag: 'standard',
        isImmutable: true,
        content: `Please be advised that various legal claims are subject to time limits known as "Statutes of Limitations." Our closure of this file does not toll or extend any such periods. You are responsible for future deadlines.`,
        explanation: "A standard legal warning that you must still be aware of time limits for future actions."
      },
      {
        id: 'final_invoice',
        title: 'Final Financials',
        content: `Your final statement is attached showing a zero balance or any final refund due. All fees have been processed according to our original agreement.`,
        explanation: "Confirms that all financial obligations have been settled."
      }
    ]
  },
  {
    id: 'collection',
    name: 'Collection Demand',
    description: 'Demand letter for outstanding debts and payment notifications.',
    requiredFields: ['clientName', 'totalDebt', 'dueDate'],
    sections: [
      {
        id: 'demand',
        title: 'Formal Demand for Payment',
        isImmutable: true,
        content: `RE: Formal Demand for Payment - \${{totalDebt}}\n\nThis letter serves as a formal demand for payment of the outstanding balance of \${{totalDebt}} owed to {{firmName}} by {{clientName}} regarding {{matterDescription}}. Payment must be received by {{dueDate}}.`,
        explanation: "A standard legal demand letter used to initiate debt recovery."
      },
      {
        id: 'instructions',
        title: 'Payment Instructions',
        content: `Please remit payment via check payable to {{firmName}} at the address listed above, or contact our office at {{clientEmail}} to arrange a wire transfer.`,
        explanation: "Tells the recipient exactly how to pay the debt."
      },
      {
        id: 'fdcpa',
        title: 'FDCPA Validation Notice',
        tag: 'standard',
        isImmutable: true,
        content: `Unless you, within thirty days after receipt of this notice, dispute the validity of the debt, or any portion thereof, the debt will be assumed to be valid by the debt collector.`,
        explanation: "Regulatory notice required in many jurisdictions to protect consumer rights."
      },
      {
        id: 'legal_action',
        title: 'Notice of Potential Legal Action',
        content: `If payment is not received by the deadline, we reserve the right to pursue all legal remedies available under the laws of {{jurisdiction}}, which may include the filing of a civil lawsuit.`,
        explanation: "Sets a hard deadline and warns of potential litigation."
      }
    ]
  },
  {
    id: 'fdd_review',
    name: 'FDD Review Summary',
    description: 'Summary of Franchise Disclosure Document risks and key terms.',
    requiredFields: ['clientName', 'jurisdiction', 'retainerAmount'],
    sections: [
      {
        id: 'overview',
        title: 'Executive Summary',
        isImmutable: true,
        content: `Client: {{clientName}}\nDate of Review: {{effectiveDate}}\n\nThis document provides a legal summary of the Franchise Disclosure Document (FDD). This is a legal analysis and not a guarantee of financial performance.`,
        explanation: "A high-level summary of the review process."
      },
      {
        id: 'fees',
        title: 'Key Financial Obligations',
        content: `Initial Franchise Fee: \${{retainerAmount}}\nRoyalty: 6% of Gross Sales\nAd Fund: 2% of Gross Sales\n\nNote: Fees are subject to the governing laws of {{jurisdiction}}.`,
        explanation: "Itemizes the recurring costs of the franchise system."
      },
      {
        id: 'territory',
        title: 'Item 12: Territorial Rights',
        content: `The FDD indicates a [Protected/Non-Protected] territory. You should verify the exact GPS coordinates or boundaries provided in Exhibit A of the Franchise Agreement.`,
        explanation: "Determines if other franchisees can open near you."
      },
      {
        id: 'termination',
        title: 'Default and Termination',
        isImmutable: true,
        content: `The Franchisor maintains broad rights to terminate for "Good Cause." Specifically, failure to meet sales quotas may lead to non-renewal of the license.`,
        explanation: "Highlights the risks of losing your business license."
      },
      {
        id: 'risk',
        title: 'General Risk Assessment',
        content: `We have identified specific concerns regarding the non-compete clauses and the territory protections as defined by the laws of {{jurisdiction}}. We recommend negotiating these terms.`,
        explanation: "Highlights red flags for the potential franchisee."
      }
    ]
  }
];
