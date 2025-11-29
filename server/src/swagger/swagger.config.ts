import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ad Campaign Management API',
      version: '1.0.0',
      description: 'RESTful API for managing ad campaigns with analytics, budgets, and media',
      contact: {
        name: 'API Support',
        email: 'support@adcampaign.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server'
      },
      {
        url: 'https://api.adcampaign.com/api/v1',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: {
              type: 'string',
              enum: ['admin', 'campaign_manager', 'client', 'viewer']
            },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Campaign: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            type: { type: 'string', enum: ['banner', 'video', 'social'] },
            status: {
              type: 'string',
              enum: ['draft', 'active', 'paused', 'completed']
            },
            budget: { type: 'number' },
            spent: { type: 'number' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            targetAudience: { type: 'string' },
            createdBy: { type: 'string' },
            assignedClients: { type: 'array', items: { type: 'string' } },
            metrics: {
              type: 'object',
              properties: {
                impressions: { type: 'number' },
                clicks: { type: 'number' },
                conversions: { type: 'number' },
                ctr: { type: 'number' }
              }
            },
            mediaUrls: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Analytics: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            campaign: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            impressions: { type: 'number' },
            clicks: { type: 'number' },
            conversions: { type: 'number' },
            spend: { type: 'number' },
            deviceBreakdown: {
              type: 'object',
              properties: {
                desktop: { type: 'number' },
                mobile: { type: 'number' },
                tablet: { type: 'number' }
              }
            },
            platformBreakdown: {
              type: 'object',
              properties: {
                facebook: { type: 'number' },
                google: { type: 'number' },
                instagram: { type: 'number' },
                other: { type: 'number' }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Budget: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            campaign: { type: 'string' },
            totalBudget: { type: 'number' },
            dailyBudget: { type: 'number' },
            spent: { type: 'number' },
            remaining: { type: 'number' },
            transactions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  amount: { type: 'number' },
                  date: { type: 'string', format: 'date-time' },
                  description: { type: 'string' }
                }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Media: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            filename: { type: 'string' },
            originalName: { type: 'string' },
            mimeType: { type: 'string' },
            size: { type: 'number' },
            url: { type: 'string' },
            uploadedBy: { type: 'string' },
            campaign: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            error: { type: 'string' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Ad Campaign API Docs'
  }));
};

export default swaggerSpec;

