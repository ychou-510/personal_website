import math
import random
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[1]
MODEL_DIR = ROOT / "public" / "models"
BLEND_DIR = ROOT / "assets" / "blender"


CAT_SPECS = [
    {
        "slug": "golden",
        "coat": (0.72, 0.50, 0.27, 1.0),
        "light": (0.94, 0.83, 0.65, 1.0),
        "stripe": (0.46, 0.28, 0.13, 1.0),
        "eye": (0.055, 0.13, 0.075, 1.0),
        "body": (1.05, 0.53, 0.59),
        "rump": 0.61,
        "head": (0.48, 0.44, 0.46),
        "leg": 0.42,
        "paw": 0.19,
        "tail": 0.15,
        "tail_length": 1.22,
        "ear": 0.27,
    },
    {
        "slug": "orange",
        "coat": (0.82, 0.51, 0.22, 1.0),
        "light": (0.97, 0.86, 0.68, 1.0),
        "stripe": (0.55, 0.29, 0.11, 1.0),
        "eye": (0.050, 0.14, 0.070, 1.0),
        "body": (0.91, 0.43, 0.47),
        "rump": 0.49,
        "head": (0.40, 0.37, 0.39),
        "leg": 0.45,
        "paw": 0.16,
        "tail": 0.17,
        "tail_length": 1.30,
        "ear": 0.24,
    },
    {
        "slug": "cream",
        "coat": (0.90, 0.82, 0.68, 1.0),
        "light": (0.99, 0.97, 0.91, 1.0),
        "stripe": (0.66, 0.56, 0.44, 1.0),
        "eye": (0.055, 0.045, 0.038, 1.0),
        "body": (1.13, 0.46, 0.49),
        "rump": 0.51,
        "head": (0.42, 0.38, 0.40),
        "leg": 0.58,
        "paw": 0.17,
        "tail": 0.12,
        "tail_length": 1.38,
        "ear": 0.26,
    },
]


def clamp(value):
    return max(0.0, min(1.0, value))


def make_fur_images(slug, color, seed):
    size = 128
    rng = random.Random(seed)
    heights = []
    pixels = []
    for y in range(size):
        for x in range(size):
            fine = rng.uniform(-1.0, 1.0)
            strand = math.sin(x * 0.43 + math.sin(y * 0.17) * 2.4) * 0.45
            soft = math.sin((x + y) * 0.075) * 0.35
            height = 0.50 + fine * 0.18 + strand * 0.12 + soft * 0.08
            heights.append(height)
            tint = (height - 0.5) * 0.17
            pixels.extend(
                (
                    clamp(color[0] + tint),
                    clamp(color[1] + tint),
                    clamp(color[2] + tint),
                    1.0,
                )
            )

    color_image = bpy.data.images.new(f"{slug}_fur_color", size, size)
    color_image.pixels = pixels
    color_image.pack()

    normal_pixels = []
    strength = 2.0
    for y in range(size):
        for x in range(size):
            left = heights[y * size + (x - 1) % size]
            right = heights[y * size + (x + 1) % size]
            down = heights[((y - 1) % size) * size + x]
            up = heights[((y + 1) % size) * size + x]
            nx = (left - right) * strength
            ny = (down - up) * strength
            nz = 1.0
            length = math.sqrt(nx * nx + ny * ny + nz * nz)
            normal_pixels.extend(
                (
                    nx / length * 0.5 + 0.5,
                    ny / length * 0.5 + 0.5,
                    nz / length * 0.5 + 0.5,
                    1.0,
                )
            )
    normal_image = bpy.data.images.new(f"{slug}_fur_normal", size, size)
    normal_image.colorspace_settings.name = "Non-Color"
    normal_image.pixels = normal_pixels
    normal_image.pack()
    return color_image, normal_image


