"use strict";

import { default as vec3 } from "./vec3.js";
import { ray_t, hit_t } from "./ray.js"

export default function sphere_t( center, radius, m ) {
	this.center = center;
	this.radius = radius;
	this.m = m;
}

sphere_t.hit = function( s, ray, t_min, t_max ) {
	let oc = vec3.sub( ray.origin, s.center );
	let a = vec3.length2( ray.direction );
	let b = vec3.dot( oc, ray.direction );
	let c = vec3.length2( oc ) - s.radius * s.radius;
	let d = b * b - a * c;
	if ( d <= 0 ) return;

	let r = Math.sqrt( d );
	let t = ( b - r ) / a;

	if ( t > t_min && t < t_max ) {
		hit = new hit_t();
		hit.t = t;
		hit.point = ray_t.at( ray, h.t );
		let n = vec3.div( vec3.sub( h.point, s.center ), s.radius );
		hit.set_face_normal( ray, n );
		hit.m = s.m;
		return h;
	}

	t = ( b + r ) / a;

	if ( t > t_min && t < t_max ) {
		hit = new hit_t();
		hit.t = t;
		hit.point = ray_t.at( ray, h.t );
		let n = vec3.div( vec3.sub( h.point, s.center ), s.radius );
		hit.set_face_normal( ray, n );
		hit.m = s.m;
		return h;
	}
}
