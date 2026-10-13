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
  HelpCircle
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

  // Prefill mock sample documents for instant testing during demo
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

    // Step cycle animation for realistic feedback
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

  const renderUploadBox = (id, label, description, fileKey, sampleName) => {
    const file = files[fileKey];

    return (
      <div className={`relative rounded-xl border-2 border-dashed p-6 transition-all duration-200 ${
        file 
          ? 'border-emerald-500/40 bg-emerald-950/10' 
          : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
      }`}>
        <div className="flex flex-col items-center text-center">
          {file ? (
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-3">
              <UploadCloud className="w-6 h-6 text-indigo-400" />
            </div>
          )}

          <h3 className="text-sm font-semibold text-slate-200 mb-1">{label}</h3>
          <p className="text-xs text-slate-400 mb-4 max-w-xs">{description}</p>

          {file ? (
            <div className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-2 truncate">
                <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
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
            <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition">
              <span>Choose File</span>
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
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Upload & 3-Way Match Verification</h1>
          <p className="text-sm text-slate-400">
            Submit the 3 corroborating documents to evaluate discrepancies, calculate risk, and register SHA-256 integrity proofs.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSampleDocs}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Hackathon Sample Files</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
          <div>
            <p className="font-semibold">Document Requirement Notice</p>
            <p className="text-xs text-rose-200/90 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Upload Cards Grid */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderUploadBox(
            "invoice",
            "1. Vendor Invoice (PDF)",
            "Contains supplier claim, line item rates, and total payable amount.",
            "invoice"
          )}
          {renderUploadBox(
            "po",
            "2. Purchase Order (PO)",
            "Contains authorized price agreements, approved items, and delivery terms.",
            "po"
          )}
          {renderUploadBox(
            "dr",
            "3. Delivery Receipt (DR)",
            "Warehouse slip verifying goods physically received and inspected.",
            "deliveryReceipt"
          )}
        </div>

        {/* Verification Progress Modal / Panel */}
        {loading ? (
          <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/30 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto" />
            <div>
              <h3 className="text-base font-semibold text-white">Running 3-Way Match Verification</h3>
              <p className="text-xs text-indigo-300 font-mono mt-1">
                {verificationSteps[currentStep]}
              </p>
            </div>
            {/* Step progress bar */}
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 max-w-md mx-auto">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / verificationSteps.length) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <HelpCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span>
                Files are hashed locally using SHA-256 for tamper detection before submitting to the verification model.
              </span>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40"
            >
              <span>Run Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
