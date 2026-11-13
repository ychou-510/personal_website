from pathlib import Path
import sys

import bpy
from mathutils import Vector

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from export_personal_cats import (
    make_body_material,
    make_eye_materials,
    reset_rig,
    reshape_body,
    reshape_eyes,
)


ROOT = Path(__file__).resolve().parents[1]
BLEND_PATH = ROOT / "assets" / "blender" / "bobo-base.blend"
GLB_PATH = ROOT / "public" / "models" / "bobo-base.glb"
PREVIEW_DIR = ROOT / "assets" / "blender" / "previews"

BOBO = {
    "head_width": 1.34,
    "head_round": 1.18,
    "muzzle_depth": 0.48,
    "ear_height": 0.82,
    "body_width": 1.05,
    "body_round": 1.08,
    "body_length": 0.86,
    "leg_length": 0.8,
    "tail_fluff": 1.65,
    "eye_scale": 1.0,
    "eye_depth_offset": 0.004,
    "base": "#e4bd86",
    "light": "#f4eee1",
    "dark": "#c78c54",
    "tip": "#4f382f",
    "eye": "#4f665c",
}


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def prepare_model():
    armature = bpy.data.objects["Armature.001"]
    body = bpy.data.objects["sculpt.001"]
    eyes = bpy.data.objects["Eye1"]
    root = bpy.data.objects["Domestic cat (rigged)"]
    reset_rig(armature)

    body_original = [vertex.co.copy() for vertex in body.data.vertices]
    eyes_original = [vertex.co.copy() for vertex in eyes.data.vertices]
    original_world = reshape_body(body, body_original, BOBO)
    reshape_eyes(eyes, eyes_original, BOBO)
    make_body_material(body, "orange", original_world, BOBO)
    make_eye_materials(eyes, BOBO, "bobo")

    nose_material = bpy.data.materials.new("Bobo_Pink_Nose")
    nose_material.diffuse_color = (0.74, 0.18, 0.22, 1.0)
    nose_material.use_nodes = True
    nose_shader = nose_material.node_tree.nodes.get("Principled BSDF")
    nose_shader.inputs["Base Color"].default_value = (0.74, 0.18, 0.22, 1.0)
    nose_shader.inputs["Roughness"].default_value = 0.48
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=24,
        ring_count=16,
        location=(0, -0.223, 0.215),
        scale=(0.004, 0.0025, 0.0025),
    )
    nose = bpy.context.object
    nose.name = "Bobo_Pink_Nose"
    nose.data.materials.append(nose_material)
    world_matrix = nose.matrix_world.copy()
    nose.parent = armature
    nose.parent_type = "BONE"
    nose.parent_bone = "Bone.004"
    nose.matrix_world = world_matrix

    subdivision = next(
        (modifier for modifier in body.modifiers if modifier.type == "SUBSURF"), None
    )
    if subdivision:
        subdivision.levels = 2
        subdivision.render_levels = 2
    for modifier in body.modifiers:
        if modifier.type == "PARTICLE_SYSTEM":
            modifier.show_render = False
            modifier.show_viewport = False

    root["cat_name"] = "Bobo"
    root["reference"] = "CAT_REFERENCE.md#Bobo"
    root["phase"] = "base-model-no-animation"
    armature["shared_rig"] = True
    return root, armature, body, eyes, nose


def setup_preview_scene():
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 700
    scene.render.resolution_y = 700
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False
    if scene.world is None:
        scene.world = bpy.data.worlds.new("Bobo_Preview_World")
    scene.world.use_nodes = True
    background = scene.world.node_tree.nodes.get("Background")
    background.inputs["Color"].default_value = (0.36, 0.36, 0.34, 1.0)
    background.inputs["Strength"].default_value = 0.42
    scene.view_settings.look = "Medium High Contrast"
    scene.view_settings.exposure = -0.5

    preview_material = bpy.data.materials.new("Bobo_Preview_Ground")
    preview_material.diffuse_color = (0.52, 0.5, 0.47, 1.0)
    preview_material.use_nodes = True
    preview_material.node_tree.nodes["Principled BSDF"].inputs[
        "Base Color"
    ].default_value = (0.52, 0.5, 0.47, 1.0)
    preview_material.node_tree.nodes["Principled BSDF"].inputs[
        "Roughness"
    ].default_value = 0.95
    bpy.ops.mesh.primitive_plane_add(size=4, location=(0, 0, -0.004))
    ground = bpy.context.object
    ground.name = "Bobo_Preview_Ground"
    ground.data.materials.append(preview_material)

    lights = []
    for name, location, energy, size in (
        ("Bobo_Preview_Key", (-0.55, -0.75, 0.9), 12.0, 0.7),
        ("Bobo_Preview_Fill", (0.7, -0.2, 0.55), 6.0, 0.65),
        ("Bobo_Preview_Rim", (0.15, 0.8, 0.65), 8.0, 0.55),
    ):
        bpy.ops.object.light_add(type="AREA", location=location)
        light = bpy.context.object
        light.name = name
        light.data.energy = energy
        light.data.shape = "DISK"
        light.data.size = size
        look_at(light, (0, 0, 0.15))
        lights.append(light)

    camera_data = bpy.data.cameras.new("Bobo_Preview_Camera")
    camera = bpy.data.objects.new("Bobo_Preview_Camera", camera_data)
    bpy.context.collection.objects.link(camera)
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 0.42
    scene.camera = camera
    return [ground, *lights, camera], camera


def render_preview(camera, location, target, filename, ortho_scale):
    camera.location = location
    camera.data.ortho_scale = ortho_scale
    look_at(camera, target)
    bpy.context.scene.render.filepath = str(PREVIEW_DIR / filename)
    bpy.ops.render.render(write_still=True)


def export_web_model(root, armature, body, eyes, nose, preview_objects):
    for obj in preview_objects:
        obj.hide_render = True
        obj.hide_viewport = True
    for modifier in body.modifiers:
        if modifier.type == "PARTICLE_SYSTEM":
            modifier.show_render = False
            modifier.show_viewport = False

    bpy.ops.object.select_all(action="DESELECT")
    for obj in (root, armature, body, eyes, nose):
        obj.hide_render = False
        obj.hide_viewport = False
        obj.select_set(True)
    bpy.context.view_layer.objects.active = armature
    bpy.ops.export_scene.gltf(
        filepath=str(GLB_PATH),
        export_format="GLB",
        use_selection=True,
        export_apply=False,
        export_yup=True,
        export_materials="EXPORT",
        export_animations=False,
        export_skins=True,
        export_all_influences=True,
    )


def main():
    BLEND_PATH.parent.mkdir(parents=True, exist_ok=True)
    GLB_PATH.parent.mkdir(parents=True, exist_ok=True)
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    root, armature, body, eyes, nose = prepare_model()
    preview_objects, camera = setup_preview_scene()
    render_preview(
        camera,
        (0, -0.82, 0.185),
        (0, -0.02, 0.15),
        "bobo-front.png",
        0.42,
    )
    render_preview(
        camera,
        (0.77, 0.03, 0.19),
        (0, 0.015, 0.15),
        "bobo-side.png",
        0.68,
    )
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))
    export_web_model(root, armature, body, eyes, nose, preview_objects)
    print(f"Saved Blender source: {BLEND_PATH}")
    print(f"Exported web model: {GLB_PATH}")


main()
