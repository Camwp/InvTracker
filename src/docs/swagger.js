// src/docs/swagger.js
const swaggerSpec = {
    openapi: '3.0.3',
    info: {
        title: 'Inventory Lite API',
        version: '1.0.0',
        description:
            'OAuth (Google) + session cookie protected API for managing categories, locations, items, and item notes.',
    },
    servers: [
        { url: process.env.FRONTEND_ORIGIN || 'http://localhost:3000', description: 'Local' },
    ],
    tags: [
        { name: 'Auth', description: 'Login with Google & session status' },
        { name: 'Categories' },
        { name: 'Locations' },
        { name: 'Items' },
        { name: 'Notes' },
    ],
    components: {
        securitySchemes: {
            // Express-session default cookie name is `connect.sid`
            cookieAuth: { type: 'apiKey', in: 'cookie', name: 'connect.sid' },
        },
        schemas: {
            ErrorResponse: {
                type: 'object',
                properties: {
                    error: {
                        type: 'object',
                        properties: {
                            code: { type: 'string' },
                            message: { type: 'string' },
                            details: { nullable: true },
                        },
                        required: ['code', 'message'],
                    },
                },
                required: ['error'],
            },
            User: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: '68d62e16f8780af3242aee7e' },
                    email: { type: 'string', format: 'email' },
                    name: { type: 'string' },
                    avatarUrl: { type: 'string' },
                    role: { type: 'string', enum: ['user', 'admin'] },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
            Category: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    name: { type: 'string', maxLength: 60 },
                    description: { type: 'string' },
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
                    name: { type: 'string', maxLength: 60 },
                    code: { type: 'string', maxLength: 20 },
                    address: { type: 'string' },
                    notes: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
                required: ['name', 'code'],
            },
            Item: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    name: { type: 'string', maxLength: 120 },
                    sku: { type: 'string', maxLength: 60 },
                    categoryId: { type: 'string' },
                    locationId: { type: 'string' },
                    qtyOnHand: { type: 'integer', minimum: 0 },
                    unit: { type: 'string', example: 'ea' },
                    unitCost: { type: 'number', minimum: 0 },
                    reorderLevel: { type: 'integer', minimum: 0 },
                    status: { type: 'string', enum: ['active', 'archived'] },
                    barcode: { type: 'string' },
                    tags: { type: 'array', items: { type: 'string' } },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
                required: [
                    'name',
                    'sku',
                    'categoryId',
                    'locationId',
                    'qtyOnHand',
                    'unit',
                    'unitCost',
                    'reorderLevel',
                ],
            },
            Note: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    itemId: { type: 'string' },
                    authorId: { type: 'string' },
                    body: { type: 'string', maxLength: 1000 },
                    type: { type: 'string', enum: ['general', 'damage', 'audit'] },
                    pinned: { type: 'boolean' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
                required: ['itemId', 'authorId', 'body'],
            },
            // Request bodies
            CategoryCreate: {
                type: 'object',
                properties: {
                    name: { type: 'string', maxLength: 60 },
                    description: { type: 'string' },
                    color: { type: 'string' },
                },
                required: ['name'],
            },
            CategoryUpdate: { allOf: [{ $ref: '#/components/schemas/CategoryCreate' }] },
            LocationCreate: {
                type: 'object',
                properties: {
                    name: { type: 'string', maxLength: 60 },
                    code: { type: 'string', maxLength: 20 },
                    address: { type: 'string' },
                    notes: { type: 'string' },
                },
                required: ['name', 'code'],
            },
            LocationUpdate: { allOf: [{ $ref: '#/components/schemas/LocationCreate' }] },
            ItemCreate: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    sku: { type: 'string' },
                    categoryId: { type: 'string' },
                    locationId: { type: 'string' },
                    qtyOnHand: { type: 'integer' },
                    unit: { type: 'string' },
                    unitCost: { type: 'number' },
                    reorderLevel: { type: 'integer' },
                    status: { type: 'string', enum: ['active', 'archived'] },
                    barcode: { type: 'string' },
                    tags: { type: 'array', items: { type: 'string' } },
                },
                required: [
                    'name', 'sku', 'categoryId', 'locationId',
                    'qtyOnHand', 'unit', 'unitCost', 'reorderLevel'
                ],
            },
            ItemUpdate: { allOf: [{ $ref: '#/components/schemas/ItemCreate' }] },
            NoteCreate: {
                type: 'object',
                properties: {
                    body: { type: 'string', maxLength: 1000 },
                    type: { type: 'string', enum: ['general', 'damage', 'audit'] },
                    pinned: { type: 'boolean' },
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

        // ---------- ITEMS ----------
        '/items': {
            get: {
                tags: ['Items'],
                security: [{ cookieAuth: [] }],
                summary: 'List items (filters supported)',
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

        // ---------- NOTES ----------
        '/items/{itemId}/notes': {
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
            },
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
    components: {
        ...(typeof window === 'undefined' ? {} : undefined), // keep node happy
        responses: {
            Unauthorized: {
                description: 'Unauthorized',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
            Forbidden: {
                description: 'Forbidden',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
            NotFound: {
                description: 'Not Found',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
            Conflict: {
                description: 'Conflict',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
            BadRequest: {
                description: 'Bad Request',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
        },
    },
};

export default swaggerSpec;
