const { enrichEvent } = require('../lib/utils/enrichEvent');

// Sample event names to test enrichment logic
const testEvents = [
  "Web3 Summit 2025: Blockchain Innovation",
  "AI Hackathon: Building the Future",
  "Marketing Workshop for Startups",
  "Virtual Pitch Night for Early-Stage Founders",
  "Funding Panel: Meet the VCs",
  "Design Conference: UX/UI Trends",
  "Product Management Meetup",
  "Tech Conference 2025",
  "Business Networking Breakfast",
  "Health Tech Innovation Summit",
  "Free Online Webinar: Introduction to Blockchain",
  "Advanced AI Workshop for Developers"
];

// Test the enrichment function
console.log("Testing Event Enrichment Logic\n");
console.log("=".repeat(60));
console.log("Event Name".padEnd(40), "| Type".padEnd(15), "| Topic".padEnd(15), "| Tags");
console.log("=".repeat(60));

testEvents.forEach(eventName => {
  const { type, topic, tags } = enrichEvent(eventName);
  console.log(
    eventName.substring(0, 37).padEnd(40),
    "| " + type.padEnd(13),
    "| " + topic.padEnd(13),
    "| " + tags.join(", ")
  );
});

console.log("\nEnrichment test complete!");
