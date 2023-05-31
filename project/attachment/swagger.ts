const dotenv = require("dotenv");
const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'});

dotenv.config();

const PORT = parseInt(process.env.SERVER_PORT || "3002", 10);
const HOST_NAME = process.env.SERVER_NAME || "localhost";
const doc = {
    info: {
        title: 'Attachment API',
        description: 'Attachment microservice API',
    },
    host: `${HOST_NAME}:${PORT}`,
    basePath: '/attachment',
    schemes: ['http'],
    '@definitions': {
        AttachmentForm: {
            type: 'object',
            properties: {
                $file: {
                    type: 'binary',
                    description: 'Arquivo anexo.'
                },
                $processId: {
                    type: 'string',
                    description: 'Identificador do processo.'
                }
            }
        }
    }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/attachment.ts', './routes/about.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);