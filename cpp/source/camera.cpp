struct camera {
	vec3 origin;
	vec3 lower_left_corner;
	vec3 horizontal;
	vec3 vertical;
};

ray get_ray( camera c, float u, float v ) {
	ray r = {
		c.origin,
		c.lower_left_corner + u * c.horizontal + v * c.vertical - c.origin
	};

	return r;
}

camera c = {};

const float viewport_height = 2.0;
const float viewport_width = viewport_height * 16.0 / 9.0;
const float focal_length = 1.0;

function camera_init() {
	c.origin = { 0, 0, 0 };
	c.horizontal = { viewport_width, 0, 0 };
	c.vertical = { 0, viewport_height, 0 };

	vec3 temp = vec3{ 0, 0, focal_length };
	c.lower_left_corner = c.origin - c.horizontal / 2.0 - c.vertical / 2.0 - temp;
}
