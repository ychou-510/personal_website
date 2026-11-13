from pathlib import Path

import bpy


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "models" / "cat-realistic-base.glb"


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    armature = bpy.data.objects["Armature.001"]
    armature.animation_data_clear()
    armature.data.pose_position = "POSE"
    for bone in armature.pose.bones:
        bone.location = (0.0, 0.0, 0.0)
        bone.rotation_mode = "QUATERNION"
        bone.rotation_quaternion = (1.0, 0.0, 0.0, 0.0)
        bone.scale = (1.0, 1.0, 1.0)

    for obj in bpy.data.objects:
        if obj.type != "MESH":
            continue
        for modifier in list(obj.modifiers):
            if modifier.type == "PARTICLE_SYSTEM":
                obj.modifiers.remove(modifier)
        for particle_system in list(obj.particle_systems):
            settings = particle_system.settings
            if settings and settings.users == 0:
                bpy.data.particles.remove(settings)

    body = bpy.data.objects["sculpt.001"]
    subdivision = next(
        (modifier for modifier in body.modifiers if modifier.type == "SUBSURF"),
        None,
    )
    if subdivision:
        subdivision.levels = 1
        subdivision.render_levels = 1

    bpy.ops.object.select_all(action="DESELECT")
    selected = [
        bpy.data.objects["Domestic cat (rigged)"],
        armature,
        bpy.data.objects["Eye1"],
        body,
    ]
    for obj in selected:
        obj.hide_viewport = False
        obj.hide_render = False
        obj.select_set(True)
    bpy.context.view_layer.objects.active = armature

    bpy.ops.export_scene.gltf(
        filepath=str(OUTPUT),
        export_format="GLB",
        use_selection=True,
        export_apply=False,
        export_yup=True,
        export_materials="EXPORT",
        export_image_format="AUTO",
        export_animations=False,
        export_skins=True,
        export_all_influences=True,
    )


main()
