import { Decimal } from "decimal.js";
import { SuperJSON } from "superjson";

// Register custom serialization for Decimal.js
// Import it in API routes, and initialize in client code
SuperJSON.registerCustom<Decimal, string>(
	{
		isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
		serialize: (v) => v.toJSON(),
		deserialize: (v) => new Decimal(v),
	},
	"decimal.js"
);
