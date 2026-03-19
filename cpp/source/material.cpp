enum material_type {
	diffuse,
	metal,
	glass
};

struct material {
	material_type type;
	vec3 albedo;
	float fuzz; // note 0.0 for diffuse, "idx" for glass
};
