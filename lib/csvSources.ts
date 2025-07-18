// Central list of all CSV files to aggregate for event data.
// NOTE: These paths are relative to the deployed site root, which corresponds
// to the Next.js `public` folder. Ensure you place the `csvfiles-1` directory
// inside `public` (e.g. `public/csvfiles-1/...`).
//
// We keep the original two demo CSVs for backward-compatibility.

export const CSV_SOURCES: string[] = [
  // Core demo CSVs
  "/data/startup_events.csv",
  "/data/event_planner_events.csv",

  // Additional bulk CSVs (csvfiles-1)
  "/csvfiles-1/Business&Industry Leadership Events 1.csv",
  "/csvfiles-1/Business&Industry Leadership Events 2.csv",
  "/csvfiles-1/Business&Industry Leadership Events 3.csv",
  "/csvfiles-1/Business&Industry Leadership Events 4.csv",
  "/csvfiles-1/Cross Industry.csv",
  "/csvfiles-1/brand activation events.csv",
  "/csvfiles-1/business events.csv",
  "/csvfiles-1/conference registration events.csv",
  "/csvfiles-1/ica_ph_accounting.csv",
  "/csvfiles-1/ica_ph_banking.csv",
  "/csvfiles-1/ica_ph_business_ethics.csv",
  "/csvfiles-1/ica_ph_ecommerce.csv",
  "/csvfiles-1/ica_ph_economics.csv",
  "/csvfiles-1/ica_ph_entrepreneurship.csv",
  "/csvfiles-1/ica_ph_finance.csv",
  "/csvfiles-1/ica_ph_human_resources.csv",
  "/csvfiles-1/ica_ph_insurance.csv",
  "/csvfiles-1/ica_ph_logistics.csv",
  "/csvfiles-1/ica_ph_management.csv",
  "/csvfiles-1/ica_ph_marketing.csv",
  "/csvfiles-1/ica_ph_supply_chain.csv",
  "/csvfiles-1/sample-events.csv",
  "/csvfiles-1/techandinnovation.csv",
];
