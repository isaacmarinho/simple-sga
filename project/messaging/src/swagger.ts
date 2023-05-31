const swaggerAutogen = require('swagger-autogen')({ language: 'pt-BR', openapi: '3.0.0'});


const HOST_NAME = process.env.HOST || "localhost";
const HOST_PORT = parseInt(process.env.PORT || "3010", 10);

const doc = {
    info: {
        title: 'Messaging API',
        description: 'Messaging microservice API',
    },
    host: `${HOST_NAME}:${HOST_PORT}`,
    basePath: '/messaging',
    schemes: ['http'],
    '@definitions': {
        Message: {
            type: 'object',
            properties: {
                $queueName: {
                    type: 'string',
                    description: 'Fila de mensagens alvo.'
                },
                $payload: {
                    type: 'object',
                    description: 'Dados da mensagem.',
                    properties: {
                        $recipients: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Lista de e-mails dos destinatários.'
                        },
                        from: {
                            type: 'string',
                            description: 'Email do remetente (opcional)'
                        },
                        $subject: {
                            type: 'string',
                            description: 'Assunto do e-mail'
                        },
                        $body: {
                            type: 'string',
                            description: 'Corpo do e-mail'
                        }
                    }
                }
            }
        }
    }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routers/message.ts', './routers/about.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);