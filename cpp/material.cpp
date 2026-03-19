enum material_type {
	diffuse,
	metal
};

struct material {
	material_type type;
	vec3 albedo;
};
