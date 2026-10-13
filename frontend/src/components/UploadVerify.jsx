import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  X, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
} from 'lucide-react';

export default function UploadVerify({ onVerifySuccess }) {
  const [files, setFiles] = useState({
    invoice: null,
    po: null,
    deliveryReceipt: null,
  });

  const [dragActive, setDragActive] = useState({
    invoice: false,
    po: false,
    deliveryReceipt: false,
  });

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);

  const verificationSteps = [
    "Computing SHA-256 cryptographic document hashes...",
    "Extracting key-value entities and line items via Vision AI...",
    "Running 3-way match reconciliation (Invoice vs PO vs DR)...",
    "Evaluating price tolerances and risk matrix...",
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

  const handleDrag = (field, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive((prev) => ({ ...prev, [field]: true }));
    } else if (e.type === 'dragleave') {
      setDragActive((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleDrop = (field, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [field]: false }));
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles((prev) => ({ ...prev, [field]: e.dataTransfer.files[0] }));
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
      setErrorMsg("Please upload all three required documents (Invoice, Purchase Order, and Delivery Receipt) before proceeding.");
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
    const isDragging = dragActive[fileKey];

    return (
      <div 
        onDragEnter={(e) => handleDrag(fileKey, e)}
        onDragOver={(e) => handleDrag(fileKey, e)}
        onDragLeave={(e) => handleDrag(fileKey, e)}
        onDrop={(e) => handleDrop(fileKey, e)}
        className={`relative rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between min-h-[240px] box-border ${
          file 
            ? 'border-[#38BDF8]/40 bg-[#111827] shadow-cyan-glow' 
            : isDragging
            ? 'border-[#38BDF8] bg-[#172236]'
            : 'border-[#1E2D47] hover:border-[#38BDF8]/30 bg-[#111827]/70'
        }`}
      >
        <div className="flex flex-col items-center text-center space-y-3">
          {file ? (
            <div className="w-12 h-12 rounded-2xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <CheckCircle className="w-6 h-6 stroke-[2.2]" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-[#0A0E17] border border-[#1E2D47] flex items-center justify-center text-[#94A3B8]">
              <UploadCloud className="w-6 h-6 text-[#38BDF8]" />
            </div>
          )}

          <div>
            <h3 className="font-display font-bold text-sm text-[#F8FAFC]">{label}</h3>
            <p className="text-xs text-[#94A3B8] mt-1 max-w-xs">{description}</p>
          </div>
        </div>

        {/* Action Button Area: Strict h-10 height for exact alignment */}
        <div className="mt-5 w-full h-10 flex items-center">
          {file ? (
            <div className="w-full h-10 bg-[#0A0E17] border border-[#1E2D47] rounded-xl px-3 flex items-center justify-between box-border">
              <div className="flex items-center space-x-2 truncate">
                <FileText className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span className="text-xs text-[#F8FAFC] truncate font-mono">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(fileKey)}
                className="text-[#94A3B8] hover:text-[#F87171] p-1 transition shrink-0"
                title="Remove file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className="w-full h-10 cursor-pointer flex items-center justify-center space-x-2 px-4 rounded-full bg-[#0A0E17] hover:bg-[#172236] text-xs font-semibold text-[#F8FAFC] border border-[#1E2D47] hover:border-[#38BDF8]/30 transition box-border">
              <span>Select File or Drop</span>
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
      {/* Header with pixel-aligned CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D47]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8]">
            Document Ingestion Workspace
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F8FAFC] tracking-tight mt-1">
            Upload & 3-Way Verification
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Corroborate Invoice, Purchase Order, and Delivery Receipt to compute SHA-256 hashes and risk variances.
          </p>
        </div>
        
        {/* Sample Loader CTA */}
        <button
          type="button"
          onClick={loadSampleDocs}
          className="h-9 inline-flex items-center justify-center space-x-2 px-4 rounded-full bg-[#111827] hover:bg-[#172236] text-[#38BDF8] border border-[#1E2D47] hover:border-[#38BDF8]/30 text-xs font-mono font-semibold transition shadow-sm shrink-0 self-start sm:self-auto box-border"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Hackathon Samples</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-[#F87171]/10 border border-[#F87171]/30 text-[#F87171] text-xs flex items-start space-x-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Missing Required Document</p>
            <p className="mt-0.5 text-xs text-[#F8FAFC]/90">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* 3 Dropzone Containers */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderUploadBox(
            "invoice",
            "1. Vendor Invoice (PDF)",
            "Supplier billing invoice with line items, rates, and total claimed amount.",
            "invoice"
          )}
          {renderUploadBox(
            "po",
            "2. Purchase Order (PO)",
            "Authorized procurement order with contracted unit rates and agreed volumes.",
            "po"
          )}
          {renderUploadBox(
            "dr",
            "3. Delivery Receipt (DR)",
            "Warehouse slip verifying goods physically received and acknowledged.",
            "deliveryReceipt"
          )}
        </div>

        {/* Verification Progress Modal / Panel */}
        {loading ? (
          <div className="p-8 rounded-3xl bg-[#111827] border border-[#38BDF8]/40 text-center space-y-4 shadow-studio-panel">
            <div className="w-10 h-10 rounded-full border-2 border-[#38BDF8] border-t-transparent animate-spin mx-auto" />
            <div>
              <h3 className="font-display font-bold text-base text-[#F8FAFC]">
                Running Autonomous 3-Way Match
              </h3>
              <p className="text-xs text-[#38BDF8] font-mono mt-1">
                {verificationSteps[currentStep]}
              </p>
            </div>
            <div className="w-full bg-[#0A0E17] rounded-full h-1.5 overflow-hidden max-w-md mx-auto border border-[#1E2D47]">
              <div 
                className="bg-[#38BDF8] h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / verificationSteps.length) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 rounded-3xl bg-[#111827] border border-[#1E2D47] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-studio-panel">
            <div className="flex items-center space-x-3 text-xs text-[#94A3B8]">
              <ShieldCheck className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <span>
                All documents are hashed using SHA-256 for non-repudiation before running 3-way reconciliation.
              </span>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 h-12 inline-flex items-center justify-center space-x-2 px-8 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0A0E17] font-display font-bold text-xs sm:text-sm tracking-tight transition-all duration-150 shadow-cyan-glow hover:shadow-lg transform active:scale-95 box-border"
            >
              <span>Run Verification</span>
              <ArrowRight className="w-4 h-4 text-[#0A0E17] stroke-[2.5]" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
