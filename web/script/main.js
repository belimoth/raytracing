"use strict";

// import { main_draw_init } from "./main/draw.js";

import { default as vec3 } from "./main/vec3.js";
import { ray_t, hit_t } from "./main/ray.js";
import { default as sphere_t } from "./main/sphere.js";

// canvas {
// 	display: block;
// 	width: 320px;
// 	height: 240px;
// 	border: 1px solid #FFF;
// }

function canvas_t( size, type = "2d") {
	this.size = size;
	this.type = type;

	this.el = document.createElement( "canvas" );

	this.el.width  = size.x;
	this.el.height = size.y;

	document.body.appendChild( this.el );
}

canvas_t.prototype.get_context = function() {
	let context = this.el.getContext( this.type );

	context.mozImageSmoothingEnabled    = false;
	context.webkitImageSmoothingEnabled = false;
	context.msImageSmoothingEnabled     = false;
	context.imageSmoothingEnabled       = false;

	return context
}

function sleep( ms ) {
	return new Promise( resolve => setTimeout( resolve, ms ) );
}

function i_to_xy( i, size ) {
	let j = i / 4;
	let x = j % size.x;
	let y = ( j - x ) / size.x;
	return { x, y };
}

function push( data, i, color ) {
	data[ i + 0 ] = 0xFF * color.x;
	data[ i + 1 ] = 0xFF * color.y;
	data[ i + 2 ] = 0xFF * color.z;
	data[ i + 3 ] = 0xFF;
}

let main_draw = [];

main_draw[0x00] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

let aspect_ratio = 320 / 240;
let image_width = 320;
let image_height = 240;

let focal_length = 1.0;
let viewport_height = 2.0;
let viewport_width = viewport_height * image_width / image_height;
let camera_center = new vec3( 0, 0, 0 );

let viewport_u = new vec3( viewport_width,   0, 0 );
let viewport_v = new vec3( 0, -viewport_height, 0 );

let pixel_delta_u = vec3.div( viewport_u, image_width );
let pixel_delta_v = vec3.div( viewport_v, image_height );

let viewport_upper_left = vec3.sub( camera_center, new vec3( 0, 0, focal_length ), vec3.div( viewport_u, 2 ), vec3.div( viewport_v, 2 ) );
let pixel00_loc = vec3.add( viewport_upper_left, vec3.mul( vec3.add( pixel_delta_u, pixel_delta_v ), 0.5 ) );

main_draw[0x01] = function( data, size, i, x, y ) {
	function ray_color( ray, depth ) {
		let unit_direction = vec3.normalize( ray.direction );
		let t = 0.5 * ( unit_direction.y + 1.0 );

		let color_a = new vec3( 1.0, 1.0, 1.0 );
		let color_b = new vec3( 0.5, 0.7, 1.0 );

		return vec3.mix( color_a, color_b, t );
	}

	let pixel_center  = vec3.add( pixel00_loc, vec3.mul( pixel_delta_u, x ), vec3.mul( pixel_delta_v, y ) );
	let ray_direction = vec3.sub( pixel_center, camera_center );
	let ray = new ray_t( camera_center, ray_direction );
	let color = ray_color( ray );

	push( data, i, color );
};

main_draw[0x02] = function( data, size, i, x, y ) {
	function hit_sphere( s, ray ) {
		let oc = vec3.sub( s.center, ray.origin );
		let a = vec3.length2( ray.direction );
		let b = vec3.dot( ray.direction, oc );
		let c = vec3.length2( oc ) - s.radius * s.radius;
		let d = b * b - a * c;
		return ( d >= 0 );
	}

	function ray_color( ray, depth ) {
		let s = new sphere_t( new vec3( 0, 0, -1 ), 0.5 );
		let h = hit_sphere( s, ray );
		if ( h ) return new vec3( 1.0, 1.0, 0.0 );

		let unit_direction = vec3.normalize( ray.direction );
		let t = 0.5 * ( unit_direction.y + 1.0 );

		let color_a = new vec3( 1.0, 1.0, 1.0 );
		let color_b = new vec3( 0.5, 0.7, 1.0 );

		return vec3.mix( color_a, color_b, t );
	}

	let pixel_center  = vec3.add( pixel00_loc, vec3.mul( pixel_delta_u, x ), vec3.mul( pixel_delta_v, y ) );
	let ray_direction = vec3.sub( pixel_center, camera_center );
	let ray = new ray_t( camera_center, ray_direction );
	let color = ray_color( ray );

	push( data, i, color );
};

