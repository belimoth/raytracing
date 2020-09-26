#include <iostream>

#include <cmath>
#include <cstdlib>
#include <limits>
#include <memory>

using std::sqrt;
using std::pow;

const float infinity = std::numeric_limits<float>::infinity();
const float pi = 3.1415926535897932385;

inline float degrees_to_radians( float degrees ) {
    return degrees * pi / 180.0;
}

inline float random() {
    return rand() / ( RAND_MAX + 1.0 );
}

inline float random( float min, float max ) {
    return min + ( max - min ) * random();
}

inline float clamp(float x, float min, float max) {
    if (x < min) return min;
    if (x > max) return max;
    return x;
}
