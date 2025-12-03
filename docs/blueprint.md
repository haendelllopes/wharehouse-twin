# **App Name**: Warehouse Twin

## Core Features:

- 3D Warehouse Visualization: Render a 3D warehouse floor and dynamically display structures (racks, floor blocks) based on data. Color-code structures based on occupancy.
- Interactive Details Panel: On hover, highlight structures. On click, open a sidebar panel with address, status, occupancy, and product list.
- Layout Simulator: Enable 'Edit Mode' to drag and drop structures with 'Snap to Grid'. Display a shadow/ghost of the new position during dragging.
- AI-Powered Performance Insights: Overlay to display a 'Performance Score' (0-100) and AI-generated insights based on data analysis. Use AI as a tool for discovering sub-optimal layouts.
- Report Export: Export a PDF report with a visual summary and a list of AI suggestions for layout improvements.
- Local Storage Persistence: Persist modified layout states locally to enable AI score recalculation during sessions. To implement in memory or using LocalStorage.
- Alert Indicator: Provides pulsing alert indicator when any of the structures are overloaded.

## Style Guidelines:

- Primary color: Deep blue (#1E3A8A), conveying professionalism and a data-driven focus.
- Background color: Very light gray (#F9FAFB), providing a clean and unobtrusive backdrop.
- Accent color: Bright cyan (#06B6D4), used to highlight interactive elements and important data points, analogous to the primary blue for visual harmony, but with a much different lightness and saturation for contrast.
- Body and headline font: 'Inter', a grotesque-style sans-serif known for its modern, objective look suitable for both headlines and body text.
- Use Lucide React Icons for a consistent, modern look.
- Use Tailwind CSS to create a responsive layout with clear data visualization and a focus on usability.
- Use subtle animations to highlight interactive elements and provide feedback.