def fur_material(name, color, seed):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Roughness"].default_value = 0.84
    bsdf.inputs["Base Color"].default_value = color
    if "Coat Weight" in bsdf.inputs:
        bsdf.inputs["Coat Weight"].default_value = 0.12
        bsdf.inputs["Coat Roughness"].default_value = 0.72
    if "Sheen Weight" in bsdf.inputs:
        bsdf.inputs["Sheen Weight"].default_value = 0.34
        bsdf.inputs["Sheen Roughness"].default_value = 0.82

    color_image, normal_image = make_fur_images(name, color, seed)
    color_node = mat.node_tree.nodes.new("ShaderNodeTexImage")
    color_node.image = color_image
    color_node.interpolation = "Linear"
    normal_node = mat.node_tree.nodes.new("ShaderNodeTexImage")
    normal_node.image = normal_image
    normal_map = mat.node_tree.nodes.new("ShaderNodeNormalMap")
    normal_map.inputs["Strength"].default_value = 0.32
    normal_map.inputs["Color"].default_value = (0.5, 0.5, 1.0, 1.0)
    mat.node_tree.links.new(color_node.outputs["Color"], bsdf.inputs["Base Color"])
    mat.node_tree.links.new(normal_node.outputs["Color"], normal_map.inputs["Color"])
    mat.node_tree.links.new(normal_map.outputs["Normal"], bsdf.inputs["Normal"])
    return mat


def material(name, color, roughness=0.72, metallic=0.0, transmission=0.0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = color
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if "Transmission Weight" in bsdf.inputs:
        bsdf.inputs["Transmission Weight"].default_value = transmission
    return mat


def smooth(obj):
    if obj.type == "MESH":
        for polygon in obj.data.polygons:
            polygon.use_smooth = True


def parent_keep_transform(obj, parent):
    bpy.context.view_layer.update()
    world = obj.matrix_world.copy()
    obj.parent = parent
    obj.matrix_parent_inverse = parent.matrix_world.inverted()
    obj.matrix_world = world
    bpy.context.view_layer.update()


def merge_fur_meshes(name, objects, parent, mat, voxel_size, fur_strength):
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.join()
    merged = bpy.context.object
    merged.name = name
    merged.data.materials.clear()
    merged.data.materials.append(mat)

    remesh = merged.modifiers.new("Organic surface", "REMESH")
    remesh.mode = "VOXEL"
    remesh.voxel_size = voxel_size
    remesh.use_smooth_shade = True
    bpy.context.view_layer.objects.active = merged
    bpy.ops.object.modifier_apply(modifier=remesh.name)

    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.02)
    bpy.ops.object.mode_set(mode="OBJECT")

    texture = bpy.data.textures.new(f"{name}_micro_fur", type="CLOUDS")
    texture.noise_scale = voxel_size * 1.45
    texture.noise_depth = 2
    displacement = merged.modifiers.new("Micro fur", "DISPLACE")
    displacement.texture = texture
    displacement.texture_coords = "GLOBAL"
    displacement.mid_level = 0.50
    displacement.strength = fur_strength
    bpy.ops.object.modifier_apply(modifier=displacement.name)
    smooth(merged)
    parent_keep_transform(merged, parent)
    return merged


