from pathlib import Path
import math

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public" / "models"


VARIANTS = {
    "golden": {
        "output": "cat-yuling-golden.glb",
        "head_width": 1.52,
        "head_round": 1.30,
        "muzzle_depth": 0.44,
        "ear_height": 0.58,
        "body_width": 1.28,
        "body_round": 1.25,
        "body_length": 0.88,
        "leg_length": 0.78,
        "tail_fluff": 2.15,
        "base": "#cda873",
        "light": "#eee2ca",
        "dark": "#a8794e",
        "tip": "#806047",
        "eye": "#314437",
    },
    "orange": {
        "output": "cat-yuling-orange.glb",
        "head_width": 1.40,
        "head_round": 1.23,
        "muzzle_depth": 0.50,
        "ear_height": 0.68,
        "body_width": 1.16,
        "body_round": 1.16,
        "body_length": 0.95,
        "leg_length": 0.91,
        "tail_fluff": 2.48,
        "base": "#d9964e",
        "light": "#f1e3cb",
        "dark": "#a86232",
        "tip": "#614739",
        "eye": "#34483a",
    },
    "cream": {
        "output": "cat-yuling-cream.glb",
        "head_width": 1.52,
        "head_round": 1.31,
        "muzzle_depth": 0.43,
        "ear_height": 0.60,
        "body_width": 1.20,
        "body_round": 1.20,
        "body_length": 0.92,
        "leg_length": 0.82,
        "tail_fluff": 2.26,
        "base": "#f0ede5",
        "light": "#faf8f1",
        "dark": "#c7aa83",
        "tip": "#665c59",
        "eye": "#4b3327",
    },
}


def smoothstep(edge0, edge1, value):
    if edge0 == edge1:
        return float(value >= edge1)
    t = max(0.0, min(1.0, (value - edge0) / (edge1 - edge0)))
    return t * t * (3.0 - 2.0 * t)


def srgb_channel(value):
    return value / 12.92 if value <= 0.04045 else ((value + 0.055) / 1.055) ** 2.4


def color(hex_color):
    value = hex_color.lstrip("#")
    channels = [int(value[index:index + 2], 16) / 255 for index in (0, 2, 4)]
    return tuple(srgb_channel(channel) for channel in channels) + (1.0,)


def mix(first, second, amount):
    amount = max(0.0, min(1.0, amount))
    return tuple(first[index] * (1 - amount) + second[index] * amount for index in range(4))


def ellipse_mask(point, center, radii, feather=0.28):
    distance = math.sqrt(
        sum(((point[index] - center[index]) / radii[index]) ** 2 for index in range(3))
    )
    return 1.0 - smoothstep(1.0 - feather, 1.0, distance)


def group_weight(obj, vertex, names):
    indices = {
        group.index for name in names if (group := obj.vertex_groups.get(name)) is not None
    }
    return max(
        (membership.weight for membership in vertex.groups if membership.group in indices),
        default=0.0,
    )


def clear_particles():
    for obj in bpy.data.objects:
        if obj.type != "MESH":
            continue
        for modifier in list(obj.modifiers):
            if modifier.type == "PARTICLE_SYSTEM":
                obj.modifiers.remove(modifier)


def reset_rig(armature):
    armature.animation_data_clear()
    armature.data.pose_position = "POSE"
    for bone in armature.pose.bones:
        bone.location = (0.0, 0.0, 0.0)
        bone.rotation_mode = "QUATERNION"
        bone.rotation_quaternion = (1.0, 0.0, 0.0, 0.0)
        bone.scale = (1.0, 1.0, 1.0)


