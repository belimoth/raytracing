struct sphere {
	vec3 center;
	float radius;
	material m;
};

hit hit_sphere( sphere s, ray r, float t_min, float t_max ) {
	hit h = {};
	vec3 oc = r.origin - s.center;
	float a = length2( r.direction );
	float half_b = dot( oc, r.direction );
	float c = length2( oc ) - s.radius * s.radius;
	float discriminant = half_b * half_b - a * c;

	if ( discriminant > 0.0 ) {
		float root = sqrt( discriminant );

		float temp = ( -half_b - root ) / a;

		if ( temp > t_min && temp < t_max ) {
			h.t = temp;
			h.point = ray_at( r, h.t );
			h.normal = ( h.point - s.center ) / s.radius;
			h.m = s.m;
			return h;
		}

		temp = ( -half_b + root ) / a;

		if ( temp > t_min && temp < t_max ) {
			h.t = temp;
			h.point = ray_at( r, h.t );
			h.normal = ( h.point - s.center ) / s.radius;
			h.m = s.m;
			return h;
		}
	}

	return h;
}