main_draw[0x03] = function( data, size, i, x, y ) {
	function hit_sphere( s, ray ) {
		let oc = vec3.sub( s.center, ray.origin );
		let a = vec3.length2( ray.direction );
		let b = vec3.dot( ray.direction, oc );
		let c = vec3.length2( oc ) - s.radius * s.radius;
		let discriminant = b * b - a * c;
		if ( discriminant <= 0 ) return -1;
		return ( b - Math.sqrt( discriminant ) ) / a;
	}

	function ray_color( ray, depth ) {
		let s = new sphere_t( new vec3( 0, 0, -1 ), 0.5 );
		let h = hit_sphere( s, ray );

    	if ( h > 0 ) {
			let a = ray_t.at( ray, h );
			let b = new vec3( 0, 0, -1 );
    	    let n = vec3.normalize( vec3.sub( a, b ) );
    	    return vec3.mul( new vec3( n.x + 1, n.y + 1, n.z + 1 ), 0.5 );
    	}

		let unit_direction = vec3.normalize( ray.direction );
		let t = 0.5 * ( unit_direction.y + 1.0 );

		let color_a = new vec3( 1.0, 1.0, 1.0 );
		let color_b = new vec3( 0.5, 0.7, 1.0 );

		return vec3.mix( color_a, color_b, t );
	}

	let pixel_center  = vec3.add( pixel00_loc, vec3.mul( pixel_delta_u, x ), vec3.mul( pixel_delta_v, y ) );
	let ray_direction = vec3.sub( pixel_center, camera_center );
	let ray = new ray_t( camera_center, ray_direction );
	let color = ray_color( ray );

	push( data, i, color );
};

main_draw[0x04] = function( data, size, i, x, y ) {
	let sphere = [];

	sphere.push( new sphere_t( new vec3( 0, 0, -1 ), 0.5 ) );
	sphere.push( new sphere_t( new vec3( 0, -100.5, -1 ), 100 ) );

	function hit_sphere( s, ray ) {
		let oc = vec3.sub( s.center, ray.origin );
		let a = vec3.length2( ray.direction );
		let b = vec3.dot( ray.direction, oc );
		let c = vec3.length2( oc ) - s.radius * s.radius;
		let d = b * b - a * c;
		if ( d <= 0 ) return -1;
		return ( b - Math.sqrt( d ) ) / a;
	}

	function hit_world( ray ) {
		let t_champ = Number.POSITIVE_INFINITY;

		for ( let i = 0; i < sphere.length; i++ ) {
			let t = hit_sphere( sphere[i], ray );
			if ( t > 0 && t < t_champ ) t_champ = t;
		}

		if ( t_champ == Number.POSITIVE_INFINITY ) t_champ = 0;
		return t_champ;
	}

	function ray_color( ray, depth ) {
		let h = hit_world( ray );

    	if ( h > 0 ) {
			let a = ray_t.at( ray, h );
			let b = new vec3( 0, 0, -1 );
    	    let n = vec3.normalize( vec3.sub( a, b ) );
    	    return vec3.mul( new vec3( n.x + 1, n.y + 1, n.z + 1 ), 0.5 );
    	}

		let unit_direction = vec3.normalize( ray.direction );
		let t = 0.5 * ( unit_direction.y + 1.0 );

		let color_a = new vec3( 1.0, 1.0, 1.0 );
		let color_b = new vec3( 0.5, 0.7, 1.0 );

		return vec3.mix( color_a, color_b, t );
	}

	let pixel_center  = vec3.add( pixel00_loc, vec3.mul( pixel_delta_u, x ), vec3.mul( pixel_delta_v, y ) );
	let ray_direction = vec3.sub( pixel_center, camera_center );
	let ray = new ray_t( camera_center, ray_direction );
	let color = ray_color( ray );

	push( data, i, color );
};

