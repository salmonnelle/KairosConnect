import Papa from "papaparse"

export interface RawEventRecord {
  [key: string]: any
  __csvIndex?: number
  __rowIndex?: number
}

export async function loadCsvEvents(csvPaths: string[]): Promise<RawEventRecord[]> {
  const records: RawEventRecord[] = []

  for (let csvIdx = 0; csvIdx < csvPaths.length; csvIdx++) {
    const path = csvPaths[csvIdx];
    const res = await fetch(encodeURI(path))
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
      console.warn(`CSV parse warnings for ${path}`, parsed.errors)
    }
    parsed.data.forEach((row, rowIdx) => {
      records.push({ ...row, __csvIndex: csvIdx, __rowIndex: rowIdx });
    })
  }

  return records
}
