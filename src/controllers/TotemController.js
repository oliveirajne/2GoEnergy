const crypto = require('crypto');

const connection = require('../database/connection');

module.exports = {

    async index(request, response) {
        const users = await connection('totem').select('*');

        return response.json(users);
    },

    async create(request, response) {
        const { latitude, longitude } = request.body;

        const id = crypto.randomBytes(3).toString('HEX');

        await connection('totem').insert({
            id,
            latitude,
            longitude,
        });

        return response.json({ id });
    },

};