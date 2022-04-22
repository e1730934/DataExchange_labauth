module.exports = {
    components: {
        schemas: {
            id: {
                type: 'string',
                required: true,
                unique: true
            },
            User: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        required: true,
                        unique: true
                    },
                    name: {
                        type: 'string',
                        required: true
                    },
                    email: {
                        type: 'string',
                        required: true,
                        unique: true
                    },
                }
            },
            UserInput: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        required: true
                    },
                    email: {
                        type: 'string',
                        required: true,
                        unique: true
                    },
                }
            },
            Error: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                        required: true
                    },
                    code: {
                        type: 'string',
                        required: true
                    }
                }
            }
        }
    }
}
