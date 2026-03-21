"use strict";

export function degrees_to_radians( degrees ) {
    return degrees * Math.PI / 180.0;
}

export function random_f() {
    // return Math.random() / ( RAND_MAX + 1.0 );
    return Math.random();
}

export function random_r( min, max ) {
    return min + ( max - min ) * random_f();
}

Math.clamp = function( x, min, max ) {
    if ( x < min ) return min;
    if ( x > max ) return max;
    return x;
}
