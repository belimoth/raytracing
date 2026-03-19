struct vec3 {
	float x, y, z;
};

inline vec3 operator+( const vec3 &a, const vec3 &b ) {
	vec3 result = {
		a.x + b.x,
		a.y + b.y,
		a.z + b.z
	};

	return result;
}

inline vec3 operator-( const vec3 &a ) {
	vec3 result = {
		-a.x,
		-a.y,
		-a.z
	};

	return result;
}

inline vec3 operator-( const vec3 &a, const vec3 &b ) {
	vec3 result = {
		a.x - b.x,
		a.y - b.y,
		a.z - b.z
	};

	return result;
}

inline vec3 operator*( const vec3 &a, const vec3&b ) {
	vec3 result = {
		a.x * b.x,
		a.y * b.y,
		a.z * b.z
	};

	return result;
}

inline vec3 operator*( const vec3 &a, float b ) {
	vec3 result = {
		a.x * b,
		a.y * b,
		a.z * b
	};

	return result;
}

inline vec3 operator*( float b, const vec3 &a ) {
	vec3 result = {
		a.x * b,
		a.y * b,
		a.z * b
	};

	return result;
}

inline vec3 operator/( const vec3 &a, double b ) {
	return (1/b) * a;
}

inline float dot( const vec3 &a, const vec3 &b ) {
	return a.x * b.x + a.y * b.y + a.z * b.z;
}

inline vec3 cross( const vec3 u, const vec3 &v ) {
	vec3 result = {
		u.y * v.z - u.z * v.y,
		u.z * v.x - u.x * v.z,
		u.x * v.y - u.y * v.x
	};

	return result;
}

inline float length2( const vec3 &a ) {
	return dot( a, a );
}

inline float length( const vec3 &a ) {
	return sqrt( length2( a ) );
}

inline vec3 normalize( vec3 a ) {
	return a * ( 1.0 / length( a ) );
}

vec3 vec3_random() {
	vec3 result = {
		random(),
		random(),
		random()
	};

	return result;
}

vec3 vec3_random( float min, float max ) {
	vec3 v_min = { min, min, min };
	return ( max - min ) * vec3_random() + v_min;
}