main_draw[0x05] = function( data, size, i, x, y ) {
	let sphere = [];

	sphere.push( new sphere_t( new vec3( 0, 0, -1 ), 0.5 ) );
	sphere.push( new sphere_t( new vec3( 0, -100.5, -1 ), 100 ) );

	function hit_sphere( s, ray ) {
		let oc = vec3.sub( s.center, ray.origin );
		let a = vec3.length2( ray.direction );
		let b = vec3.dot( ray.direction, oc );
		let c = vec3.length2( oc ) - s.radius * s.radius;
		let d = b * b - a * c;
		if ( d <= 0 ) return;

		let hit = new hit_t();
		hit.t = ( b - Math.sqrt( d ) ) / a;
		hit.point = ray_t.at( ray, hit.t );
		let n = vec3.div( vec3.sub( hit.point, s.center ), s.radius );
		hit.set_face_normal( ray, n );
		return hit;
	}

	function hit_world( ray ) {
		let champ = new hit_t();
		champ.t = Number.POSITIVE_INFINITY;

		for ( let i = 0; i < sphere.length; i++ ) {
			let hit = hit_sphere( sphere[i], ray );
			if ( hit && hit.t > 0 && hit.t < champ.t ) champ = hit;
		}

		if ( champ.t == Number.POSITIVE_INFINITY ) champ.t = 0;
		return champ;
	}

	function ray_color( ray, depth ) {
		let hit = hit_world( ray );
    	if ( hit && hit.t > 0) return vec3.mul( vec3.add( hit.normal, new vec3( 1, 1, 1 ) ), 0.5 );

		let unit_direction = vec3.normalize( ray.direction );
		let t = 0.5 * ( unit_direction.y + 1.0 );
		let color_a = new vec3( 1.0, 1.0, 1.0 );
		let color_b = new vec3( 0.5, 0.7, 1.0 );
		return vec3.mix( color_a, color_b, t );
	}

	let pixel_center  = vec3.add( pixel00_loc, vec3.mul( pixel_delta_u, x ), vec3.mul( pixel_delta_v, y ) );
	let ray_direction = vec3.sub( pixel_center, camera_center );
	let ray = new ray_t( camera_center, ray_direction );
	let color = ray_color( ray );

	push( data, i, color );
};







main_draw[0x07] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x08] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x09] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x09] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x0A] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x0B] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x0C] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x0D] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x0E] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x0F] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x10] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x11] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x12] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x13] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x14] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x15] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x16] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x17] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x18] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x19] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x1A] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x1B] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x1C] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

main_draw[0x1D] = function( data, size, i, x, y ) {
	let color = new vec3( x / size.x, y / size.y, 0.2 );
	push( data, i, color );
};

async function main() {
	let size = { x : 320, y : 240 };
	let device_size = { x : Math.floor( size.x / window.devicePixelRatio ), y : Math.floor( size.y / window.devicePixelRatio ) };
	document.body.innerHTML += ( "<style> body { grid-template-columns: repeat(auto-fill, " + device_size.x + "px); grid-auto-rows: " + device_size.y + "px; } </style>" );
	document.body.innerHTML += ( "<style> canvas { transform: scale( " + ( 1.0 / window.devicePixelRatio ) + " ) }</style>" );
	document.body.innerHTML += ( "<style> canvas { margin-left: -" + ( size.x - device_size.x ) / 2 + "px; }</style>" );
	document.body.innerHTML += ( "<style> canvas { margin-top:  -" + ( size.y - device_size.y ) / 2 + "px; }</style>" );

	for ( let j = 0; j < main_draw.length; j ++ ) {
		let canvas  = new canvas_t( size );
		let context = canvas.get_context();

		context.clearRect( 0, 0, size.x, size.y );
		let image_data = context.createImageData( size.x, size.y );
		let data = image_data.data;

		for ( let i = 0; i < data.length; i += 4 ) {
			let { x, y } = i_to_xy( i, size );

			if ( x == 0 && y % 4 == 0 ) {
				await sleep(1);
				context.putImageData( image_data, 0, 0 );
			}

			main_draw[j]( data, size, i, x, y );
		}

		context.putImageData( image_data, 0, 0 );
	}
}

window.addEventListener( "load", main );
