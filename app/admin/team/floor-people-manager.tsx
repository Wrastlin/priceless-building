"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  addFloorPersonAction,
  setFloorPersonActiveAction,
  removeFloorPersonAction,
} from "@/lib/actions/floor-people";

type Person = {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
};

export function FloorPeopleManager({
  initialPeople,
  canManage,
}: {
  initialPeople: Person[];
  canManage: boolean;
}) {
  const [people, setPeople] = useState(initialPeople);
  const [name, setName] = useState("");
  const [pending, start] = useTransition();

  function add(e: React.FormEvent) {
    e.preventDefault();
    const value = name.trim();
    if (!value) return;
    start(async () => {
      const fd = new FormData();
      fd.set("name", value);
      try {
        await addFloorPersonAction(fd);
        setPeople((prev) => [
          ...prev,
          { id: crypto.randomUUID(), name: value, active: true, createdAt: new Date().toISOString() },
        ]);
        setName("");
        toast.success(`Added ${value}. They can pick their name on the floor app.`);
        // Refresh to get real id from server
        window.location.reload();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not add person.");
      }
    });
  }

  return (
    <div className="admin-card p-5">
      <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">
        People <span className="font-normal text-muted-foreground">· Who is working</span>
      </h2>
      <p className="admin-help mt-2">
        Names on the shared employee login. Every photo and save is flagged as the selected person.
      </p>

      {canManage ? (
        <form onSubmit={add} className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Maria"
            aria-label="Person name"
            className="admin-input flex-1"
          />
          <button type="submit" disabled={pending} className="admin-btn admin-btn-primary shrink-0">
            Add person
          </button>
        </form>
      ) : (
        <p className="admin-help mt-3">Only owners can add people.</p>
      )}

      {people.length ? (
        <ul className="mt-4 divide-y divide-border">
          {people.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-foreground">{p.name}</div>
                {!p.active ? <div className="text-xs text-muted-foreground">Paused</div> : null}
              </div>
              {canManage ? (
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    disabled={pending}
                    className="admin-btn admin-btn-ghost px-2 py-1 text-sm"
                    onClick={() => {
                      const next = !p.active;
                      setPeople((prev) =>
                        prev.map((x) => (x.id === p.id ? { ...x, active: next } : x)),
                      );
                      start(async () => {
                        try {
                          await setFloorPersonActiveAction(p.id, next);
                          toast.success(next ? "Resumed." : "Paused.");
                        } catch (err) {
                          setPeople((prev) =>
                            prev.map((x) => (x.id === p.id ? { ...x, active: p.active } : x)),
                          );
                          toast.error(err instanceof Error ? err.message : "Update failed");
                        }
                      });
                    }}
                  >
                    {p.active ? "Pause" : "Resume"}
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    className="admin-btn admin-btn-danger px-2 py-1 text-sm"
                    onClick={() => {
                      const prev = people;
                      setPeople((cur) => cur.filter((x) => x.id !== p.id));
                      start(async () => {
                        try {
                          await removeFloorPersonAction(p.id);
                          toast.success(`Removed ${p.name}.`);
                        } catch (err) {
                          setPeople(prev);
                          toast.error(err instanceof Error ? err.message : "Remove failed");
                        }
                      });
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">No people yet. Add names your crew will select.</p>
      )}
    </div>
  );
}
