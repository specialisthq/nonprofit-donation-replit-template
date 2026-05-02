import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import site from "@config";

// Apply theme tokens from site.config.ts to :root at boot.
function applyTheme() {
  const root = document.documentElement;
  const c = site.branding.colors;
  root.style.setProperty("--primary", c.primary);
  root.style.setProperty("--primary-foreground", c.primaryForeground);
  root.style.setProperty("--accent", c.accent);
  root.style.setProperty("--accent-foreground", c.accentForeground);
  root.style.setProperty("--surface", c.surface);
  root.style.setProperty("--surface-muted", c.surfaceMuted);
  root.style.setProperty("--text", c.text);
  root.style.setProperty("--text-muted", c.textMuted);
  root.style.setProperty("--border", c.border);
  root.style.setProperty("--site-font-body", site.typography.bodyFamily);
  root.style.setProperty("--site-font-heading", site.typography.headingFamily);
  document.title = site.org.name;
}

function injectAnalytics() {
  if (!site.analyticsHeadHtml) return;
  const slot = document.createElement("div");
  slot.innerHTML = site.analyticsHeadHtml;
  for (const child of Array.from(slot.children)) {
    document.head.appendChild(child);
  }
}

applyTheme();
injectAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
