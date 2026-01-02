# Claude Guidelines for MCP Tool Development

## Overview

This document provides specific guidelines for Claude (or any AI assistant) when asked to add new MCP tools based on API endpoints. Follow these guidelines to ensure consistent, high-quality tool implementation.

## Pre-Development Analysis

### 1. Framework Detection
First, identify the backend framework being used:
- **Laravel/PHP**: Look for `routes/api*.php`, `app/Http/Controllers/`
- **FastAPI/Python**: Look for `main.py`, `routers/`, `@app.route` decorators
- **Express/Node.js**: Look for `routes/`, `app.get/post/put/delete`
- **Spring Boot/Java**: Look for `@RestController`, `@RequestMapping`
- **ASP.NET Core**: Look for `Controllers/`, `[HttpGet]`, `[HttpPost]`

### 2. Documentation Discovery
Search for API documentation in this order:
1. **OpenAPI/Swagger**: `docs/openapi/*.yaml`, `swagger.json`, `/docs`, `/swagger`
2. **Postman Collections**: `*.postman_collection.json`
3. **API Documentation**: `docs/api/`, `README.md`, `API.md`
4. **Route Files**: Directly examine route definitions
5. **Controller Files**: Analyze controller methods and parameters

### 3. Scope Confirmation
When a user asks to "add tools for the API" without specifics:
**ALWAYS ASK FOR CLARIFICATION:**

```
I found [X] API endpoints in the [framework] application:
- GET /api/episodes (list episodes)
- POST /api/episodes (create episode)  
- GET /api/episodes/{id} (get episode)
- PUT /api/episodes/{id} (update episode)
- DELETE /api/episodes/{id} (delete episode)
- [... additional endpoints]

Should I create MCP tools for:
1. All endpoints? 
2. Only specific endpoints (please specify which ones)?
3. Only CRUD operations for specific resources?
```

## Input Schema Analysis

### 1. Schema Import Strategy (TypeScript/FastAPI Priority)
**For TypeScript/FastAPI backends:**
Try to import schemas directly when possible:

```typescript
// Try to import from backend types
import type { CreateEpisodeRequest } from '../../../app/Http/Requests/CreateEpisodeRequest';
import type { EpisodeResponse } from '../../../app/Http/Resources/EpisodeResource';
```

**If direct import not possible:**
Carefully analyze the backend code structure.

### 2. Schema Analysis Requirements
The input contract MUST be strictly reflected. Analyze these sources in order:

1. **Request/Form classes** (Laravel: `app/Http/Requests/`, FastAPI: Pydantic models)
2. **Validation rules** (Look for validation decorators, rules, schemas)
3. **Controller method signatures** 
4. **Database migrations** (for field types and constraints)
5. **Model definitions** (for relationships and required fields)

### 3. Critical Schema Elements
Ensure you capture:
- **Required vs Optional fields**
- **Field types** (string, number, boolean, array, object)
- **Validation constraints** (min/max length, patterns, enums)
- **Nested objects and arrays**
- **Field descriptions** (from comments or documentation)

## Tool Implementation Pattern

### 1. HTTP Tools (Default Choice - 90% of cases)
Use the `createHttpTool` factory for standard API operations:

```typescript
// src/tools/[resource]/[action].ts
import { createHttpTool } from '../factory.js';

export interface [Action][Resource]Input {
  // Exact match to API contract
}

export interface [Action][Resource]Output {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

const spec = {
  name: '[action]_[resource]',
  description: '[Clear description of what this tool does]',
  inputSchema: {
    // JSON Schema that exactly matches API requirements
  },
  method: '[GET|POST|PUT|DELETE|PATCH]' as const,
  path: '[API endpoint path]',
  mapResponse: (data: any): [Action][Resource]Output => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),
  mapError: (err: unknown): [Action][Resource]Output => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),
  isError: (output) => !output.ok,
  successText: '[Action] [resource] successfully',
  errorText: 'Failed to [action] [resource]',
};

export default createHttpTool<[Action][Resource]Input, [Action][Resource]Output>(spec);
```

### 2. File Structure Requirements
Organize tools by resource/feature:

```
src/tools/
├── episodes/
│   ├── create.ts
│   ├── list.ts
│   ├── get.ts
│   ├── update.ts
│   └── delete.ts
├── tracks/
│   ├── create.ts
│   ├── list.ts
│   └── update.ts
└── assets/
    ├── create.ts
    ├── list.ts
    └── approve.ts
```

### 3. Naming Conventions
- **Files**: `[action].ts` (create.ts, list.ts, update.ts)
- **Tool names**: `[action]_[resource]` (create_episode, list_tracks)
- **Interfaces**: `[Action][Resource]Input/Output` (CreateEpisodeInput)

## Testing Requirements

### 1. Test File Strategy
- **Light API methods**: Add to existing `test-http.ts`
- **Heavy operations**: Create separate test files in `test/` folder

### 2. Test Implementation
For each tool, include tests for:
- **Valid input** (happy path)
- **Invalid input** (validation errors) 
- **API errors** (network issues, server errors)
- **Edge cases** (empty responses, large datasets)

```typescript
// test-http.ts or test/[resource]-test.ts
describe('[Action] [Resource]', () => {
  it('should create [resource] successfully', async () => {
    // Test implementation
  });
  
  it('should handle validation errors', async () => {
    // Test validation
  });
  
  it('should handle API errors', async () => {
    // Test error handling
  });
});
```

## Quality Checklist

Before submitting tool implementation:

### ✅ Schema Accuracy
- [ ] Input schema exactly matches API documentation/code
- [ ] All required fields are marked as required
- [ ] All optional fields are marked as optional
- [ ] Field types are correct (string, number, boolean, etc.)
- [ ] Validation constraints are properly set

### ✅ Tool Structure
- [ ] Uses HTTP factory for standard API operations
- [ ] File organized in appropriate feature folder
- [ ] Follows naming conventions
- [ ] Includes proper TypeScript interfaces
- [ ] Has clear descriptions

### ✅ Error Handling
- [ ] Implements proper error mapping
- [ ] Provides meaningful error messages
- [ ] Handles both API and network errors

### ✅ Testing
- [ ] Tests cover happy path
- [ ] Tests cover validation errors
- [ ] Tests cover API error scenarios

### ✅ Integration
- [ ] Tool is exported from `src/tools/index.ts`
- [ ] Tool builds without TypeScript errors
- [ ] Tool is accessible via MCP server

## Common Pitfalls to Avoid

1. **Schema Mismatches**: Not reflecting exact API contract
2. **Missing Required Fields**: Not marking required fields properly
3. **Incorrect Types**: Using wrong field types (string vs number)
4. **Poor Organization**: Not grouping tools by resource
5. **Missing Error Handling**: Not implementing proper error responses
6. **No Testing**: Not writing tests for the tools
7. **Inconsistent Naming**: Not following naming conventions

## Emergency Override

If you encounter complex scenarios that don't fit these guidelines:
1. **Document the exception** in comments
2. **Explain why** the standard pattern doesn't apply
3. **Ensure it's actually necessary** (95% of cases should use HTTP factory)
4. **Get approval** before implementing custom solutions

Remember: Consistency is key. Follow these patterns to ensure all MCP tools work seamlessly together.