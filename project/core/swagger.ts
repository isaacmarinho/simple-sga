const dotenv = require("dotenv");
const swaggerAutogen = require('swagger-autogen')({language: 'pt-BR', openapi: '3.0.0'});

dotenv.config();

const PORT = parseInt(process.env.SERVER_PORT || "3015", 10);
const HOST_NAME = process.env.SERVER_NAME || "localhost";
const doc = {
    info: {
        title: 'Core API',
        description: 'Core microservice API',
    },
    host: `${HOST_NAME}:${PORT}`,
    basePath: '/core',
    schemes: ['http'],
    '@definitions': {
        Process: {
            type: 'object',
            properties: {
                $project: {
                    type: 'string',
                    description: 'Identificador do projeto a que pertence o processo.'
                },
                $code: {
                    type: 'string',
                    description: 'Código identificador do processo.'
                },
                $name: {
                    type: 'string',
                    description: 'Nome do processo.'
                },
                $status: {
                    type: 'string',
                    description: 'Etapa do processo (LP, LI, LO).'
                },
                $valid_since: {
                    type: 'date',
                    description: 'Data de início de vigência do processo.'
                },
                $expiration: {
                    type: 'integer',
                    description: 'Número de anos até a expiração do processo.'
                },
                tags: {
                    type: 'array',
                    description: 'Etiquetas do processo.'
                },
                subscribers: {
                    type: 'array',
                    description: 'Observadores do processo.'
                },
                attachments: {
                    type: 'array',
                    description: 'Anexos do processo.'
                }
            }
        }
    }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/routers/process.ts', './src/routers/about.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);