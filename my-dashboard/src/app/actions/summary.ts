"use server";

import { revalidateTag } from "next/cache";
import { clearSummaryCache } from "@/lib/gemini";

export async function regenerateSummary() {
  clearSummaryCache();
  revalidateTag('gemini-market-summary-daily-dynamic');
}