def sphere(name, location, scale, mat, segments=36, rings=24, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=segments,
        ring_count=rings,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    smooth(obj)
    return obj


def cone(name, location, scale, mat, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cone_add(
        vertices=4,
        radius1=1,
        radius2=0,
        depth=2,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    smooth(obj)
    return obj


def curve_line(name, points, mat, bevel=0.008):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 2
    curve.bevel_depth = bevel
    curve.bevel_resolution = 2
    spline = curve.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for point, coordinate in zip(spline.bezier_points, points):
        point.co = coordinate
        point.handle_left_type = "AUTO"
        point.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    return obj


def create_leg(root, name, x, y, z, length, radius, coat, light, is_back=False):
    pivot = bpy.data.objects.new(f"Leg_{name}", None)
    bpy.context.collection.objects.link(pivot)
    pivot.location = (x, y, z)
    parent_keep_transform(pivot, root)

    upper = sphere(
        f"UpperLeg_{name}",
        (x - (0.08 if is_back else -0.025), y, z - length * 0.10),
        (
            radius * (1.34 if is_back else 0.94),
            radius * (1.12 if is_back else 0.88),
            length * (0.52 if is_back else 0.43),
        ),
        coat,
    )
    parent_keep_transform(upper, pivot)

    knee_x = x - (0.08 if is_back else -0.035)
    knee_z = z - length * (0.40 if is_back else 0.34)
    knee = bpy.data.objects.new(f"Knee_{name}", None)
    bpy.context.collection.objects.link(knee)
    knee.location = (knee_x, y, knee_z)
    parent_keep_transform(knee, pivot)

    lower = sphere(
        f"LowerLeg_{name}",
        (
            knee_x + (0.075 if not is_back else 0.045),
            y,
            knee_z - length * 0.25,
        ),
        (radius * 0.72, radius * 0.68, length * 0.36),
        coat,
    )
    paw = sphere(
        f"Paw_{name}",
        (
            knee_x + radius * (0.72 if not is_back else 0.62),
            y - 0.01,
            z - length * 0.82,
        ),
        (radius * 1.18, radius * 0.90, radius * 0.58),
        light,
    )
    for obj in (lower, paw):
        parent_keep_transform(obj, knee)

    toe_mat = material(f"{name}_toe_line", (0.39, 0.27, 0.20, 1.0), 0.86)
    for toe in (-0.045, 0.045):
        line = curve_line(
            f"Toe_{name}",
            (
                Vector((x + radius * 1.02, y - radius * 0.80, z - length * 0.78 + toe)),
                Vector((x + radius * 1.12, y - radius * 0.84, z - length * 0.82 + toe)),
            ),
            toe_mat,
            0.005,
        )
        parent_keep_transform(line, knee)
    return pivot, knee


def create_cat(spec, cat_index):
    slug = spec["slug"]
    coat = fur_material(f"{slug}_coat", spec["coat"], cat_index * 31 + 7)
    light = fur_material(f"{slug}_light", spec["light"], cat_index * 31 + 17)
    stripe = material(f"{slug}_stripe", spec["stripe"], 0.82)
    iris = material(f"{slug}_iris", spec["eye"], 0.18)
    pupil = material(f"{slug}_pupil", (0.004, 0.003, 0.002, 1.0), 0.08)
    pink = material(f"{slug}_pink", (0.93, 0.48, 0.52, 1.0), 0.58)
    inner_ear = material(f"{slug}_inner_ear", (0.78, 0.45, 0.44, 1.0), 0.86)
    white = material(f"{slug}_highlight", (1.0, 1.0, 1.0, 1.0), 0.08)
    line_mat = material(f"{slug}_line", (0.28, 0.20, 0.17, 1.0), 0.76)
    whisker_mat = material(f"{slug}_whisker", (0.94, 0.91, 0.86, 1.0), 0.48)

    root = bpy.data.objects.new("CatRoot", None)
    bpy.context.collection.objects.link(root)
    root["cat_slug"] = slug

    body_scale = spec["body"]
    body = sphere("Body", (-0.08, 0, 0.82), body_scale, coat, 48, 32)
    rump = sphere(
        "Rump",
        (-body_scale[0] * 0.57, 0, 0.81),
        (spec["rump"], body_scale[1] * 1.02, body_scale[2] * 1.02),
        coat,
        40,
        28,
    )
    shoulder = sphere(
        "Shoulder",
        (body_scale[0] * 0.55, 0, 0.88),
        (body_scale[2] * 0.74, body_scale[1] * 0.92, body_scale[2] * 0.92),
        coat,
    )
    belly = sphere(
        "BellyPatch",
        (0.05, -body_scale[1] * 0.83, 0.62),
        (body_scale[0] * 0.63, 0.035, body_scale[2] * 0.42),
        light,
    )
    for obj in (body, rump, shoulder, belly):
        parent_keep_transform(obj, root)

    head_size = spec["head"]
    head_location = Vector((body_scale[0] * 0.80, -0.015, 1.30))
    neck = sphere(
        "Neck",
        (head_location.x - head_size[0] * 0.46, 0, 1.08),
        (head_size[0] * 0.58, head_size[1] * 0.86, head_size[2] * 0.78),
        coat,
    )
    parent_keep_transform(neck, root)
    body = merge_fur_meshes(
        "Body",
        (body, rump, shoulder, neck),
        root,
        coat,
        0.038,
        0.012,
    )

    for tuft_index in range(4):
        tuft = cone(
            f"ChestTuft_{tuft_index}",
            (
                head_location.x - head_size[0] * (0.55 + tuft_index * 0.12),
                -body_scale[1] * 0.86,
                1.03 - tuft_index * 0.10,
            ),
            (0.12 - tuft_index * 0.01, 0.035, 0.16 - tuft_index * 0.012),
            light,
            rotation=(0, math.radians(18), 0),
        )
        parent_keep_transform(tuft, root)

    head_pivot = bpy.data.objects.new("Head", None)
    bpy.context.collection.objects.link(head_pivot)
    head_pivot.location = head_location
    parent_keep_transform(head_pivot, root)

    head = sphere("HeadMesh", head_location, head_size, coat, 48, 32)
    forehead = sphere(
        "Forehead",
        (head_location.x + head_size[0] * 0.12, head_location.y, head_location.z + head_size[2] * 0.17),
        (head_size[0] * 0.82, head_size[1] * 0.94, head_size[2] * 0.84),
        coat,
        40,
        28,
    )
    parent_keep_transform(head, head_pivot)
    parent_keep_transform(forehead, head_pivot)
    head = merge_fur_meshes(
        "HeadMesh",
        (head, forehead),
        head_pivot,
        coat,
        0.026,
        0.009,
    )

    ear_scale = spec["ear"]
    for side in (-1, 1):
        ear_location = (
            head_location.x - head_size[0] * 0.10,
            side * head_size[1] * 0.62,
            head_location.z + head_size[2] * 0.75,
        )
        ear = cone(
            f"Ear_{'Near' if side < 0 else 'Far'}",
            ear_location,
            (ear_scale * 0.72, ear_scale * 0.40, ear_scale),
            coat,
            rotation=(0, math.radians(-6), 0),
        )
        inner = cone(
            f"EarInner_{'Near' if side < 0 else 'Far'}",
            (ear_location[0] + 0.025, ear_location[1] - side * 0.018, ear_location[2] - 0.01),
            (ear_scale * 0.43, ear_scale * 0.18, ear_scale * 0.66),
            inner_ear,
            rotation=(0, math.radians(-6), 0),
        )
        parent_keep_transform(ear, head_pivot)
        parent_keep_transform(inner, head_pivot)

    # Near-side eye is dominant in the three-quarter side view; the far eye is subtler.
    for side, eye_scale in ((-1, 1.0), (1, 0.88)):
        eye_location = (
            head_location.x + head_size[0] * 0.68,
            side * head_size[1] * 0.44,
            head_location.z + head_size[2] * 0.12,
        )
        eye = sphere(
            f"Eye_{'Near' if side < 0 else 'Far'}",
            eye_location,
            (0.112 * eye_scale, 0.052, 0.125 * eye_scale),
            iris,
            32,
            20,
        )
        pupil_obj = sphere(
            f"Pupil_{'Near' if side < 0 else 'Far'}",
            (eye_location[0] + 0.025, eye_location[1] - side * 0.038, eye_location[2]),
            (0.046 * eye_scale, 0.021, 0.082 * eye_scale),
            pupil,
            24,
            16,
        )
        shine = sphere(
            f"EyeShine_{'Near' if side < 0 else 'Far'}",
            (eye_location[0] + 0.056, eye_location[1] - side * 0.058, eye_location[2] + 0.054),
            (0.020, 0.010, 0.024),
            white,
            16,
            10,
        )
        for obj in (eye, pupil_obj, shine):
            parent_keep_transform(obj, head_pivot)

    muzzle_x = head_location.x + head_size[0] * 0.70
    muzzle_z = head_location.z - head_size[2] * 0.22
    for side in (-1, 1):
        muzzle = sphere(
            f"Muzzle_{'Near' if side < 0 else 'Far'}",
            (muzzle_x, side * head_size[1] * 0.30, muzzle_z),
            (head_size[0] * 0.31, head_size[1] * 0.31, head_size[2] * 0.26),
            light,
            32,
            22,
        )
        parent_keep_transform(muzzle, head_pivot)
    chin = sphere(
        "Chin",
        (muzzle_x - 0.02, 0, muzzle_z - head_size[2] * 0.21),
        (head_size[0] * 0.25, head_size[1] * 0.34, head_size[2] * 0.16),
        light,
    )
    nose = cone(
        "Nose",
        (muzzle_x + head_size[0] * 0.27, 0, muzzle_z + head_size[2] * 0.09),
        (0.070, 0.058, 0.052),
        pink,
        rotation=(0, math.radians(90), 0),
    )
    parent_keep_transform(chin, head_pivot)
    parent_keep_transform(nose, head_pivot)

    for side in (-1, 1):
        cheek_tuft = cone(
            f"CheekTuft_{'Near' if side < 0 else 'Far'}",
            (
                head_location.x + head_size[0] * 0.24,
                side * head_size[1] * 0.88,
                head_location.z - head_size[2] * 0.28,
            ),
            (0.15, 0.035, 0.10),
            light,
            rotation=(0, math.radians(84), 0),
        )
        parent_keep_transform(cheek_tuft, head_pivot)

    mouth_center = Vector((muzzle_x + head_size[0] * 0.17, -head_size[1] * 0.05, muzzle_z - 0.01))
    for side in (-1, 1):
        mouth = curve_line(
            "Mouth",
            (
                mouth_center,
                mouth_center + Vector((0.035, side * 0.05, -0.055)),
                mouth_center + Vector((0.005, side * 0.12, -0.075)),
            ),
            line_mat,
            0.008,
        )
        parent_keep_transform(mouth, head_pivot)

    for side in (-1, 1):
        for offset in (-0.07, 0.0, 0.07):
            start = Vector((muzzle_x + 0.07, side * head_size[1] * 0.34, muzzle_z + offset))
            end = start + Vector((0.34, side * 0.34, offset * 0.16))
            whisker = curve_line("Whisker", (start, end), whisker_mat, 0.006)
            parent_keep_transform(whisker, head_pivot)

    # Soft forehead markings retain each cat's warm shaded-tabby character.
    for stripe_index, z_offset in enumerate((0.23, 0.34, 0.43)):
        mark = sphere(
            f"ForeheadStripe_{stripe_index}",
            (
                head_location.x + head_size[0] * 0.18 - stripe_index * 0.025,
                -head_size[1] * 0.93,
                head_location.z + z_offset,
            ),
            (0.035, 0.012, 0.10 - stripe_index * 0.012),
            stripe,
            18,
            12,
            rotation=(math.radians(-10 + stripe_index * 10), 0, 0),
        )
        parent_keep_transform(mark, head_pivot)

    leg_length = spec["leg"]
    radius = spec["paw"]
    leg_x = (-body_scale[0] * 0.59, body_scale[0] * 0.57)
    leg_y = (-body_scale[1] * 0.56, body_scale[1] * 0.56)
    create_leg(root, "BL", leg_x[0], leg_y[0], 0.55, leg_length, radius, coat, light, True)
    create_leg(root, "BR", leg_x[0], leg_y[1], 0.55, leg_length, radius, coat, light, True)
    create_leg(root, "FL", leg_x[1], leg_y[0], 0.57, leg_length, radius, coat, light)
    create_leg(root, "FR", leg_x[1], leg_y[1], 0.57, leg_length, radius, coat, light)

    tail_base = Vector((-body_scale[0] * 0.86, 0.06, 0.91))
    segment_count = 10
    segment_length = spec["tail_length"] / segment_count
    positions = []
    for index in range(segment_count + 1):
        rise = segment_length * (index * 0.70 - index * index * 0.027)
        positions.append(tail_base + Vector((-segment_length * index * 0.68, 0, rise)))
    tail_parent = root
    tail_pivots = []
    segment_ranges = ((0, 5), (4, 8), (7, 11))
    for tail_index, (start, end) in enumerate(segment_ranges):
        tail_pivot = bpy.data.objects.new(f"Tail_{tail_index}", None)
        bpy.context.collection.objects.link(tail_pivot)
        tail_pivot.location = positions[start]
        parent_keep_transform(tail_pivot, tail_parent)
        tail_curve = curve_line(
            f"TailMesh_{tail_index}",
            positions[start:end],
            coat,
            spec["tail"] * (1.0 - tail_index * 0.08),
        )
        tail_curve.data.bevel_resolution = 4
        tail_curve.data.resolution_u = 4
        parent_keep_transform(tail_curve, tail_pivot)
        tail_pivots.append(tail_pivot)
        tail_parent = tail_pivot

    tail_tip = sphere(
        "TailTip",
        positions[-1],
        (spec["tail"] * 0.82, spec["tail"] * 0.82, spec["tail"] * 0.82),
        coat,
        28,
        18,
    )
    parent_keep_transform(tail_tip, tail_pivots[-1])

    return root


def select_hierarchy(root):
    bpy.ops.object.select_all(action="DESELECT")
    root.select_set(True)
    for obj in root.children_recursive:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = root


def export_cat(root, slug):
    select_hierarchy(root)
    bpy.ops.export_scene.gltf(
        filepath=str(MODEL_DIR / f"cat-{slug}.glb"),
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_materials="EXPORT",
        export_image_format="AUTO",
    )


def main():
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    BLEND_DIR.mkdir(parents=True, exist_ok=True)
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.images):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)

    roots = []
    for cat_index, spec in enumerate(CAT_SPECS):
        root = create_cat(spec, cat_index)
        export_cat(root, spec["slug"])
        roots.append(root)

    for root, x in zip(roots, (-3.0, 0.0, 3.0)):
        root.location.x = x

    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_DIR / "three-cats.blend"))


main()