def reshape_body(body, original_coordinates, config):
    inverse_world = body.matrix_world.inverted()
    original_world = [body.matrix_world @ coordinate for coordinate in original_coordinates]

    for vertex, source in zip(body.data.vertices, original_world):
        point = source.copy()

        head_front = 1.0 - smoothstep(-0.125, -0.075, source.y)
        head_height = smoothstep(0.105, 0.165, source.z)
        head = head_front * head_height
        point.x *= 1.0 + (config["head_width"] - 1.0) * head
        point.z = 0.208 + (point.z - 0.208) * (
            1.0 + (config["head_round"] - 1.0) * head
        )

        muzzle = (1.0 - smoothstep(-0.215, -0.185, source.y)) * head_height
        point.y = -0.218 + (point.y + 0.218) * (
            1.0 + (config["muzzle_depth"] - 1.0) * muzzle
        )

        ear = (
            smoothstep(0.245, 0.275, source.z)
            * (1.0 - smoothstep(-0.135, -0.105, source.y))
        )
        point.z = 0.24 + (point.z - 0.24) * (
            1.0 + (config["ear_height"] - 1.0) * ear
        )
        point.x *= 1.0 - 0.07 * ear

        body_zone = (
            smoothstep(-0.15, -0.09, source.y)
            * (1.0 - smoothstep(0.13, 0.2, source.y))
            * smoothstep(0.055, 0.105, source.z)
        )
        point.x *= 1.0 + (config["body_width"] - 1.0) * body_zone
        point.y *= 1.0 + (config["body_length"] - 1.0) * body_zone
        point.z = 0.125 + (point.z - 0.125) * (
            1.0 + (config["body_round"] - 1.0) * body_zone
        )

        leg_zone = 1.0 - smoothstep(0.09, 0.145, source.z)
        tail_weight = group_weight(body, vertex, ["tail1", "tail2", "tail3", "tail4", "tail5"])
        point.z = 0.14 + (point.z - 0.14) * (
            1.0 + (config["leg_length"] - 1.0) * leg_zone * (1.0 - tail_weight)
        )

        if tail_weight > 0:
            tail_scale = 1.0 + (config["tail_fluff"] - 1.0) * tail_weight
            point.x *= tail_scale
            tail_center_z = 0.145 + max(0.0, source.y - 0.12) * 0.35
            point.z = tail_center_z + (point.z - tail_center_z) * tail_scale

        vertex.co = inverse_world @ point

    return original_world


def reshape_eyes(eyes, original_coordinates, config):
    inverse_world = eyes.matrix_world.inverted()
    world_coordinates = [eyes.matrix_world @ coordinate for coordinate in original_coordinates]
    eye_scale = config.get(
        "eye_scale", 1.48 if config is VARIANTS["cream"] else 1.42
    )
    eye_centers = {
        -1: Vector((-0.0165, -0.233, 0.2475)),
        1: Vector((0.0165, -0.233, 0.2475)),
    }

    for vertex, source in zip(eyes.data.vertices, world_coordinates):
        side = -1 if source.x < 0 else 1
        center = eye_centers[side]
        point = center + Vector(
            (
                (source.x - center.x) * eye_scale,
                (source.y - center.y) * 0.98,
                (source.z - center.z) * eye_scale,
            )
        )
        point.y += config.get("eye_depth_offset", 0.0)
        vertex.co = inverse_world @ point


def body_color_for(variant, point, vertex, body, config):
    base = color(config["base"])
    light = color(config["light"])
    dark = color(config["dark"])
    tip = color(config["tip"])
    pink = color("#d8918d")

    muzzle = ellipse_mask(point, (0.0, -0.225, 0.198), (0.052, 0.035, 0.044), 0.38)
    chest = ellipse_mask(point, (0.0, -0.105, 0.115), (0.085, 0.11, 0.13), 0.45)
    underside = (1.0 - smoothstep(0.075, 0.125, point.z)) * (
        1.0 - smoothstep(0.14, 0.21, point.y)
    )
    feet = (1.0 - smoothstep(0.032, 0.065, point.z)) * (
        1.0 - group_weight(body, vertex, ["tail1", "tail2", "tail3", "tail4", "tail5"])
    )
    light_amount = max(muzzle, chest, underside * 0.65, feet * 0.72)

    if variant == "cream":
        result = light
        cap = (
            (1.0 - smoothstep(-0.125, -0.085, point.y))
            * smoothstep(0.205, 0.245, point.z)
        )
        saddle = (
            smoothstep(-0.14, -0.075, point.y)
            * (1.0 - smoothstep(0.08, 0.17, point.y))
            * smoothstep(0.16, 0.205, point.z)
        )
        result = mix(result, dark, max(cap, saddle * 0.72))
    else:
        result = mix(base, light, light_amount)
        forehead = (
            (1.0 - smoothstep(-0.13, -0.095, point.y))
            * smoothstep(0.235, 0.27, point.z)
        )
        result = mix(result, dark, forehead * (0.18 if variant == "golden" else 0.28))

    tail_weight = group_weight(body, vertex, ["tail1", "tail2", "tail3", "tail4", "tail5"])
    if variant == "cream":
        result = mix(result, base, tail_weight)
    tail_tip = tail_weight * smoothstep(0.22, 0.275, point.y)
    result = mix(result, tip, tail_tip)

    inner_ear = (
        smoothstep(0.255, 0.285, point.z)
        * (1.0 - smoothstep(-0.13, -0.1, point.y))
        * smoothstep(0.018, 0.035, abs(point.x))
    )
    result = mix(result, pink, inner_ear * 0.44)

    nose = ellipse_mask(point, (0.0, -0.235, 0.201), (0.014, 0.011, 0.012), 0.35)
    return mix(result, pink, nose * 0.92)


