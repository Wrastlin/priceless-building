# Higgsfield Motion Skills: Multi-Clip Ad Production Guide

This report details the capabilities of the Higgsfield MCP ecosystem for motion graphics and ad creative production, specifically tailored for **Price-Less Building Center**.

## 1. Higgsfield Motion Graphics Toolset
Higgsfield has evolved beyond simple generative video into a structured motion design environment.

*   **Vibe Motion (CodeGen):** Unlike standard diffusion models that generate pixels, Vibe Motion generates **Remotion code**. This allows for "Vibecoding"—chat-based editing of typography, colors, and layout in real-time. Ideal for logo reveals and infographics.
*   **Cinema Studio:** Provides deterministic camera control via **70+ presets** (Bullet Time, Crash Zoom, FPV Drone, 360 Orbit). It features a 4-axis panel (Body, Lens, Focal Length, Aperture) for professional cinematography.
*   **Marketing Studio:** A "URL-to-Ad" workflow. Key for Price-Less is the **Hyper Motion mode**, which produces high-energy, CGI-style product commercials with **NO AI people**.
*   **Video Analyzer:** Converts existing reference clips into structured prompts, breaking down pacing and camera moves.
*   **Post-Production Tools:** Includes native `reframe` (aspect ratio), `upscale_video` (4K), and `remove_background`.

## 2. MCP Capabilities & Limitations
The Higgsfield MCP server (`https://mcp.higgsfield.ai/mcp`) exposes the platform's full power to Claude.

*   **Assembly & Stitching:** The MCP includes the `explainer_video` tool, which can **stitch two or more clips** into a single MP4, add voiceovers, and burn timed captions.
*   **Editable Type:** Vibe Motion assets remain "live" and editable within the Higgsfield UI/Canvas, though the final export to MCP is a rendered file.
*   **Credit Logic:**
    *   **MCP Deductions:** Unlike the Web UI, which offers throttled "Unlimited" modes for specific models (Plus/Ultra), **MCP and CLI usage ALWAYS deducts credits** from your balance.
    *   **Premium Models:** Models like Kling 3.0, Sora 2, and Veo 3.1 are never unlimited and have high credit costs.
*   **Scaling:** The `Supercomputer` tool allows for high-throughput batch generation (e.g., generating 50 variations of an ad at once).

## 3. Recommended Production Pipeline (Price-Less)
Goal: Use real product photos and high-end motion graphics without AI human avatars.

| Duration | Format | Recommended Tools |
| :--- | :--- | :--- |
| **1.5s** | Site Micros | **Vibe Motion** (Kinetic typography/icons) |
| **7-12s** | Feed Ads | **Marketing Studio (Hyper Motion)** or **Cinema Studio** |
| **20s** | Category | **Multi-shot + `explainer_video`** assembly |
| **60s** | Brand Film | **Remotion/HyperFrames** for full composition |

## 4. Higgsfield vs. Remotion/HyperFrames
*   **Use Higgsfield End-to-End** for fast, high-quality product reveals, cinematic camera moves, and simple multi-clip stitching (up to ~30s).
*   **Use Remotion/HyperFrames as Compositor** when you need complex UI overlays, precise data-driven animations, or "infinite" duration brand films that require external API data or complex logic not covered by Higgsfield's presets.

## 5. Plan Tier Advice
For serious production volume:
*   **Plus Plan ($49/mo):** 1,000 credits/mo. Good for testing and small campaigns (~100 images or ~20-30 premium videos).
*   **Ultra Plan ($129/mo):** 3,000+ credits/mo. **Recommended for Price-Less.** It unlocks **Supercomputer** access, higher parallel generation limits (8 videos/8 images), and the lowest cost-per-credit.

## 6. Resources & Tutorials
*   [How To Generate AI Videos From Claude (Higgsfield Blog)](https://higgsfield.ai/blog/Generate-AI-Videos-From-Claude-with-Higgsfield-MCP)
*   [Vibe Motion Guide (Higgsfield)](https://higgsfield.ai/blog/Higgsfield-Vibe-Motion-Guide-AI-Motion-Design)
*   [AI Motion Design hub](https://higgsfield.ai/ai-motion-design)
*   [Vibe Motion review (Chase Jarvis)](https://chasejarvis.com/blog/higgsfield-vibe-motion-is-here-my-honest-review-for-creative-pros/)
*   [YouTube: Vibecoding for Video (Higgsfield)](https://www.youtube.com/watch?v=yvuVH6Zg5Vk)
*   [YouTube: High-End Motion Graphics Control](https://www.youtube.com/watch?v=sCc7O9K92Mg)
*   [YouTube: 15-second Ad Workflow](https://www.youtube.com/watch?v=B6wbbz8UOvA)
*   MCP stitch tool confirmed live: `explainer_video` (join ≥2 clips; assembly free; optional VO/subs)

## 7. Price-Less specific note
Baseline is always **real warehouse/install photos + motion graphics techniques mixed together** (kinetic type, measurement lines, wipes, restrained camera on stills). Hyper Motion / Cinema are supporting plate tools, not a replacement for your photo library. Remotion stays available in Cursor when a 60s brand film needs tighter, reusable composition than HF stitch alone.
