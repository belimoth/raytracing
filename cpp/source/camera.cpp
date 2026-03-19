bool camera_cue = false;

struct camera {
	vec3 origin;
	vec3 lower_left_corner;
	vec3 horizontal;
	vec3 vertical;
	vec3 u, v, w;
	float lens_radius;
};

vec3 random_in_unit_disc() {
    while ( true ) {
        vec3 p = { random( -1.0, 1.0 ), random( -1.0, 1.0 ), 0.0 };

		if ( length2( p ) >= 1.0 ) {
			continue;
		}

        return p;
    }
}

ray get_ray( camera c, float s, float t ) {
	vec3 rd = c.lens_radius * random_in_unit_disc();
	vec3 offset = c.u * rd.x + c.v * rd.y;

	ray r = {
		c.origin + offset,
		c.lower_left_corner + s * c.horizontal + t * c.vertical - c.origin - offset
	};

	return r;
}

camera c = {};

// const float viewport_height = 2.0;
// const float viewport_width = viewport_height * 16.0 / 9.0;
// const float focal_length = 1.0;

function camera_init(
	vec3 look_from,
	vec3 look_at,
	vec3 v_up,
	float vfov,
	float aspect_ratio,
	float aperture,
	float focus_distance
) {
	float theta = degrees_to_radians( vfov );
	float h = tan( theta / 2.0 );
	float viewport_height = 2.0 * h;
	float viewport_width = aspect_ratio * viewport_height;

	c.w = normalize( look_from - look_at );
	c.u = normalize( cross( v_up, c.w ) );
	c.v = cross( c.w, c.u );

	// c.origin = { 0, 0, 0 };
	// c.horizontal = { viewport_width, 0, 0 };
	// c.vertical = { 0, viewport_height, 0 };
	//
	// vec3 temp = vec3{ 0, 0, focal_length };
	// c.lower_left_corner = c.origin - c.horizontal / 2.0 - c.vertical / 2.0 - temp;

	c.origin = look_from;
	c.horizontal = focus_distance * viewport_width * c.u;
	c.vertical = focus_distance * viewport_height * c.v;
	c.lower_left_corner = c.origin - c.horizontal / 2.0 - c.vertical / 2.0 - focus_distance * c.w;

	c.lens_radius = aperture / 2.0;

	camera_cue = true;
}
