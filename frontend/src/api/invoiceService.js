import { initialContractData } from "../data/mockData";

const BACKEND_URL = "http://localhost:8000";

/**
 * Sends verification request to FastAPI backend (or fallback simulation if backend is not yet started).
 * @param {FormData} formData - Contains invoice, po, and delivery_receipt files
 * @returns {Promise<{ data: any, source: 'backend' | 'simulation' }>}
 */
export const verifyDocuments = async (formData) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(`${BACKEND_URL}/invoices/verify`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    return { data, source: "backend" };
  } catch (error) {
    console.warn("Backend unavailable (FastAPI on :8000). Falling back to mock contract simulation:", error.message);
    
    // Simulate real AI processing latency (1.2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Dynamic mock response based on file names or fallback
    const mockResponse = {
      ...initialContractData,
      invoice_id: "INV-" + Math.floor(1000 + Math.random() * 9000),
      document_hashes: {
        invoice: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        po: "a8f3b20491cb8f9d01249fae563bc7890123456789abcdef0123456789abcdef",
        delivery_receipt: "5f4dcc3b5aa765d61d8327deb882cf992b9699aabbccddeeff00112233445566"
      }
    };

    return { data: mockResponse, source: "simulation" };
  }
};

/**
 * Checks backend connectivity status
 */
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/health`, { method: "GET" });
    return response.ok;
  } catch {
    return false;
  }
};
