import fs from "fs"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import { parse } from "csv-parse/sync"

interface CsvRow {
  "Event Name": string
  Date: string
  Location: string
  Focus: string
  Cost: string
  Speakers: string
  URL: string
  "Expected Attendees": string
  "Best For": string
  "Attendee Profile": string
}

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  attendees: number
  rating: number
  category: string
  price: "Free" | "Paid"
  priceAmount?: string
  image: string
  specialFeatures: string[]
  tags: string[]
  url: string
  featured?: boolean
  trending?: boolean
  urgent?: boolean
  targetRoles: string[]
  primaryBenefit: string
  networkingLevel: "low" | "medium" | "high"
  learningIntensity: "light" | "moderate" | "intensive"
  timeCommitment: "short" | "medium" | "long"
  virtualOption: boolean
  roleSpecificValue: { [key: string]: string }
}

function csvToEvents(csvPath: string, category: string, startingId: number): Event[] {
  const csvContent = fs.readFileSync(csvPath, "utf8")
  const records: CsvRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  })

  return records.map((row, idx) => {
    const cost = row.Cost || "Free"
    return {
      id: startingId + idx,
      title: row["Event Name"],
      description: row.Focus || "",
      date: row.Date,
      time: "",
      location: row.Location,
      attendees: parseInt(row["Expected Attendees"].replace(/[^0-9]/g, "")) || 0,
      rating: 4.5,
      category,
      price: /free/i.test(cost) ? "Free" : "Paid",
      priceAmount: cost,
      image: "/placeholder.svg?height=200&width=400",
      specialFeatures: row.Speakers ? row.Speakers.split(/;|,/) : [],
      url: row.URL && row.URL.trim().startsWith("http") ? row.URL.trim() : "",
      tags: [],
      targetRoles: ["founder", "investor", "employee", "corporate", "enthusiast"],
      primaryBenefit: row.Focus || "Networking & Learning",
      networkingLevel: "medium",
      learningIntensity: "moderate",
      timeCommitment: "medium",
      virtualOption: /online/i.test(row.Location),
      roleSpecificValue: {},
    }
  })
}

const __dirname = dirname(fileURLToPath(import.meta.url))

function main() {
  const base = path.resolve(__dirname, "../public/data")
  const plannerCsv = path.join(base, "event_planner_events.csv")
  const startupCsv = path.join(base, "startup_events.csv")

  let idCounter = 1
  const events: Event[] = []

  if (fs.existsSync(plannerCsv)) {
    const ev = csvToEvents(plannerCsv, "planner", idCounter)
    events.push(...ev)
    idCounter += ev.length
  }

  if (fs.existsSync(startupCsv)) {
    const ev = csvToEvents(startupCsv, "startup", idCounter)
    events.push(...ev)
    idCounter += ev.length
  }

  const outPath = path.resolve(__dirname, "../lib/events.json")
  fs.writeFileSync(outPath, JSON.stringify(events, null, 2))
  console.log(`Generated ${events.length} events to ${outPath}`)
}

main()
