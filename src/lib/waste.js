// Waste Recovery (Figma 37:229, 37:231) — data contoh.
export const PARTNERS = [
  { id: "A", name: "Partner Company A", desc: "Organic waste processing", icon: "recycle", materials: ["Food waste", "Organic materials"], accepts: ["food", "organic"] },
  { id: "B", name: "Partner Company B", desc: "Packaging waste recovery", icon: "box", materials: ["Plastic waste", "Paper"], accepts: ["packaging", "other"] },
];
export const CATEGORIES = [
  { id: "food", name: "Food Waste", sub: "Organic food", label: "Food Waste" },
  { id: "organic", name: "Organic Waste", sub: "Biodegradable", label: "Organic Waste" },
  { id: "packaging", name: "Packaging", sub: "Plastic, cardboard", label: "Packaging Waste" },
  { id: "other", name: "Other Materials", sub: "Other accepted waste", label: "Other Materials" },
];
export const SEED_REQUESTS = [
  { id: "REC-001", what: "Food Waste", kg: 5, partner: "Partner Company A", date: "7 Nov 2026", status: "Pending" },
  { id: "REC-002", what: "Packaging Waste", kg: 10, partner: "Partner Company B", date: "5 Nov 2026", status: "Completed" },
];
export const BASE = { partners: 5, requests: 12, recovered: 45, pending: 2 };
