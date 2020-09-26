void image_init( int image_width, int image_height ) {
	std::cout << "P3\n" << image_width << " " << image_height << "\n255\n";
}

void write_color( std::ostream &out, vec3 color ) {
	out << (int)( 255.99 * color.x ) << " "
	    << (int)( 255.99 * color.y ) << " "
		<< (int)( 255.99 * color.z ) << "\n";
}

void write_color(std::ostream &out, vec3 pixel_color, int samples_per_pixel) {
    float r = pixel_color.x;
    float g = pixel_color.y;
    float b = pixel_color.z;

    float scale = 1.0 / samples_per_pixel;

    r = scale * r;
    g = scale * g;
    b = scale * b;

	r = 1.138 * sqrt(r) - 0.138 * r;
	g = 1.138 * sqrt(g) - 0.138 * g;
	b = 1.138 * sqrt(b) - 0.138 * b;

    out << (int)( 256 * clamp( r, 0.0, 0.999 ) ) << " "
        << (int)( 256 * clamp( g, 0.0, 0.999 ) ) << " "
        << (int)( 256 * clamp( b, 0.0, 0.999 ) ) << "\n";
}

void image_pixel( vec3 color, int samples_per_pixel ) {
	write_color( std::cout, color, samples_per_pixel );
}

void image_finish() {
    std::cerr << "\nDone.\n";
}
