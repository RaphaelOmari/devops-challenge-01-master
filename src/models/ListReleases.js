const Joi = require('joi');

class ListReleases {
    constructor({ limit = 10, offset = 0 }) {
        // Schema for pagination inputs
        const schema = Joi.object({
            limit: Joi.number().integer().min(1).default(10),  // Limit must be an integer
            offset: Joi.number().integer().min(0).default(0)   // Offset must be an integer (Set at 0, so no offset)
        });

        // Validates the input based on the schema above
        const { error, value } = schema.validate({ limit, offset });

        if (error) {
            throw new Error(error.details[0].message);  // Throws validation error if validation fails
        }

        this.limit = value.limit;
        this.offset = value.offset;
    }
}

module.exports = ListReleases;
