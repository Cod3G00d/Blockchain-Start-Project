'use strict';

const Hapi = require('hapi');
const Blockchain = require('./Blockchain.js');
const Block = require('./dao/block.js');
const Boom = require('boom');
const ValidateUserSignature = require('./bl/validateUseSignature');
const Star = require('./dao/star.js');


// Create a server with a host and port
const server = Hapi.server({
    host: 'localhost',
    port: 8000
});

// Add the route
server.route([{
    method: 'GET',
    path: '/hello',
    handler: function (request, h) {
        return 'hello world';
    }
},
{
    method: 'GET',
    path: '/block/{height}',
    handler: async function (request, h) {
        try {
            let blockchain = new Blockchain();
            let block = await blockchain.getBlockByHeight(request.params.height);
            return block;
        } catch (err) {
            return Boom.badRequest(err.toString());
        }
    }
},
{
    method: 'GET',
    path: '/stars/address:{ADDRESS}',
    handler: async function (request, h) {
        try {
            let blockchain = new Blockchain();
            let block = await blockchain.getBlockbyAddress(request.params.ADDRESS);
            return block;
        } catch (err) {
            return Boom.badRequest(err.toString());
        }
    }
},
{
    method: 'GET',
    path: '/stars/hash:{HASH}',
    handler: async function (request, h) {
        try {
            let blockchain = new Blockchain();
            let block = await blockchain.getBlockbyHash(request.params.HASH);
            return block;
        } catch (err) {
            return Boom.badRequest(err.toString());
        }
    }
},
{
    method: 'POST',
    path: '/block',
    handler: async (request, h) => {

        let validateUser = new ValidateUserSignature();

        try {
            let star = new Star();

            star.address = request.payload.address;
            star.star.dec = request.payload.star.dec;
            star.star.ra = request.payload.star.ra;

            if (request.payload.star.story) {
                if (new Buffer(request.payload.star.story).length > 500) {
                    throw ('Your star story too is long. Maximum size is 500 bytes');
                }
                star.star.story = new Buffer(request.payload.star.story).toString('hex');
            } else {
                throw "Please enter a valid story value"
            }
            star.star.constellation = request.payload.star.constellation;
            star.star.magnitude = request.payload.star.magnitude;
            if (star.address && star.star.dec && star.star.ra && star.star.story) {
                let isValid = await validateUser.isValid(star.address);
                if (isValid) {
                    let chain = new Blockchain();
                    await chain.init();
                    let newblock = await chain.addBlock(new Block(star));
                    validateUser.invalidate(star.address);
                    return newblock;
                } else {
                    throw "Not authorized"
                }
            } else {
                throw "Please enter a valid value"
            }

        } catch (err) {
            return Boom.badRequest(err.toString());
        }
    }
},
{
    method: 'POST',
    path: '/requestValidation',
    handler: async (request, h) => {
        try {
            var payload = request.payload.address
            if (typeof payload != 'undefined' && typeof payload === 'string') {

                let validateUserSignature = new ValidateUserSignature();
                let result = await validateUserSignature.requestValidation(payload);
                let response =
                {
                    "address": result.status.address,
                    "requestTimeStamp": result.status.requestTimeStamp,
                    "message": result.status.message,
                    "validationWindow": result.status.validationWindow
                }

                return response;

            } else {
                throw "Please enter a valid address"
            }
        } catch (err) {
            return Boom.badRequest(err.toString());
        }
    }
},
{
    method: 'POST',
    path: '/message-signature/validate',
    handler: async (request, h) => {
        try {
            var address = request.payload.address;
            var signature = request.payload.signature;

            if ((typeof address != 'undefined' && typeof signature != 'undefined')
                && (typeof address === 'string' && typeof signature != 'undefined')) {

                let validateUserSignature = new ValidateUserSignature();
                let response = await validateUserSignature.signatureValidate(address, signature);

                return response;
            } else {
                throw "Please enter a valid values"
            }
        } catch (err) {
            console.log(err);
            return Boom.badRequest(err.toString());
        }
    }
}
]);

// Start the server
async function start() {
    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log('Server running at:', server.info.uri);
};

start();