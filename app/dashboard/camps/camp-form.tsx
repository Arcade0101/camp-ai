import Link from "next/link";
import type { ReactNode } from "react";
import { campFields, type CampFields } from "./fields";

export function CampForm({
  camp,
  error,
  saved,
  children,
}: {
  camp?: CampFields & { id: string };
  error?: string;
  saved?: boolean;
  children?: ReactNode;
}) {
  const inputClass = "min-h-11 w-full rounded-lg border border-line px-3 py-2";
  return (
    <main className="mx-auto max-w-2xl px-5 py-8 sm:px-8">
      <Link
        href="/dashboard"
        className="text-sm font-semibold text-pine underline"
      >
        Back to dashboard
      </Link>
      <h1 className="mt-5 text-3xl font-bold tracking-tight">
        {camp ? "Edit camp" : "Create camp"}
      </h1>
      {saved && (
        <p role="status" className="mt-4 text-sm text-pine">
          Camp saved.
        </p>
      )}
      {(error === "invalid" || error === "save") && (
        <p role="alert" className="mt-4 text-sm text-red-800">
          {error === "invalid"
            ? "Check the required camp name, date order, and field lengths."
            : "Camp details couldn’t be saved. Please try again."}
        </p>
      )}
      <form
        className="mt-6 grid gap-4 sm:grid-cols-2"
        method="post"
        action="/dashboard/camps/save"
      >
        {camp && <input type="hidden" name="id" value={camp.id} />}
        {campFields.map((field) => (
          <label
            key={field.name}
            className={
              field.type === "textarea"
                ? "grid gap-1 text-sm font-medium sm:col-span-2"
                : "grid gap-1 text-sm font-medium"
            }
          >
            <span>
              {field.label}
              {field.name === "name" ? " (required)" : ""}
            </span>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                defaultValue={camp?.[field.name] ?? ""}
                rows={3}
                maxLength={field.max}
                className={inputClass}
              />
            ) : (
              <input
                name={field.name}
                type={field.type}
                defaultValue={camp?.[field.name] ?? ""}
                required={field.name === "name"}
                maxLength={"max" in field ? field.max : undefined}
                step={field.type === "time" ? "any" : undefined}
                className={inputClass}
              />
            )}
          </label>
        ))}
        <button className="min-h-11 justify-self-start rounded-lg bg-pine px-5 font-semibold text-white hover:bg-ink">
          {camp ? "Save changes" : "Create camp"}
        </button>
      </form>
      {children}
    </main>
  );
}
