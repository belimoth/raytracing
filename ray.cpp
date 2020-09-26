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
	material m;
};
