/**
 * Enriches event data with type, topic, and tags based on event name
 * @param eventName The name of the event
 * @returns Object containing enriched type, topic, and tags
 */
function enrichEvent(eventName: string): {
  type: string;
  topic: string;
  tags: string[];
} {
  const lower = eventName.toLowerCase();
  const tags: string[] = [];
  let type = "Other";
  let topic = "General";

  // Determine event type based on name
  if (lower.includes("pitch")) {
    type = "Pitch Night";
    tags.push("startup", "early-stage");
  } else if (lower.includes("conference") || lower.includes("summit")) {
    type = "Conference";
    tags.push("flagship", "networking");
  } else if (lower.includes("hackathon")) {
    type = "Hackathon";
    tags.push("coding", "competition");
  } else if (lower.includes("webinar") || lower.includes("online")) {
    type = "Webinar";
    tags.push("virtual");
  } else if (lower.includes("workshop")) {
    type = "Workshop";
    tags.push("hands-on", "learning");
  } else if (lower.includes("meetup")) {
    type = "Meetup";
    tags.push("community", "networking");
  } else if (lower.includes("panel") || lower.includes("discussion")) {
    type = "Panel";
    tags.push("discussion", "insights");
  } else if (lower.includes("expo") || lower.includes("exhibition")) {
    type = "Exhibition";
    tags.push("showcase", "industry");
  }

  // Determine topic based on name
  if (lower.includes("web3") || lower.includes("blockchain") || lower.includes("crypto")) {
    topic = "Web3";
    tags.push("web3", "blockchain");
  } else if (lower.includes("ai") || lower.includes("machine learning") || lower.includes("artificial intelligence")) {
    topic = "AI";
    tags.push("ai", "tech");
  } else if (lower.includes("marketing") || lower.includes("growth")) {
    topic = "Marketing";
    tags.push("marketing", "business");
  } else if (lower.includes("funding") || lower.includes("vc") || lower.includes("investor")) {
    topic = "Startup Funding";
    tags.push("funding", "investment");
  } else if (lower.includes("design") || lower.includes("ux") || lower.includes("ui")) {
    topic = "Design";
    tags.push("design", "creative");
  } else if (lower.includes("product") || lower.includes("management")) {
    topic = "Product";
    tags.push("product", "management");
  } else if (lower.includes("tech") || lower.includes("technology")) {
    topic = "Technology";
    tags.push("tech", "innovation");
  } else if (lower.includes("business") || lower.includes("entrepreneur")) {
    topic = "Business";
    tags.push("business", "entrepreneurship");
  } else if (lower.includes("health") || lower.includes("wellness")) {
    topic = "Health";
    tags.push("health", "wellness");
  } else if (lower.includes("education") || lower.includes("learning")) {
    topic = "Education";
    tags.push("education", "learning");
  }

  // Add format-based tags
  if (lower.includes("online") || lower.includes("virtual") || lower.includes("zoom")) {
    tags.push("online");
  } else {
    tags.push("in-person");
  }

  // Add cost-based tags
  if (lower.includes("free")) {
    tags.push("free");
  }

  // Add audience-based tags
  if (lower.includes("beginner") || lower.includes("introduction")) {
    tags.push("beginner-friendly");
  }
  if (lower.includes("advanced") || lower.includes("expert")) {
    tags.push("advanced");
  }

  // Remove duplicates from tags
  return { 
    type, 
    topic, 
    tags: [...new Set(tags)] 
  };
}
