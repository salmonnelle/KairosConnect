import Papa from "papaparse"

export interface RawEventRecord {
  [key: string]: string
}

export async function loadCsvEvents(csvPaths: string[]): Promise<RawEventRecord[]> {
  const records: RawEventRecord[] = []

  for (const path of csvPaths) {
    const res = await fetch(path)
    if (!res.ok) {
      console.error(`Failed to fetch ${path}:`, res.statusText)
      continue
    }
    const text = await res.text()
    const parsed = Papa.parse<RawEventRecord>(text, {
      header: true,
      skipEmptyLines: true,
    })
    if (parsed.errors.length) {
      console.error(`CSV parse error for ${path}`, parsed.errors)
    }
    records.push(...parsed.data)
  }

  return records
}
