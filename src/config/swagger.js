import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PlanCumple API',
            version: '1.0.0',
            description: 'Sistema de gestión de reservas de salones de cumpleaños',
            contact: {
                name: 'Equipo BA',
                email: 'contacto@plancumple.com'
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                JSendSuccess: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success'
                        },
                        data: {
                            type: 'object'
                        }
                    }
                },
                JSendFail: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'fail'
                        },
                        data: {
                            type: 'object'
                        }
                    }
                },
                JSendError: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'error'
                        },
                        message: {
                            type: 'string'
                        }
                    }
                },
                Salon: {
                    type: 'object',
                    properties: {
                        salon_id: {
                            type: 'integer',
                            example: 1
                        },
                        titulo: {
                            type: 'string',
                            example: 'Salón Infantil'
                        },
                        direccion: {
                            type: 'string',
                            example: 'Av. Siempre Viva 123'
                        },
                        capacidad: {
                            type: 'integer',
                            example: 50
                        },
                        importe: {
                            type: 'number',
                            format: 'float',
                            example: 15000.00
                        },
                        latitud: {
                            type: 'number',
                            format: 'float',
                            example: -31.4135
                        },
                        longitud: {
                            type: 'number',
                            format: 'float',
                            example: -64.1811
                        },
                        activo: {
                            type: 'integer',
                            example: 1
                        }
                    }
                },
                Turno: {
                    type: 'object',
                    properties: {
                        turno_id: {
                            type: 'integer',
                            example: 1
                        },
                        hora_inicio: {
                            type: 'string',
                            format: 'time',
                            example: '14:00'
                        },
                        hora_fin: {
                            type: 'string',
                            format: 'time',
                            example: '18:00'
                        },
                        activo: {
                            type: 'integer',
                            example: 1
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Estado',
                description: 'Verificación de estado del servidor'
            },
            {
                name: 'Autenticación',
                description: 'Endpoints de autenticación y autorización'
            },
            {
                name: 'Salones',
                description: 'Gestión de salones de cumpleaños'
            },
            {
                name: 'Turnos',
                description: 'Gestión de turnos y horarios'
            },
            {
                name: 'Reservas',
                description: 'Gestión de reservas'
            },
            {
                name: 'Servicios',
                description: 'Gestión de servicios adicionales'
            },
            {
                name: 'Usuarios',
                description: 'Gestión de usuarios'
            },
            {
                name: 'Notificaciones',
                description: 'Envío de notificaciones'
            },
            {
                name: 'Reportes',
                description: 'Generación de reportes'
            }
        ]
    },
    apis: ['./src/v1/routes/*.js', './src/reservas.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
