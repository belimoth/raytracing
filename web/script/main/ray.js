"use strict";

import { default as vec3 } from "./vec3.js"

export function ray_t( origin, direction ) {
	this.origin    = origin;
	this.direction = direction;
}

ray_t.at = function( r, t ) {
	return vec3.add( r.origin, vec3.mul( r.direction, t ) );
}

export function hit_t( t, point, normal, front_face, m ) {
	this.t          = t;
	this.point      = point;
	this.normal     = normal;
	this.front_face = front_face;
	this.m          = m;
}

hit_t.prototype.set_face_normal = function( ray, outward_normal ) {
	this.front_face = vec3.dot( ray.direction, outward_normal ) < 0;
	this.normal = this.front_face ? outward_normal : vec3.neg( outward_normal );
}
