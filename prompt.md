Role: Lead Creative Frontend Engineer
Task: Build a sleek, production-ready, modern React + Tailwind CSS web interface for an "AI-Powered Hair Health & Risk Prediction Platform" (Trichology AI).

DESIGN SYSTEM & VISUAL DIRECTION:
- Aesthetics: Dark Mode & Glassmorphism with deep emerald slate gradients, frosted glass overlays (`backdrop-blur-md`), subtle radial glow effects, and modern organic micro-interactions. AVOID generic AI template layouts (no white cards with default blue rounded buttons).
- Theme: Clinical-meets-luxury wellness tech.
- Typography: Inter/Plus Jakarta Sans for clean readability, monospace for metric tags/scores.

CORE REQUIRED MODULES & UI WORKFLOWS:

1. Interactive Diagnostic Intake Form (Step-by-step or Tabbed):
   - Image Acquisition Section: Scalp image drag-and-drop / upload area with visual live upload status, scan-line animation preview, and image validation status.
   - Contextual Questionnaire: Form fields for Age, Gender, Diet (Vegetarian/Non-veg/Vegan), Stress Level (1-10 slider), Sleep Hours, Water Quality/pH (e.g., Hard Water pH ~8.2 indicator or selector), Climate (Hot & Humid/Dry/Cold), and Recent Hair Care Changes.

2. Comprehensive Analysis & Assessment Report Dashboard:
   - Hair Health Score Header: Custom radial ring/gauge displaying Hair Health Score (e.g., 72/100) and color-coded Hair Fall Risk Badge (Low / Moderate / High).
   - Computer Vision Findings Visualizer: Cards showing extracted metrics (Hair Density, Scalp Visibility, Thickness, Texture, Thinning Regions).
   - Explainable AI (XAI) Insight Panel: Visual breakdown (feature-importance bar charts or percentage pills) showing EXACTLY why the risk was predicted (e.g., +35% Hard Water Impact, +25% High Stress, +20% Low Sleep).
   - Interactive Scan Heatmap Simulation: Interactive image wrapper with overlay toggles (e.g., simulate Grad-CAM heatmaps showing scalp visibility / density zones).

3. Evidence-Based Personalized Action Plan:
   - Multi-category wellness cards: Lifestyle Adjustments, Water Quality Solutions (e.g., hard water filters), Nutritional Guidance, and Hair Care Habits.
   - Professional Medical Guidance Notice: Conditional banner advising dermatological consultation when risk is Moderate/High (strictly non-commercial, zero product ads/shampoos).

4. Historical Progress Tracker:
   - Interactive timeline / historical chart tracking Hair Health Score and Risk Level across past scan sessions over time.

TECHNICAL REQUIREMENTS:
- Framework: React (Vite / Next.js SPA) + Tailwind CSS + Lucide Icons + Recharts / Chart.js for XAI visuals.
- Architecture: Maintain modular component structures (`/components/upload`, `/components/assessment`, `/components/xai`, `/components/tracker`).
- State Management: Store mock multi-scan state in LocalStorage or state context so switching between intake form, generated assessment report, and historical tracker is smooth and dynamic.