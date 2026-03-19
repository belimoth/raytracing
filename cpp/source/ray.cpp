struct ray {
	vec3 origin;
	vec3 direction;
};

vec3 ray_at( const ray& r, float t ) {
	return r.origin + r.direction * t;
}

struct hit {
	float t;
	vec3 point;
	vec3 normal;
	bool front_face;
	material m;
};

inline hit set_face_normal( hit h, ray r, vec3 outward_normal ) {
	h.front_face = dot( r.direction, outward_normal ) < 0;
	h.normal = h.front_face ? outward_normal : -outward_normal;

	return h;
}
