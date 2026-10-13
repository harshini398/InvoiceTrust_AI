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
  Lock,
  ArrowUpRight
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
        className={`relative rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between ${
          file 
            ? 'border-[#D9F99D]/40 bg-[#182821] shadow-lime-glow' 
            : isDragging
            ? 'border-[#D9F99D] bg-[#1F342B] scale-[1.01]'
            : 'border-[#23352C] hover:border-[#D9F99D]/30 bg-[#182821]/70'
        }`}
      >
        <div className="flex flex-col items-center text-center space-y-3">
          {file ? (
            <div className="w-12 h-12 rounded-2xl bg-[#D9F99D]/15 border border-[#D9F99D]/30 flex items-center justify-center text-[#D9F99D]">
              <CheckCircle className="w-6 h-6 stroke-[2.2]" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-[#101915] border border-[#23352C] flex items-center justify-center text-[#89948C]">
              <UploadCloud className="w-6 h-6 text-[#D9F99D]" />
            </div>
          )}

          <div>
            <h3 className="font-display font-bold text-sm text-[#F4F5F0]">{label}</h3>
            <p className="text-xs text-[#89948C] mt-1 max-w-xs">{description}</p>
          </div>
        </div>

        <div className="mt-5 w-full">
          {file ? (
            <div className="w-full bg-[#101915] border border-[#23352C] rounded-xl p-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-2 truncate">
                <FileText className="w-4 h-4 text-[#D9F99D] shrink-0" />
                <span className="text-xs text-[#F4F5F0] truncate font-mono">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(fileKey)}
                className="text-[#89948C] hover:text-[#F87171] p-1 transition"
                title="Remove file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className="w-full cursor-pointer flex items-center justify-center space-x-2 px-4 py-2.5 rounded-full bg-[#101915] hover:bg-[#1E342B] text-xs font-semibold text-[#F4F5F0] border border-[#23352C] hover:border-[#D9F99D]/30 transition">
              <span>Select File or Drop Here</span>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#23352C]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#D9F99D]">
            Document Ingestion Workspace
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F4F5F0] tracking-tight mt-1">
            Upload & 3-Way Verification
          </h1>
          <p className="text-xs sm:text-sm text-[#89948C] mt-1">
            Corroborate Invoice, Purchase Order, and Delivery Receipt to compute SHA-256 hashes and risk variances.
          </p>
        </div>
        
        {/* Sample Loader CTA */}
        <button
          type="button"
          onClick={loadSampleDocs}
          className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#182821] hover:bg-[#1E342B] text-[#D9F99D] border border-[#23352C] hover:border-[#D9F99D]/30 text-xs font-mono font-semibold transition shadow-sm"
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
            <p className="mt-0.5 text-xs text-[#F4F5F0]/90">{errorMsg}</p>
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
          <div className="p-8 rounded-3xl bg-[#182821] border border-[#D9F99D]/40 text-center space-y-4 shadow-studio-panel">
            <div className="w-10 h-10 rounded-full border-2 border-[#D9F99D] border-t-transparent animate-spin mx-auto" />
            <div>
              <h3 className="font-display font-bold text-base text-[#F4F5F0]">
                Running Autonomous 3-Way Match
              </h3>
              <p className="text-xs text-[#D9F99D] font-mono mt-1">
                {verificationSteps[currentStep]}
              </p>
            </div>
            <div className="w-full bg-[#101915] rounded-full h-1.5 overflow-hidden max-w-md mx-auto border border-[#23352C]">
              <div 
                className="bg-[#D9F99D] h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / verificationSteps.length) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-[#182821] border border-[#23352C] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-studio-panel">
            <div className="flex items-center space-x-3 text-xs text-[#89948C]">
              <ShieldCheck className="w-4 h-4 text-[#D9F99D] shrink-0" />
              <span>
                All documents are hashed using SHA-256 for non-repudiation before running 3-way reconciliation.
              </span>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-[#D9F99D] hover:bg-[#C7EE84] text-[#101915] font-display font-bold text-xs sm:text-sm tracking-tight transition-all duration-200 shadow-lime-glow hover:shadow-lg transform active:scale-95"
            >
              <span>Run Verification</span>
              <ArrowRight className="w-4 h-4 text-[#101915] stroke-[2.5]" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
