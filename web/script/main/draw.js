"use strict";

// #include "main.h"

import { camera }              from "./camera.js";
import { default as vec3 }     from "./vec3.js";
import { default as material } from "./material.js";
import { ray, hit }            from "./ray.js";
import { scatter }             from "./scatter.js";
import { default as sphere }   from "./sphere.js";
import { random_f } from "./utility.js";




let samples_per_pixel = 8;
let sample_pattern_mask = 0b11;

let sample_pattern = [
	-2  -6,
	 6, -2,
	-6,  2,
	 2,  6
];

function linear_to_srgb( linear ) {
	if ( linear <= 0.0031308 ) return linear * 12.92;
	return 1.055 * pow( linear, 1.0/2.4 ) - 0.055;
}

function write_pixel( color, samples_per_pixel ) {
	let r = color.x;
    let g = color.y;
    let b = color.z;

    let scale = 1.0 / samples_per_pixel;

    r = scale * r;
    g = scale * g;
    b = scale * b;

	r = linear_to_srgb(r);
	g = linear_to_srgb(g);
	b = linear_to_srgb(b);

	data[ data_i++ ] = ( 255 * clamp( r, 0.0, 1.0 ) );
	data[ data_i++ ] = ( 255 * clamp( g, 0.0, 1.0 ) );
	data[ data_i++ ] = ( 255 * clamp( b, 0.0, 1.0 ) );
}



