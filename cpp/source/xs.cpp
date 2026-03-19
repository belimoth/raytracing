#include <stdint.h>

struct xoshiro256ss_state {
	uint64_t s[4];
};

uint64_t rol64( uint64_t x, int32_t k ) {
	return ( x << k ) | ( x >> ( 0x40 - k ) );
}

uint64_t xoshiro256ss( struct xoshiro256ss_state *state ) {
	uint64_t *s = state->s;
	uint64_t const result = rol64( s[1] * 5, 7 ) * 9;
	uint64_t const t = s[1] << 17;

	s[2] ^= s[0];
	s[3] ^= s[1];
	s[1] ^= s[2];
	s[0] ^= s[3];

	s[2] ^= t;
	s[3] = rol64( s[3], 45 );

	return result;
}

inline float random() {
    static xoshiro256ss_state xs;
    return (float)xoshiro256( &xs );
}
