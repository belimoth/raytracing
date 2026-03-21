"use strict";

import { default as vec3 } from "./vec3.js";
import { degrees_to_radians, random_f } from "./utility.js";
import { ray, hit } from "./ray.js";

export function camera() {
	// vec3 origin;
	// vec3 lower_left_corner;
	// vec3 horizontal;
	// vec3 vertical;
	// vec3 u, v, w;
	// float lens_radius;

	this.init = function( look_from, look_at, v_up, vfov, aspect_ratio, aperture, focus_distance ) {
		let theta = degrees_to_radians( vfov );
		let h = Math.tan( theta / 2.0 );
		let viewport_height = 2.0 * h;
		let viewport_width = aspect_ratio * viewport_height;

		this.w = vec3.normalize( look_from - look_at );
		this.u = vec3.normalize( vec3.cross( v_up, this.w ) );
		this.v = vec3.cross( this.w, this.u );

		// this.origin = { 0, 0, 0 };
		// this.horizontal = { viewport_width, 0, 0 };
		// this.vertical = { 0, viewport_height, 0 };
		//
		// vec3 temp = vec3{ 0, 0, focal_length };
		// this.lower_left_corner = this.origin - this.horizontal / 2.0 - this.vertical / 2.0 - temp;

		this.origin = look_from;
		this.horizontal = focus_distance * viewport_width * this.u;
		this.vertical = focus_distance * viewport_height * this.v;
		this.lower_left_corner = this.origin - this.horizontal / 2.0 - this.vertical / 2.0 - focus_distance * this.w;

		this.lens_radius = aperture / 2.0;
	}

	function random_in_unit_disc() {
		let p = new vec3();

		while ( true ) {
			p.x = random_f( -1.0, 1.0 );
			p.y = random_f( -1.0, 1.0 );
			p.z = 0.0
			if ( vec3.length2( p ) >= 1.0 ) continue;
			return p;
		}
	}

	this.get_ray = function( s, t ) {
		let rd = vec3.mul( this.lens_radius, random_in_unit_disc() );
		let offset = this.u * rd.x + this.v * rd.y;

		return new ray(
			this.origin + offset,
			this.lower_left_corner + s * this.horizontal + t * this.vertical - this.origin - offset
		);
	}
}

// const float viewport_height = 2.0;
// const float viewport_width = viewport_height * 16.0 / 9.0;
// const float focal_length = 1.0;
