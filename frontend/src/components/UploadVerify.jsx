import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  X, 
  Sparkles, 
  ArrowRight, 
  Check,
  AlertCircle,
  HelpCircle,
  ShieldCheck
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
    "Computing SHA-256 cryptographic document checksums...",
    "Extracting line-item entities and metadata via Vision AI...",
    "Running 3-way reconciliation (Invoice vs PO vs DR)...",
    "Evaluating price tolerances and risk score...",
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
      setErrorMsg("Please upload all three required corroborating documents before running verification.");
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
      <div className={`relative rounded-2xl border transition-all duration-200 p-6 flex flex-col justify-between ${
        file 
          ? 'border-emerald-500/40 bg-emerald-950/10' 
          : 'border-white/[0.08] hover:border-white/20 bg-canvas-900/60'
      }`}>
        <div className="flex flex-col items-center text-center space-y-3">
          {file ? (
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-300">
              <UploadCloud className="w-6 h-6 text-orange-400" />
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-slate-100">{label}</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">{description}</p>
          </div>
        </div>

        <div className="mt-5 w-full">
          {file ? (
            <div className="w-full bg-canvas-950/90 border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-2 truncate">
                <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-200 truncate font-mono">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(fileKey)}
                className="text-slate-400 hover:text-rose-400 p-1 transition"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="w-full cursor-pointer flex items-center justify-center space-x-2 px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-200 border border-white/10 transition">
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
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Upload & 3-Way Match Verification</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Ingest Invoice, PO, and Delivery Receipt to evaluate discrepancies, calculate risk, and register SHA-256 proofs.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSampleDocs}
          className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 text-xs font-medium transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>Load Hackathon Samples</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div>
            <p className="font-semibold text-rose-200">Missing Required Documents</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Upload Dropzones */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderUploadBox(
            "invoice",
            "1. Vendor Invoice (PDF)",
            "Contains vendor line items, unit prices, and total billed amount.",
            "invoice"
          )}
          {renderUploadBox(
            "po",
            "2. Purchase Order (PO)",
            "Authorized procurement document with agreed rates and terms.",
            "po"
          )}
          {renderUploadBox(
            "dr",
            "3. Delivery Receipt (DR)",
            "Warehouse acknowledgement confirming items physically received.",
            "deliveryReceipt"
          )}
        </div>

        {/* Verification Loading State / Trigger Box */}
        {loading ? (
          <div className="glass-panel rounded-2xl p-8 text-center space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-full border-2 border-orange-500 border-t-transparent animate-spin mx-auto" />
            <div>
              <h3 className="text-base font-semibold text-white">Running 3-Way Match Verification</h3>
              <p className="text-xs text-orange-400 font-mono mt-1">
                {verificationSteps[currentStep]}
              </p>
            </div>
            <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden max-w-md mx-auto">
              <div 
                className="bg-gradient-to-r from-orange-500 to-amber-300 h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / verificationSteps.length) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
              <span>
                All documents are hashed using SHA-256 for non-repudiation and compared against agreed contractual tolerances.
              </span>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-full bg-[#202026] hover:bg-[#2b2b34] text-white border border-white/20 hover:border-white/30 text-xs sm:text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-glow-subtle"
            >
              <span>Run Verification</span>
              <ArrowRight className="w-4 h-4 text-orange-400" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
