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

float schlick( double cos_theta, double ref_idx ) {
	float r0 = ( 1 - ref_idx ) / ( 1 + ref_idx );
	r0 = r0*r0;
	return r0 + ( 1 - r0 ) * pow( 1 - cos_theta, 5 );
}

vec3 refract( vec3 uv, vec3 n, float etai_over_etat ) {
	float cos_theta = dot( -uv, n );
	vec3 r_out_perp = etai_over_etat * ( uv + cos_theta * n );
	vec3 r_out_parallel = -sqrt( fabs( 1.0 - length2( r_out_perp ) ) ) * n;
	return r_out_perp + r_out_parallel;
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

			result.scattered = { h.point, reflected + h.m.fuzz * distribute() }; // note should be different distribute
			result.attenuation = h.m.albedo;
			result.idk = dot( result.scattered.direction, h.normal ) > 0;

			break;
		}

		case glass: {
			float etai_over_etat = h.front_face ? ( 1.0 / h.m.fuzz ) : h.m.fuzz;
			vec3 unit_direction = normalize( r.direction );

			// TODO reuse dot result for reflect below
			float cos_theta = fmin( dot( -unit_direction, h.normal ), 1.0 );
			float sin_theta = sqrt( 1.0 - cos_theta*cos_theta );

			if ( etai_over_etat * sin_theta > 1.0 ) {
				vec3 reflected = reflect( unit_direction, h.normal );

				result.scattered = { h.point, reflected };
				result.attenuation = { 1.0, 1.0, 1.0 };
				result.idk = true;

				break;
			}

			float reflect_prob = schlick( cos_theta, etai_over_etat );

			if ( random() < reflect_prob ) {
				vec3 reflected = reflect( unit_direction, h.normal );

				result.scattered = { h.point, reflected };
				result.attenuation = { 1.0, 1.0, 1.0 };
				result.idk = true;

				break;
			}

			vec3 refracted = refract( unit_direction, h.normal, etai_over_etat );

			result.scattered = { h.point, refracted };
			result.attenuation = { 1.0, 1.0, 1.0 };
			result.idk = true;

			break;
		}
	}

	return result;
}
