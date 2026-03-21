"use strict";

function distribute_lambert() {
    let a = random( 0, 2 * pi );
    let z = random( -1, 1 );
    let r = sqrt( 1 - z*z );

	return new vec3( r * Math.cos( a ), r * Math.sin( a ), z );
}

function scatter_result( scattered, attenuation, idk ) {
	this.scattered   = scattered
	this.attenuation = attenuation
	this.idk         = idk;
}

function reflect( v, n ) {
	// v - 2 * dot( v, n ) * n
	return vec3.sub( v, vec3.mul( 2, vec3.mul( vec3.dot( v, n ), n ) ) );
}

function schlick( cos_theta, ref_idx ) {
	let r0 = ( 1 - ref_idx ) / ( 1 + ref_idx );
	r0 = r0*r0;
	return r0 + ( 1 - r0 ) * pow( 1 - cos_theta, 5 );
}

function refract( uv, n, etai_over_etat ) {
	let cos_theta = dot( -uv, n );
	let r_out_perp = etai_over_etat * ( uv + cos_theta * n );
	let r_out_parallel = -sqrt( fabs( 1.0 - vec3.length2( r_out_perp ) ) ) * n;
	return r_out_perp + r_out_parallel;
}

export function scatter( h, r ) {
	let result;

	switch ( h.m.type ) {
		case material.type.diffuse:
		let scatter_direction = h.normal + distribute();

		return new scatter_result(
			new ray( h.point, scatter_direction ),
			h.m.albedo,
			true
		);

		case material.type.metal:
		let reflected = reflect( normalize( r.direction ), h.normal );

		return new scatter_result(
			new ray( h.point, reflected + h.m.fuzz * distribute() ), // note should be different distribute
			h.m.albedo,
			dot( result.scattered.direction, h.normal ) > 0
		);

		case material.type.glass:
		let etai_over_etat = h.front_face ? ( 1.0 / h.m.fuzz ) : h.m.fuzz;
		let unit_direction = normalize( r.direction );

		// TODO reuse dot result for reflect below
		let cos_theta = fmin( dot( -unit_direction, h.normal ), 1.0 );
		let sin_theta = sqrt( 1.0 - cos_theta*cos_theta );

		if ( etai_over_etat * sin_theta > 1.0 ) {
			let reflected = reflect( unit_direction, h.normal );

			return new scatter_result(
				new ray( h.point, reflected ),
				new vec3( 1.0, 1.0, 1.0 ),
				true
			);
		}

		let reflect_prob = schlick( cos_theta, etai_over_etat );

		if ( random() < reflect_prob ) {
			let reflected = reflect( unit_direction, h.normal );

			return new scatter_result(
				new ray( h.point, reflected ),
				new vec3( 1.0, 1.0, 1.0 ),
				true
			);
		}

		let refracted = refract( unit_direction, h.normal, etai_over_etat );

		return new scatter_result(
			new ray( h.point, refracted ),
			new vec3( 1.0, 1.0, 1.0 ),
			true,
		);
	}

	return result;
}
