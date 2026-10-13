import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  X, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  FileCheck2,
  AlertCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

export default function UploadVerify({ onVerifySuccess }) {
  const [files, setFiles] = useState({
    invoice: null,
    po: null,
    deliveryReceipt: null,
  });

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);

  const verificationSteps = [
    "Computing SHA-256 cryptographic document hashes...",
    "Extracting line items and suppliers via Multimodal AI...",
    "Running 3-way reconciliation (Invoice vs PO vs DR)...",
    "Calculating risk score and discrepancy tolerance...",
  ];

  const handleFileChange = (field, e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({
        ...prev,
        [field]: e.target.files[0],
      }));
      setErrorMsg(null);
    }
  };

  const removeFile = (field) => {
    setFiles((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  const loadSampleDocs = () => {
    setFiles({
      invoice: new File(["Sample Invoice Content"], "INV-1042_ABC_Traders.pdf", { type: "application/pdf" }),
      po: new File(["Sample Purchase Order Content"], "PO-9821_Hardware_Order.pdf", { type: "application/pdf" }),
      deliveryReceipt: new File(["Sample Delivery Receipt Content"], "DR-4401_Goods_Received.pdf", { type: "application/pdf" }),
    });
    setErrorMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.invoice || !files.po || !files.deliveryReceipt) {
      setErrorMsg("Please upload all three required documents (Invoice, Purchase Order, and Delivery Receipt).");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < verificationSteps.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const formData = new FormData();
      formData.append("invoice", files.invoice);
      formData.append("po", files.po);
      formData.append("delivery_receipt", files.deliveryReceipt);

      await onVerifySuccess(formData);
    } catch (err) {
      setErrorMsg(err.message || "Verification request failed");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const renderUploadBox = (id, label, description, fileKey) => {
    const file = files[fileKey];

    return (
      <div className={`relative rounded-3xl p-6 transition-all duration-200 border ${
        file 
          ? 'border-[#00F59B]/40 bg-[#00F59B]/5 shadow-[0_0_20px_rgba(0,245,155,0.08)]' 
          : 'border-white/10 hover:border-blue-500/40 bg-navy-900/50 hover:bg-navy-850/60'
      }`}>
        <div className="flex flex-col items-center text-center">
          {file ? (
            <div className="w-12 h-12 rounded-2xl bg-[#00F59B]/20 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B] mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mb-3 group-hover:text-white">
              <UploadCloud className="w-6 h-6 text-sky-400" />
            </div>
          )}

          <h3 className="text-sm font-bold text-white mb-1 font-display">{label}</h3>
          <p className="text-xs text-slate-400 mb-4 max-w-xs">{description}</p>

          {file ? (
            <div className="w-full bg-[#060913]/90 border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-2 truncate">
                <FileText className="w-4 h-4 text-[#00F59B] flex-shrink-0" />
                <span className="text-xs text-slate-200 truncate font-mono">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(fileKey)}
                className="text-slate-400 hover:text-rose-400 p-1"
                title="Remove file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/10 transition">
              <span>Choose Document</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.json"
                className="hidden"
                onChange={(e) => handleFileChange(fileKey, e)}
              />
            </label>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Upload & 3-Way Verification
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ingest corroborating procurement records to evaluate line-item pricing and verify SHA-256 signatures.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSampleDocs}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold transition self-start sm:self-auto shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00F59B]" />
          <span>Load Hackathon Samples</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
          <div>
            <p className="font-semibold">Document Requirement Notice</p>
            <p className="text-xs text-rose-200/90 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Upload Cards Grid */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {renderUploadBox(
            "invoice",
            "1. Vendor Invoice",
            "Contains billed line items, unit rates, and final payment claim.",
            "invoice"
          )}
          {renderUploadBox(
            "po",
            "2. Purchase Order",
            "Contains pre-authorized item pricing, quantities, and terms.",
            "po"
          )}
          {renderUploadBox(
            "dr",
            "3. Delivery Receipt",
            "Warehouse slip verifying goods physically received and inspected.",
            "deliveryReceipt"
          )}
        </div>

        {/* Verification Progress Panel */}
        {loading ? (
          <div className="glass-card p-8 rounded-3xl border-blue-500/40 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full border-2 border-[#00F59B] border-t-transparent animate-spin mx-auto" />
            <div>
              <h3 className="text-base font-bold text-white font-display">Executing 3-Way Match Verification</h3>
              <p className="text-xs text-[#00F59B] font-mono mt-1">
                {verificationSteps[currentStep]}
              </p>
            </div>
            {/* Step progress bar */}
            <div className="w-full bg-[#060913] rounded-full h-2 overflow-hidden border border-white/10 max-w-md mx-auto">
              <div 
                className="bg-gradient-to-r from-sky-400 via-teal-300 to-[#00F59B] h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / verificationSteps.length) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <HelpCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span>
                SHA-256 digests are computed in-memory before submitting to prevent tampering or replay attacks.
              </span>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-[#00F59B] hover:bg-[#00DC8C] text-slate-950 font-bold uppercase tracking-wider text-xs shadow-neon transition transform hover:scale-[1.02] active:scale-95"
            >
              <span>RUN VERIFICATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
