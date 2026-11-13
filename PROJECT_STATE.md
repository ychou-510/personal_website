# Project State

## Current Phase

Phase 1: build one reusable British Shorthair base model, starting with Bobo.

## Completed

- Collected three clear Bobo references: front, three-quarter, and side.
- Recorded Bobo's stable visual features in `CAT_REFERENCE.md`.
- Confirmed Blender is available locally.
- Existing website cat renderer and experimental generic models remain available,
  but they are not the approved Bobo model.
- Built Bobo's reusable base mesh from the realistic rigged topology.
- Added Bobo-specific proportions, golden/white coat regions, grey-green eyes,
  pink nose, short-fur bump, thick tail, and dark tail tip.
- Preserved the shared skeletal rig without adding animation clips.
- Exported editable Blender source, website GLB, and front/side validation renders.

## In Progress

- Await visual approval of Bobo's Phase 1 base model.

## Planned Outputs

- `scripts/build_bobo_base.py`
- `assets/blender/bobo-base.blend`
- `public/models/bobo-base.glb`
- `assets/blender/previews/bobo-front.png`
- `assets/blender/previews/bobo-side.png`

All planned Phase 1 outputs now exist.

## Scope Guard

- Do not build the other two cats yet.
- Do not implement the full animation or website interaction system yet.
- Reuse this base mesh and rig in later phases.

## Next Step

After Bobo's front and side proportions are approved, create the shared animation
library beginning with idle, walk, and belly-up.
