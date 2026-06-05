"use server";

import { revalidatePath } from "next/cache";
import { clearSummaryCache, getCachedMarketSummary } from "@/lib/gemini";
import { getUserApiKeys } from "@/lib/keys";

export async function regenerateSummary() {
  clearSummaryCache();
  revalidatePath('/dashboard');
}

export async function generateAiSummaryAction() {
  const keys = await getUserApiKeys();
  const data = await getCachedMarketSummary(keys.gemini, keys.finmind);
  return data;
}
