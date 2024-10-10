const Joi = require('joi');

class CreateRelease {
    constructor({ name, version, account, region }) {
        // Schema for validation
        const schema = Joi.object({
            name: Joi.string().max(255).required(),       // Name required and should be max 255 characters
            version: Joi.string().max(50).required(),     // Version required and should be max 50 characters
            account: Joi.string().max(255).required(),    // Account required and should be max 255 characters
            region: Joi.string().max(100).required()      // Region required and should be max 100 characters
        });

        // Validate the input based on the schema
        const { error } = schema.validate({ name, version, account, region });

        if (error) {
            throw new Error(error.details[0].message);  // Throw validation error if validation fails
        }

        this.name = name;
        this.version = version;
        this.account = account;
        this.region = region;
    }
}

module.exports = CreateRelease;
