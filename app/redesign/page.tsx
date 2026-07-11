import { redirect } from "next/navigation";

/**
 * Preview route retired — the rejuvenation redesign now lives on `/`.
 * Keep this redirect so old /redesign bookmarks still land correctly.
 */
export default function RedesignPreviewRedirect() {
  redirect("/");
}
