"use server";

import { revalidatePath } from "next/cache";

export async function revalidatePortfolio() {
  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/projects");
  revalidatePath("/resume");
  revalidatePath("/contact");
}
