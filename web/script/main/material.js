"use strict";

function material( type, albedo, fuzz ) {
	this.type   = type;
	this.albedo = albedo;
	this.fuzz   = fuzz; // note 0.0 for diffuse, "idx" for glass
};

material.type = {
	diffuse : 0,
	metal   : 1,
	glass   : 2
};

export default material;
