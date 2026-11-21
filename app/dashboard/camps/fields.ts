export const campFields = [
  { name: "name", label: "Camp name", type: "text", max: 150 },
  { name: "location", label: "Location", type: "text", max: 255 },
  { name: "start_date", label: "Start date", type: "date" },
  { name: "end_date", label: "End date", type: "date" },
  { name: "meeting_time", label: "Meeting time", type: "time" },
  { name: "description", label: "Description", type: "textarea", max: 2000 },
  { name: "instructions", label: "Instructions", type: "textarea", max: 4000 },
] as const;

export type CampFields = Record<
  (typeof campFields)[number]["name"],
  string | null
>;

export function isCampId(value: string) {
  return /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(value);
}

function isDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith("0000"))
    return false;
  const date = new Date(value);
  return (
    Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value
  );
}

export function parseCamp(form: FormData): CampFields | null {
  const values = {} as CampFields;
  for (const field of campFields) {
    const input = form.get(field.name);
    if (input !== null && typeof input !== "string") return null;

    const value = input?.trim() || null;
    if (value) {
      if ("max" in field && value.length > field.max) return null;
      if (field.type === "date" && !isDate(value)) return null;
      if (
        field.type === "time" &&
        !/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,6})?)?$/.test(value)
      )
        return null;
      if (value.includes("\0")) return null;
    }
    values[field.name] = value;
  }

  if (!values.name) return null;
  if (
    values.start_date &&
    values.end_date &&
    values.end_date < values.start_date
  )
    return null;

  return values;
}
