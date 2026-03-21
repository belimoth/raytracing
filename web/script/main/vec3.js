"use strict";

function vec3( x, y, z ) {
	this.x = x;
	this.y = y;
	this.z = z;
}

vec3.add = function( a, b, c, d ) {
	if ( d ) return new vec3(
		a.x + b.x + c.x + d.x,
		a.y + b.y + c.y + d.y,
		a.z + b.z + c.z + d.z
	);

	if ( c ) return new vec3(
		a.x + b.x + c.x,
		a.y + b.y + c.y,
		a.z + b.z + c.z
	);

	return new vec3(
		a.x + b.x,
		a.y + b.y,
		a.z + b.z
	);
};

vec3.neg = function( a ) {
	return new vec3(
		-a.x,
		-a.y,
		-a.z
	);
};

vec3.sub = function( a, b, c, d ) {
	if ( d ) return new vec3(
		a.x - b.x - c.x - d.x,
		a.y - b.y - c.y - d.y,
		a.z - b.z - c.z - d.z
	);

	if ( c )return new vec3(
		a.x - b.x - c.x,
		a.y - b.y - c.y,
		a.z - b.z - c.z
	);

	return new vec3(
		a.x - b.x,
		a.y - b.y,
		a.z - b.z
	);
};

vec3.mul = function( a, t ) {
	return new vec3( a.x * t, a.y * t, a.z * t );
};

// vec3.prototype.mul = function( t ) {
// 	return new vec3( this.x * t, this.y * t, this.z * t );
// };

vec3.div = function( a, b ) {
	return vec3.mul( a, 1 / b );
};

vec3.dot = function( a, b ) {
	return a.x * b.x + a.y * b.y + a.z * b.z;
};

vec3.cross = function( u, v ) {
	return new vec3(
		u.y * v.z - u.z * v.y,
		u.z * v.x - u.x * v.z,
		u.x * v.y - u.y * v.x
	);
};

vec3.length2 = function( a ) {
	return vec3.dot( a, a );
};

vec3.normalize = function( a ) {
	return vec3.mul( a, 1 / Math.sqrt( vec3.length2( a ) ) );
};

vec3.random = function( min = null, max = null ) {
	if ( min == null ) return new vec3( random(), random(), random() );
	let v_min = new vec3( min, min, min );
	return ( max - min ) * vec3_random() + v_min;
};

vec3.mix = function( a, b, t ) {
	return vec3.add( vec3.mul( a, t ), vec3.mul( b, 1 - t ) );
};

export default vec3;
