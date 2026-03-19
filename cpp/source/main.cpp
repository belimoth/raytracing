#include "main.h"

#include "vec3.cpp"
#include "color.cpp"
#include "material.cpp"
#include "ray.cpp"
#include "scatter.cpp"
#include "sphere.cpp"

// /*
const int scale = 1;
/*/
const int scale = 4;
// */

const int image_width = 400 * scale;
const int image_height = 225 * scale;
const int max_depth = 4;

/*
const int samples_per_pixel = 4;
/*/
const int samples_per_pixel = 32;
// */

const int sample_pattern_mask = 0b11;
const int sample_pattern[8] = {
	-2  -6,
	 6, -2,
	-6,  2,
	 2,  6
};

static uint8_t data[ image_width * image_height * 3 ];

/*
#include "ppm.cpp"
/*/
#include "png.cpp"
// */

#include "camera.cpp"

static int data_i = 0;

float linear_to_srgb( float linear ) {
	if ( linear <= 0.0031308 ) {
		return linear * 12.92;
	}

	return 1.055 * pow( linear, 1.0/2.4 ) - 0.055;
}

void write_pixel( vec3 color, int samples_per_pixel ) {
	float r = color.x;
    float g = color.y;
    float b = color.z;

    float scale = 1.0 / samples_per_pixel;

    r = scale * r;
    g = scale * g;
    b = scale * b;

	r = linear_to_srgb(r);
	g = linear_to_srgb(g);
	b = linear_to_srgb(b);

	data[ data_i++ ] = (uint8_t)( 255 * clamp( r, 0.0, 1.0 ) );
	data[ data_i++ ] = (uint8_t)( 255 * clamp( g, 0.0, 1.0 ) );
	data[ data_i++ ] = (uint8_t)( 255 * clamp( b, 0.0, 1.0 ) );
}

sphere spheres[1024];
int sphere_count = 0;

hit hit_world( ray r, float t_min, float t_max ) {
	hit champ = {};

	for ( int i = 0; i < sphere_count; i++ ) {
		hit result = {};
		result = hit_sphere( spheres[i], r, t_min, t_max );

		if ( result.t != 0 ) {
			champ = result;
			t_max = result.t;
		}
	}

	return champ;
}

vec3 ray_color( ray r, int depth ) {
	vec3 black = {};

	if ( depth <= 0 ) {
        return black;
	}

	hit result;
	result = hit_world( r, 0.001, infinity );

	if ( result.t != 0 ) {
		// // return 0.5 * ray_color( (ray){ result.point, result.normal + distribute_lambert() }, depth - 1 );
		// ray temp = { result.point, result.normal + distribute_lambert() };
		// return 0.5 * ray_color( temp, depth - 1 );

		scatter_result s = scatter( result , r );

		if ( s.idk ) {
			return s.attenuation *  ray_color( s.scattered, depth - 1 );
		}

		return black;
	}

	vec3 unit_direction = normalize( r.direction );
	float t = 0.5 * ( unit_direction.y + 1.0 );

	vec3 color_a = { 1.0, 1.0, 1.0 };
	vec3 color_b = { 0.5, 0.7, 1.0 };
	return ( 1.0 - t ) *  color_a  + t * color_b;
}

int main() {
	image_init( image_width, image_height );
	camera_init();

	material material_ground = { diffuse, { 0.8, 0.8, 0.0 } };
    // material material_center = { diffuse, { 0.7, 0.3, 0.3 } };
    // material material_left   = { metal,   { 0.8, 0.8, 0.8 }, 0.3 };
    material material_right  = { metal,   { 0.8, 0.6, 0.2 }, 1.0 };

	material material_center = { diffuse, { 0.1, 0.2, 0.5 } };
	material material_left   = { glass, {}, 1.5 };

    spheres[ sphere_count++ ] = { {  0.0, -100.5, -1.0 }, 100.0, material_ground };
	spheres[ sphere_count++ ] = { {  0.0,    0.0, -1.0 },   0.5, material_center };
    spheres[ sphere_count++ ] = { { -1.0,    0.0, -1.0 },   0.5, material_left   };
	spheres[ sphere_count++ ] = { { -1.0,    0.0, -1.0 },  -0.4, material_left   };
    spheres[ sphere_count++ ] = { {  1.0,    0.0, -1.0 },   0.5, material_right  };

	for ( int j = image_height - 1; j >= 0; j-- ) {
		std::cerr << "\rScanlines remaining: " << j << " " << std::flush;

		for ( int i = 0; i < image_width; i++ ) {
			vec3 color = { 0, 0, 0 };

			for ( int k = 0; k < samples_per_pixel; k++ ) {
				float u = ( i + sample_pattern[ ( k & sample_pattern_mask ) * 2 + 0 ] / 16.0 ) / ( image_width  - 1 );
				float v = ( j + sample_pattern[ ( k & sample_pattern_mask ) * 2 + 1 ] / 16.0 ) / ( image_height - 1 );
				ray r = get_ray( c, u, v );
				color = color + ray_color( r, 50 );
			}

			write_pixel( color, samples_per_pixel );
		}
	}

	image_finish();
}
