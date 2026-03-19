vec3 distribute_lambert() {
    float a = random( 0, 2 * pi );
    float z = random( -1, 1 );
    float r = sqrt( 1 - z*z );

	vec3 result = { r * cos( a ), r * sin( a ), z };
    return result;
}

#define distribute distribute_lambert

struct scatter_result {
	ray scattered;
	vec3 attenuation;
	bool idk;
};

vec3 reflect( vec3 v, vec3 n ) {
	return v - 2 * dot( v, n ) * n;
}

scatter_result scatter( hit h, ray r ) {
	scatter_result result = {};

	switch ( h.m.type ) {
		case diffuse: {
			vec3 scatter_direction = h.normal + distribute();
			result.scattered = { h.point, scatter_direction };
			result.attenuation = h.m.albedo;
			result.idk = true;

			break;
		}

		case metal: {
			vec3 reflected = reflect( normalize( r.direction ), h.normal );
			result.scattered = { h.point, reflected };
			result.attenuation = h.m.albedo;
			result.idk = dot( result.scattered.direction, h.normal ) > 0;
			break;
		}
	}

	return result;
}