def make_body_material(body, variant, original_world, config):
    attributes = body.data.color_attributes
    if attributes.get("CatCoat"):
        attributes.remove(attributes["CatCoat"])
    coat = attributes.new(name="CatCoat", type="BYTE_COLOR", domain="CORNER")
    attributes.active_color = coat
    attributes.render_color_index = list(attributes).index(coat)

    for polygon in body.data.polygons:
        for loop_index in polygon.loop_indices:
            vertex = body.data.vertices[body.data.loops[loop_index].vertex_index]
            point = body.matrix_world @ vertex.co
            coat.data[loop_index].color = body_color_for(
                variant, point, vertex, body, config
            )

    material = bpy.data.materials.new(name=f"YuLing_{variant}_coat")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    vertex_color = nodes.new("ShaderNodeVertexColor")
    vertex_color.layer_name = "CatCoat"
    shader.inputs["Roughness"].default_value = 0.84
    shader.inputs["Metallic"].default_value = 0.0
    shader.inputs["Specular IOR Level"].default_value = 0.3
    noise = nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 120.0
    noise.inputs["Detail"].default_value = 3.2
    noise.inputs["Roughness"].default_value = 0.72
    bump = nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.12
    bump.inputs["Distance"].default_value = 0.012
    links.new(vertex_color.outputs["Color"], shader.inputs["Base Color"])
    links.new(noise.outputs["Fac"], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], shader.inputs["Normal"])
    links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    body.data.materials.clear()
    body.data.materials.append(material)


def make_eye_materials(eyes, config, variant):
    eye_color = color(config["eye"])
    for index, slot in enumerate(eyes.material_slots):
        material = bpy.data.materials.new(name=f"YuLing_{variant}_eye_{index}")
        material.diffuse_color = (0.025, 0.02, 0.018, 1.0) if index == 0 else eye_color
        material.use_nodes = True
        shader = material.node_tree.nodes.get("Principled BSDF")
        shader.inputs["Base Color"].default_value = material.diffuse_color
        shader.inputs["Roughness"].default_value = 0.16 if index == 0 else 0.3
        shader.inputs["Metallic"].default_value = 0.0
        slot.material = material


def export_variant(variant, config, body, eyes, armature, body_original, eyes_original):
    for vertex, coordinate in zip(body.data.vertices, body_original):
        vertex.co = coordinate.copy()
    for vertex, coordinate in zip(eyes.data.vertices, eyes_original):
        vertex.co = coordinate.copy()

    original_world = reshape_body(body, body_original, config)
    reshape_eyes(eyes, eyes_original, config)
    make_body_material(body, variant, original_world, config)
    make_eye_materials(eyes, config, variant)

    bpy.ops.object.select_all(action="DESELECT")
    selected = [
        bpy.data.objects["Domestic cat (rigged)"],
        armature,
        eyes,
        body,
    ]
    for obj in selected:
        obj.hide_viewport = False
        obj.hide_render = False
        obj.select_set(True)
    bpy.context.view_layer.objects.active = armature

    output = OUTPUT_DIR / config["output"]
    bpy.ops.export_scene.gltf(
        filepath=str(output),
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
    print(f"Exported {variant} to {output}")


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    clear_particles()
    armature = bpy.data.objects["Armature.001"]
    body = bpy.data.objects["sculpt.001"]
    eyes = bpy.data.objects["Eye1"]
    reset_rig(armature)

    subdivision = next(
        (modifier for modifier in body.modifiers if modifier.type == "SUBSURF"), None
    )
    if subdivision:
        subdivision.levels = 1
        subdivision.render_levels = 1

    body_original = [vertex.co.copy() for vertex in body.data.vertices]
    eyes_original = [vertex.co.copy() for vertex in eyes.data.vertices]
    for variant, config in VARIANTS.items():
        export_variant(
            variant,
            config,
            body,
            eyes,
            armature,
            body_original,
            eyes_original,
        )


if __name__ == "__main__":
    main()
