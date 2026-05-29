"use server";

import { revalidatePath } from "next/cache";
import { clearSummaryCache } from "@/lib/gemini";

export async function regenerateSummary() {
  clearSummaryCache();
  revalidatePath('/dashboard');
}
