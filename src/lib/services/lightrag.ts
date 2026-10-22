// admin-panel/src/lib/services/lightrag.ts

export interface LegalCitation {
  act: string;
  section?: string;
  title?: string;
}

export interface LightRagResult {
  answer: string;
  citations: LegalCitation[];
  status: "SUCCESS" | "FAILED";
  error?: string;
}

const AZURE_LIGHTRAG_ENDPOINT =
  process.env.LIGHTRAG_API_URL || "https://chats.agenticprofessionals.net";

/**
 * Extracts statutory sections and act references from legal response text.
 */
export function parseLegalCitations(text: string): LegalCitation[] {
  if (!text) return [];

  const citations: LegalCitation[] = [];
  const seen = new Set<string>();

  // 1. Match Section references (e.g. Section 7, Section 12(3), Section 14)
  const sectionRegex = /(?:Section|Sec\.)\s+([0-9]+[A-Za-z]?(?:\([0-9A-Za-z]+\))*)/gi;
  let match: RegExpExecArray | null;
  while ((match = sectionRegex.exec(text)) !== null) {
    const sec = match[1];
    const key = `SEC_${sec}`;
    if (!seen.has(key)) {
      seen.add(key);
      citations.push({
        act: "IBC 2016",
        section: sec,
        title: `Section ${sec}`,
      });
    }
  }

  // 2. Match Regulation references (e.g. Regulation 35A, Reg 36)
  const regRegex = /(?:Regulation|Reg\.)\s+([0-9]+[A-Za-z]?(?:\([0-9A-Za-z]+\))*)/gi;
  while ((match = regRegex.exec(text)) !== null) {
    const reg = match[1];
    const key = `REG_${reg}`;
    if (!seen.has(key)) {
      seen.add(key);
      citations.push({
        act: "CIRP Regulations 2016",
        section: reg,
        title: `Regulation ${reg}`,
      });
    }
  }

  // 3. Match major statutory act acronyms if present
  const acts = [
    { acronym: "IBC", fullName: "Insolvency & Bankruptcy Code, 2016" },
    { acronym: "SARFAESI", fullName: "SARFAESI Act, 2002" },
    { acronym: "NCLT Rules", fullName: "NCLT Rules, 2016" },
    { acronym: "Companies Act", fullName: "Companies Act, 2013" },
  ];

  for (const act of acts) {
    if (new RegExp(`\\b${act.acronym}\\b`, "i").test(text) && !seen.has(act.acronym)) {
      seen.add(act.acronym);
      citations.push({
        act: act.fullName,
        title: act.acronym,
      });
    }
  }

  return citations;
}

/**
 * Dispatches an asynchronous query to the Azure LightRAG server.
 */
export async function queryAzureLightRag(
  query: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<LightRagResult> {
  const url = `${AZURE_LIGHTRAG_ENDPOINT.replace(/\/$/, "")}/query`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000); // 35 second timeout

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "HayagrivaPortal/1.0",
    };

    if (process.env.LIGHTRAG_API_KEY) {
      headers["Authorization"] = `Bearer ${process.env.LIGHTRAG_API_KEY}`;
      headers["X-API-Key"] = process.env.LIGHTRAG_API_KEY;
    }

    const payload = {
      query,
      mode: "mix",
      response_type: "Multiple Paragraphs",
      conversation_history: conversationHistory,
    };

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text().catch(() => "Unknown error");
      console.error(`[LightRAG] Azure server error (${res.status}):`, errText);
      return {
        answer: "The Sovereign AI legal service encountered an error processing your query. Please try again or ask the community.",
        citations: [],
        status: "FAILED",
        error: `HTTP ${res.status}: ${errText}`,
      };
    }

    const data = await res.json();
    const answerText =
      typeof data === "string"
        ? data
        : data?.response || data?.answer || data?.content || JSON.stringify(data);

    const citations = parseLegalCitations(answerText);

    return {
      answer: answerText,
      citations,
      status: "SUCCESS",
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    const isTimeout = err?.name === "AbortError";
    const errorMessage = isTimeout
      ? "Azure LightRAG query timed out after 35 seconds."
      : err?.message || "Failed to connect to Azure LightRAG.";

    console.warn(`[LightRAG] Query failed: ${errorMessage}`);

    return {
      answer: "The Sovereign AI legal service is temporarily unreachable. Human community members can still answer this discussion.",
      citations: [],
      status: "FAILED",
      error: errorMessage,
    };
  }
}
