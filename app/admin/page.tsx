import { redirect } from "next/navigation";

/**
 * Floor home is the inventory product register — not the old dense dashboard.
 * Staging / aging / featured still live under More.
 */
export default function AdminIndex() {
  redirect("/admin/inventory");
}
