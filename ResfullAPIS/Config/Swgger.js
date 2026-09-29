const path = require('path');
const swggerjsdoc = require('swagger-jsdoc');

const SwggerDacument = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hema Theater APIs',
            version: '1.0.0',
            description: 'Movie Booking API Dacumentation'
        },
        servers: [
            {
                url: 'http://localhost:8000',
                description: 'Local Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: [path.join(__dirname, '../Routes/*.js')]
};


const swaggerSpec = swggerjsdoc(SwggerDacument);

module.exports = swaggerSpec;
