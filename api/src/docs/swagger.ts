import swaggerJsdoc from 'swagger-jsdoc';

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'VocApp API',
      version: '2.1.0',
      description: 'REST API documentation for VocApp',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Local development - v1',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            firstName: {
              type: 'string',
              example: 'John',
            },
            lastName: {
              type: 'string',
              example: 'Doe',
            },
            username: {
              type: 'string',
              example: 'johndoe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            role: {
              type: 'string',
              example: 'USER',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        VocabularyList: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            sourceLanguageCode: { type: 'string', example: 'en' },
            targetLanguageCode: { type: 'string', example: 'fr' },
            name: { type: 'string', example: 'French Vocabulary Notes' },
            lastPracticed: { type: 'string', format: 'date-time', nullable: true },
            deletedAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        VocabularyListWithStats: {
          allOf: [
            { $ref: '#/components/schemas/VocabularyList' },
            {
              type: 'object',
              properties: {
                total: { type: 'integer', example: 12 },
                mastered: { type: 'integer', example: 5 },
                progress: { type: 'number', example: 42, description: 'Percentage (0-100) of items mastered' },
              },
            },
          ],
        },
        Translation: {
          type: 'object',
          properties: {
            translatedText: { type: 'string', example: 'Elle a une voiture' },
            detectedLanguageCode: { type: 'string', example: 'en', nullable: true },
            model: { type: 'string', nullable: true },
          },
        },
        VocabularyListItem: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            listId: { type: 'string', format: 'uuid' },
            position: { type: 'integer', example: 1 },
            sourceText: { type: 'string', example: 'apple' },
            targetText: { type: 'string', example: 'la pomme' },
            status: {
              type: 'string',
              enum: ['LEARNING', 'MASTERED'],
              example: 'LEARNING',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AudioClip: {
          type: 'object',
          properties: {
            audioKey: {
              type: 'string',
              example: 'audio/en/1f3d9c1b2a7e4f5a6b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a.mp3',
              description: 'S3 object key, derived from a hash of the text and language code',
            },
            audioUrl: {
              type: 'string',
              format: 'uri',
              description: 'Presigned, time-limited URL for downloading the audio clip',
            },
          },
        },
        PracticeSession: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            listId: { type: 'string', format: 'uuid' },
            startedAt: { type: 'string', format: 'date-time' },
            completedAt: { type: 'string', format: 'date-time', nullable: true },
            idempotencyKey: { type: 'string', format: 'uuid' },
            totalHints: { type: 'integer', example: 2 },
            totalErrors: { type: 'integer', example: 1 },
            totalSkipped: { type: 'integer', example: 0 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        PracticeResult: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            sessionId: { type: 'string', format: 'uuid' },
            itemId: { type: 'string', format: 'uuid', nullable: true },
            sourceText: { type: 'string', example: 'apple' },
            targetText: { type: 'string', example: 'la pomme' },
            startedAt: { type: 'string', format: 'date-time' },
            completedAt: { type: 'string', format: 'date-time', nullable: true },
            hints: { type: 'integer', example: 0 },
            errors: { type: 'integer', example: 1 },
            skipped: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['src/features/**/*.routes.ts'],
});

export default swaggerSpec;
