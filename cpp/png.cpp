#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "vendor/stb/stb_image_write.h"

void image_init( int width, int height ) {

}

void image_finish() {
	stbi_write_png( "test.png", image_width, image_height, 3, &data, image_width * 3 );
	std::cerr << "\nDone.\n";
}
