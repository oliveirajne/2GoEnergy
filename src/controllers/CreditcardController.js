const JSEncrypt = require('node-jsencrypt');
const MoipCreditCard = require('moip-sdk-js').MoipCreditCard;
const MoipValidator = require('moip-sdk-js').MoipValidator;

const connection = require('../database/connection');

module.exports = {

    async index(request, response) {
        const user_id = request.headers.authorization;
        const credit_cards = await connection('credit_cards')
            .where('user_id', user_id)
            .select('*');

        return response.json(credit_cards);
    },

    async create(request, response) {
        const { number, cvc, expirationMonth, expirationYear } = request.body;
        
        console.log(number);
        const brand = MoipValidator.cardType(number).brand;
        console.log(brand);
        const user_id = request.headers.authorization;

        const pubKey = `-----BEGIN PUBLIC KEY-----
                    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoBttaXwRoI1Fbcond5mS
                    7QOb7X2lykY5hvvDeLJelvFhpeLnS4YDwkrnziM3W00UNH1yiSDU+3JhfHu5G387
                    O6uN9rIHXvL+TRzkVfa5iIjG+ap2N0/toPzy5ekpgxBicjtyPHEgoU6dRzdszEF4
                    ItimGk5ACx/lMOvctncS5j3uWBaTPwyn0hshmtDwClf6dEZgQvm/dNaIkxHKV+9j
                    Mn3ZfK/liT8A3xwaVvRzzuxf09xJTXrAd9v5VQbeWGxwFcW05oJulSFjmJA9Hcmb
                    DYHJT+sG2mlZDEruCGAzCVubJwGY1aRlcs9AQc1jIm/l8JwH7le2kpk3QoX+gz0w
                    WwIDAQAB
                    -----END PUBLIC KEY-----`;

        const hash = await MoipCreditCard
            .setEncrypter(JSEncrypt, 'node')
            .setPubKey(pubKey)
            .setCreditCard({
                number: number,
                cvc: cvc,
                expirationMonth: expirationMonth,
                expirationYear: expirationYear
            })
            .hash()
            .then(hash => { return hash });

        console.log(hash);

        const [id] = await connection('credit_cards').insert({

            hash,
            brand,
            user_id
        });

        return response.json({ id, hash, brand, user_id });
    },

    async delete(request, response) {
        const { id } = request.params;
        const user_id = request.headers.authorization;

        const card = await connection('credit_cards')
            .where('id', id)
            .select('user_id')
            .first();

        if ( card.user_id != user_id ) {
            return response.status(401).json({ error: 'Operation not permitted.' });    
        }

        await connection('credit_cards').where('id', id).delete();

        return response.status(204).send();

    }

};