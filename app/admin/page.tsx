import { redirect } from "next/navigation";

/** Floor home — contribution + Add item. */
export default function AdminIndex() {
  redirect("/admin/today");
}