export function main_draw_init() {
	this.spheres = [];
	this.sphere_count = 0;

	this.data = this.context.createImageData( image_width, image_height );
	this.data_i = 0;

	image_init( image_width, image_height );

	// vec3 look_from = { -2.0, 2.0,  1.0 };
	// vec3 look_at   = {  0.0, 0.0, -1.0 };
	// vec3 v_up      = {  0.0, 1.0,  0.0 };
	// camera_init( look_from, look_at, v_up, 20.0, 16.0 / 9.0 );

	// vec3 look_from = { 3.0, 3.0,  2.0 };
	// vec3 look_at   = { 0.0, 0.0, -1.0 };
	// vec3 v_up      = { 0.0, 1.0,  0.0 };
	// float distance_to_focus = length( look_from - look_at );
	// float aperture = 2.0;
	// camera_init( look_from, look_at, v_up, 20.0, 16.0 / 9.0, aperture, distance_to_focus );

	let look_from = new vec3( 13.0, 2.0, 3.0 );
	let look_at   = new vec3(  0.0, 0.0, 0.0 );
	let v_up      = new vec3(  0.0, 1.0, 0.0 );
	let distance_to_focus = 10.0;
	let aperture = 0.1;

	this.camera = new camera();
	this.camera.init( look_from, look_at, v_up, 20.0, aspect_ratio, aperture, distance_to_focus );

	// material material_ground = { diffuse, { 0.8, 0.8, 0.0 } };
    // material material_center = { diffuse, { 0.7, 0.3, 0.3 } };
    // material material_left   = { metal,   { 0.8, 0.8, 0.8 }, 0.3 };
    // material material_right  = { metal,   { 0.8, 0.6, 0.2 }, 1.0 };
	//
	// material material_center = { diffuse, { 0.1, 0.2, 0.5 } };
	// material material_left   = { glass, {}, 1.5 };
	//
    // spheres[ sphere_count++ ] = { {  0.0, -100.5, -1.0 }, 100.0, material_ground };
	// spheres[ sphere_count++ ] = { {  0.0,    0.0, -1.0 },   0.5, material_center };
    // spheres[ sphere_count++ ] = { { -1.0,    0.0, -1.0 },   0.5, material_left   };
	// spheres[ sphere_count++ ] = { { -1.0,    0.0, -1.0 },  -0.4, material_left   };
    // spheres[ sphere_count++ ] = { {  1.0,    0.0, -1.0 },   0.5, material_right  };

	for ( let i = -11; i < 11; i++ ) {
		for ( let j = -11; j < 11; j++ ) {
			let choose_material = random_f();
			let center = new vec3( i + 0.9 * random_f(), 0.2, j + 0.9 * random_f() );

			let temp = new vec3( 4.0, 0.2, 0.0 );

			if ( vec3.length2( center - temp ) > 0.81 ) {
				let sphere_material;

				if ( choose_material < 0.8 ) {
					let albedo = vec3_random() * vec3_random();
					sphere_material = { diffuse, albedo };
				} else if ( choose_material < 0.95 ) {
					let albedo = vec3_random( 0.5, 1.0 );
					let fuzz = random( 0.0, 0.5 );
					sphere_material = new material( metal, albedo, fuzz );
				} else {
					sphere_material = new material( glass, null, 1.5 );
				}

				this.spheres[ this.sphere_count++ ] = new sphere( center, 0.2, sphere_material );
			}
		}
	}

	let material_0 = new material( material.type.diffuse, new vec3( 0.5, 0.5, 0.5 ) );
	let material_1 = new material( material.type.glass,   new vec3( 0.0, 0.0, 0.0 ), 1.5 );
	let material_2 = new material( material.type.diffuse, new vec3( 0.4, 0.2, 0.1 ) );
	let material_3 = new material( material.type.metal,   new vec3( 0.7, 0.6, 0.5 ), 0.0 );

	this.spheres[ this.sphere_count++ ] = new sphere( new vec3(  0.0, -1000.0, 0.0 ), 1000.0, material_0 );
	this.spheres[ this.sphere_count++ ] = new sphere( new vec3(  0.0,     1.0, 0.0 ),    1.0, material_1 );
	this.spheres[ this.sphere_count++ ] = new sphere( new vec3( -4.0,     1.0, 0.0 ),    1.0, material_2 );
	this.spheres[ this.sphere_count++ ] = new sphere( new vec3(  4.0,     1.0, 0.0 ),    1.0, material_3 );

	this.hit_world = function( r, t_min, t_max ) {
		let champ = new hit();

		for ( let i = 0; i < this.sphere_count; i++ ) {
			let result = sphere.hit( this.spheres[i], r, t_min, t_max );

			if ( result.t != 0 ) {
				champ = result;
				t_max = result.t;
			}
		}

		return champ;
	}

	this.ray_color = function( r, depth ) {
		let black = new vec3( 0, 0, 0 );
		if ( depth <= 0 ) return black;

		let result = this.hit_world( r, 0.001, Number.POSITIVE_INFINITY );

		if ( result.t != 0 ) {
			// // return 0.5 * ray_color( (ray){ result.point, result.normal + distribute_lambert() }, depth - 1 );
			// ray temp = { result.point, result.normal + distribute_lambert() };
			// return 0.5 * ray_color( temp, depth - 1 );

			let s = scatter( result , r );
			if ( s.idk ) return s.attenuation * this.ray_color( s.scattered, depth - 1 );
			return black;
		}

		let unit_direction = normalize( r.direction );
		let t = 0.5 * ( unit_direction.y + 1.0 );

		let color_a = new vec3( 1.0, 1.0, 1.0 );
		let color_b = new vec3( 0.5, 0.7, 1.0 );

		return ( 1.0 - t ) *  color_a  + t * color_b;
	}

	this.draw = function() {
		for ( let y = image_height - 1; y >= 0; y-- ) {
			console.log( "Scanlines remaining: " + y );

			for ( let x = 0; x < image_width; x++ ) {
				let color = new vec3( 0, 0, 0 );

				for ( let k = 0; k < samples_per_pixel; k++ ) {
					let u = ( x + sample_pattern[ ( k & sample_pattern_mask ) * 2 + 0 ] / 16.0 ) / ( image_width  - 1 );
					let v = ( y + sample_pattern[ ( k & sample_pattern_mask ) * 2 + 1 ] / 16.0 ) / ( image_height - 1 );
					let r = this.camera.get_ray( this.camera, u, v );
					color = color + this.ray_color( r, 50 );
				}

				write_pixel( color, samples_per_pixel );
			}
		}

		image_finish();
	}
}
