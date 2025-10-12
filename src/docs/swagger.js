// src/docs/swagger.js
const API_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000'; // <-- use API, not FE

const swaggerSpec = {
    openapi: '3.0.3',
    info: {
        title: 'Inventory Lite API', version: '1.0.0',
        description: 'OAuth (Google) + session cookie protected API...'
    },
    servers: [{ url: API_ORIGIN, description: 'API' }],

    // ONE components object only
    components: {
        securitySchemes: {
            cookieAuth: { type: 'apiKey', in: 'cookie', name: 'connect.sid' },
        },

        // reusable responses live here too
        responses: {
            Unauthorized: {
                description: 'Unauthorized',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
            Forbidden: {
                description: 'Forbidden',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
            NotFound: {
                description: 'Not Found',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
            Conflict: {
                description: 'Conflict',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
            BadRequest: {
                description: 'Bad Request',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
        },

        // models (this makes the bottom “Schemas” section show up)
        schemas: {
            ErrorResponse: {
                type: 'object',
                properties: {
                    error: {
                        type: 'object',
                        properties: {
                            code: { type: 'string', example: 'BAD_REQUEST' },
                            message: { type: 'string', example: 'Validation failed' },
                            details: { nullable: true },
                        },
                        required: ['code', 'message'],
                    },
                },
                required: ['error'],
            },

            // align to your DB fields
            User: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: '68d62e16f8780af3242aee7e' },
                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                    firstName: { type: 'string', example: 'Ada' },
                    lastName: { type: 'string', example: 'Lovelace' },
                    avatarUrl: { type: 'string', example: 'https://example.com/a.jpg' },
                    role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
                required: ['email'],
            },

            Category: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '6655b1...' },
                    name: { type: 'string', maxLength: 80, example: 'Cables' },
                    description: { type: 'string', example: 'Network and power cables' },
                    color: { type: 'string', example: '#3366FF' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
                required: ['name'],
            },

            Location: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    name: { type: 'string', example: 'Warehouse A' },
                    code: { type: 'string', example: 'WH-A' },
                    address: { type: 'string', example: '123 Depot Rd' },
                    notes: { type: 'string', example: 'East bay door is jammed' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
                required: ['name', 'code'],
            },

            Item: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    name: { type: 'string', example: 'Cat6 Patch Cable 3ft' },
                    sku: { type: 'string', example: 'CAT6-3FT-BLK' },
                    categoryId: { type: 'string', example: '6655b1...' },
                    locationId: { type: 'string', example: '6655b2...' },
                    qtyOnHand: { type: 'integer', minimum: 0, example: 42 },
                    unit: { type: 'string', example: 'ea' },
                    unitCost: { type: 'number', minimum: 0, example: 2.49 },
                    reorderLevel: { type: 'integer', minimum: 0, example: 10 },
                    status: { type: 'string', enum: ['active', 'archived'], example: 'active' },
                    barcode: { type: 'string', example: '0123456789012' },
                    tags: { type: 'array', items: { type: 'string' }, example: ['ethernet', 'black'] },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
                required: ['name', 'sku', 'categoryId', 'locationId', 'qtyOnHand', 'unit', 'unitCost', 'reorderLevel'],
            },

            Note: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    itemId: { type: 'string' },
                    authorId: { type: 'string' },
                    body: { type: 'string', maxLength: 1000, example: 'Box damaged in transit' },
                    type: { type: 'string', enum: ['general', 'damage', 'audit'], example: 'damage' },
                    pinned: { type: 'boolean', example: false },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
                required: ['itemId', 'authorId', 'body'],
            },

            // request bodies
            CategoryCreate: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Cables' },
                    description: { type: 'string', example: 'Network and power cables' },
                    color: { type: 'string', example: '#3366FF' },
                },
                required: ['name'],
            },
            CategoryUpdate: { allOf: [{ $ref: '#/components/schemas/CategoryCreate' }] },

            LocationCreate: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Warehouse A' },
                    code: { type: 'string', example: 'WH-A' },
                    address: { type: 'string', example: '123 Depot Rd' },
                    notes: { type: 'string', example: 'Near loading dock' },
                },
                required: ['name', 'code'],
            },
            LocationUpdate: { allOf: [{ $ref: '#/components/schemas/LocationCreate' }] },

            ItemCreate: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Cat6 Patch Cable 3ft' },
                    sku: { type: 'string', example: 'CAT6-3FT-BLK' },
                    categoryId: { type: 'string', example: '6655b1...' },
                    locationId: { type: 'string', example: '6655b2...' },
                    qtyOnHand: { type: 'integer', example: 42 },
                    unit: { type: 'string', example: 'ea' },
                    unitCost: { type: 'number', example: 2.49 },
                    reorderLevel: { type: 'integer', example: 10 },
                    status: { type: 'string', enum: ['active', 'archived'], example: 'active' },
                    barcode: { type: 'string', example: '0123456789012' },
                    tags: { type: 'array', items: { type: 'string' }, example: ['ethernet', 'black'] },
                },
                required: ['name', 'sku', 'categoryId', 'locationId', 'qtyOnHand', 'unit', 'unitCost', 'reorderLevel'],
            },
            ItemUpdate: { allOf: [{ $ref: '#/components/schemas/ItemCreate' }] },

            NoteCreate: {
                type: 'object',
                properties: {
                    body: { type: 'string', example: 'Count adjusted after audit' },
                    type: { type: 'string', enum: ['general', 'damage', 'audit'], example: 'audit' },
                    pinned: { type: 'boolean', example: false },
                },
                required: ['body'],
            },
            NoteUpdate: { allOf: [{ $ref: '#/components/schemas/NoteCreate' }] },
        },
    },


    paths: {
        '/health': {
            get: {
                tags: ['Auth'],
                summary: 'Service health',
                responses: { 200: { description: 'OK' } },
            },
        },

        // ---------- AUTH ----------
        '/auth/google': {
            get: {
                tags: ['Auth'],
                summary: 'Start Google OAuth',
                description: 'Redirects to Google. (302)',
                responses: { 302: { description: 'Redirect to Google' } },
            },
        },
        '/auth/google/callback': {
            get: {
                tags: ['Auth'],
                summary: 'OAuth callback',
                description:
                    'Google redirects here. On success, creates/fetches a user, starts a session, and redirects to FRONTEND_ORIGIN (or `/`).',
                responses: { 302: { description: 'Redirect to frontend/root' } },
            },
        },
        '/auth/me': {
            get: {
                tags: ['Auth'],
                summary: 'Current session',
                responses: {
                    200: {
                        description: 'Auth state',
                        content: {
                            'application/json': {
                                examples: {
                                    loggedOut: { value: { authenticated: false, user: null } },
                                    loggedIn: {
                                        value: {
                                            authenticated: true,
                                            user: {
                                                id: '68d62e16f8780af3242aee7e',
                                                email: 'user@example.com',
                                                name: 'User',
                                                avatarUrl: 'https://...',
                                                role: 'user',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/auth/logout': {
            post: {
                tags: ['Auth'],
                summary: 'Logout (destroy session)',
                responses: { 204: { description: 'No Content' } },
            },
        },

        // ---------- CATEGORIES ----------
        '/categories': {
            get: {
                tags: ['Categories'],
                security: [{ cookieAuth: [] }],
                summary: 'List categories',
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Category' } } } } },
                    401: { $ref: '#/components/responses/Unauthorized' },
                },
            },
            post: {
                tags: ['Categories'],
                security: [{ cookieAuth: [] }],
                summary: 'Create category (admin)',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryCreate' } } },
                },
                responses: {
                    201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
                    400: { $ref: '#/components/responses/BadRequest' },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    403: { $ref: '#/components/responses/Forbidden' },
                },
            },
        },
        '/categories/{id}': {
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            get: {
                tags: ['Categories'],
                security: [{ cookieAuth: [] }],
                summary: 'Get category by id',
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    404: { $ref: '#/components/responses/NotFound' },
                },
            },
            put: {
                tags: ['Categories'],
                security: [{ cookieAuth: [] }],
                summary: 'Update category (admin)',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryUpdate' } } } },
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
                    400: { $ref: '#/components/responses/BadRequest' },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    403: { $ref: '#/components/responses/Forbidden' },
                    404: { $ref: '#/components/responses/NotFound' },
                },
            },
            delete: {
                tags: ['Categories'],
                security: [{ cookieAuth: [] }],
                summary: 'Delete category (admin, 409 if items exist)',
                responses: {
                    204: { description: 'No Content' },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    403: { $ref: '#/components/responses/Forbidden' },
                    404: { $ref: '#/components/responses/NotFound' },
                    409: { $ref: '#/components/responses/Conflict' },
                },
            },
        },

        // ---------- LOCATIONS ----------
        '/locations': {
            get: {
                tags: ['Locations'],
                security: [{ cookieAuth: [] }],
                summary: 'List locations',
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Location' } } } } },
                    401: { $ref: '#/components/responses/Unauthorized' },
                },
            },
            post: {
                tags: ['Locations'],
                security: [{ cookieAuth: [] }],
                summary: 'Create location (admin)',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LocationCreate' } } } },
                responses: {
                    201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Location' } } } },
                    400: { $ref: '#/components/responses/BadRequest' },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    403: { $ref: '#/components/responses/Forbidden' },
                },
            },
        },
        '/locations/{id}': {
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            get: {
                tags: ['Locations'],
                security: [{ cookieAuth: [] }],
                summary: 'Get location by id',
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Location' } } } },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    404: { $ref: '#/components/responses/NotFound' },
                },
            },
            put: {
                tags: ['Locations'],
                security: [{ cookieAuth: [] }],
                summary: 'Update location (admin)',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LocationUpdate' } } } },
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Location' } } } },
                    400: { $ref: '#/components/responses/BadRequest' },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    403: { $ref: '#/components/responses/Forbidden' },
                    404: { $ref: '#/components/responses/NotFound' },
                },
            },
            delete: {
                tags: ['Locations'],
                security: [{ cookieAuth: [] }],
                summary: 'Delete location (admin, 409 if items exist)',
                responses: {
                    204: { description: 'No Content' },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    403: { $ref: '#/components/responses/Forbidden' },
                    404: { $ref: '#/components/responses/NotFound' },
                    409: { $ref: '#/components/responses/Conflict' },
                },
            },
        },

        // ---------- ITEMS ---------
        '/items': {
            get: {
                tags: ['Items'],
                security: [{ cookieAuth: [] }],
                summary: 'List items (filters supported)',
                // Params
                parameters: [
                    { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Case-insensitive name match' },
                    { name: 'categoryId', in: 'query', schema: { type: 'string' } },
                    { name: 'locationId', in: 'query', schema: { type: 'string' } },
                    { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'archived'] } },
                    { name: 'lowStock', in: 'query', schema: { type: 'string', enum: ['true', 'false'] }, description: 'Show qtyOnHand <= reorderLevel when true' },
                ],
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Item' } } } } },
                    401: { $ref: '#/components/responses/Unauthorized' },
                },
            },
            post: {
                tags: ['Items'],
                security: [{ cookieAuth: [] }],
                summary: 'Create item',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ItemCreate' } } } },
                responses: {
                    201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Item' } } } },
                    400: { $ref: '#/components/responses/BadRequest' },
                    401: { $ref: '#/components/responses/Unauthorized' },
                },
            },
        },
        '/items/{id}': {
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            get: {
                tags: ['Items'],
                security: [{ cookieAuth: [] }],
                summary: 'Get item by id',
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Item' } } } },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    404: { $ref: '#/components/responses/NotFound' },
                },
            },
            put: {
                tags: ['Items'],
                security: [{ cookieAuth: [] }],
                summary: 'Update item',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ItemUpdate' } } } },
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Item' } } } },
                    400: { $ref: '#/components/responses/BadRequest' },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    404: { $ref: '#/components/responses/NotFound' },
                },
            },
            // Delete route
            delete: {
                tags: ['Items'],
                security: [{ cookieAuth: [] }],
                summary: 'Delete item (also deletes its notes)',
                responses: {
                    204: { description: 'No Content' },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    404: { $ref: '#/components/responses/NotFound' },
                },
            },
        },

        // ---------- NOTES ---------
        '/notes/{itemId}': {
            parameters: [{ name: 'itemId', in: 'path', required: true, schema: { type: 'string' } }],
            get: {
                tags: ['Notes'],
                security: [{ cookieAuth: [] }],
                summary: 'List notes for an item',
                parameters: [
                    { name: 'type', in: 'query', schema: { type: 'string', enum: ['general', 'damage', 'audit'] } },
                    { name: 'pinned', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } },
                ],
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Note' } } } } },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    404: { $ref: '#/components/responses/NotFound' },
                },
            },
            post: {
                tags: ['Notes'],
                security: [{ cookieAuth: [] }],
                summary: 'Create note for an item',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/NoteCreate' } } } },
                responses: {
                    201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } } },
                    400: { $ref: '#/components/responses/BadRequest' },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    404: { $ref: '#/components/responses/NotFound' },
                },
            },
        },
        '/notes/{id}': {
            //Params
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            put: {
                tags: ['Notes'],
                security: [{ cookieAuth: [] }],
                summary: 'Update note (author or admin)',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/NoteUpdate' } } } },
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } } },
                    400: { $ref: '#/components/responses/BadRequest' },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    403: { $ref: '#/components/responses/Forbidden' },
                    404: { $ref: '#/components/responses/NotFound' },
                },
            }, //Delete 
            delete: {
                tags: ['Notes'],
                security: [{ cookieAuth: [] }],
                summary: 'Delete note (author or admin)',
                responses: {
                    204: { description: 'No Content' },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    403: { $ref: '#/components/responses/Forbidden' },
                    404: { $ref: '#/components/responses/NotFound' },
                },
            },
        },
    },
};

export default swaggerSpec;
