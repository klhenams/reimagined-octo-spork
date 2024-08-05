# Management Service Route Documentation

## Tenants

### GET /tenants/
- Description: Get list of tenants
- Security: Super Admins
- Response: Array of Tenant objects

### POST /tenants/
- Description: Create a new tenant
- Security: Super Admins
- Request Body: TenantCreate
  ```json
  {
    "host_name": "string",
    "name": "string",
    "schema": "string"
  }
  ```
- Response: Tenant object

### POST /tenants/create-all
- Description: Create tenants with data
- Security: Super Admins
- Response: Empty object

### PATCH /tenants/{tenant_id}
- Description: Update tenant
- Security: Super Admins
- Path Parameters:
  - tenant_id: UUID
- Request Body: TenantUpdate
  ```json
  {
    "name": "string",
    "host_name": "string"
  }
  ```
- Response: Tenant object

### DELETE /tenants/{tenant_id}
- Description: Delete tenant
- Security: Super Admins
- Path Parameters:
  - tenant_id: UUID
- Response: Empty object

## MMDA

### GET /mmdas/{tenant_name}
- Description: Get MMDA boundary
- Path Parameters:
  - tenant_name: string
- Response: MMDAGeom object

### POST /mmdas/
- Description: Add MMDA
- Query Parameters:
  - name (required): string
- Response: Empty object

## Geometry

### GET /geometry/business/{tenant_name}
- Description: Get businesses geometry
- Path Parameters:
  - tenant_name: string
- Response: Array of BusinessGeom objects

### GET /geometry/buildings/{tenant_name}
- Description: Get buildings geometry
- Path Parameters:
  - tenant_name: string
- Response: Array of BuildingGeom objects

### GET /geometry/mmda/{tenant_name}
- Description: Get MMDA boundary
- Path Parameters:
  - tenant_name: string
- Response: MMDAGeom object

## Super Admins

### GET /super-admins/
- Description: Get list of super admins
- Security: Super Admins
- Response: Array of SuperAdmin objects

### POST /super-admins/
- Description: Create super admin
- Request Body: SuperAdminCreate
  ```json
  {
    "name": "string",
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- Response: SuperAdmin object

### POST /super-admins/authenticate
- Description: Log in for access token
- Request Body: Form data
  - username: string
  - password: string
- Response: Token object

### GET /super-admins/current
- Description: Get currently authenticated super admin details
- Security: Super Admins
- Response: SuperAdmin object

### PATCH /super-admins/current
- Description: Update current super admin
- Security: Super Admins
- Request Body: SuperAdminUpdate
  ```json
  {
    "name": "string",
    "email": "string",
    "username": "string",
    "password": "string"
  }
  ```
- Response: SuperAdmin object

### GET /super-admins/{super_admin_id}
- Description: Get super admin
- Security: Super Admins
- Path Parameters:
  - super_admin_id: UUID
- Response: SuperAdmin object

## Users

### GET /users/
- Description: Get users
- Query Parameters:
  - tenant_name (required): string
  - dependencies: any
- Response: Array of User objects

### POST /users/
- Description: Create user
- Query Parameters:
  - tenant_name (required): string
  - dependencies: any
- Request Body: UserCreate
  ```json
  {
    "surname": "string",
    "other_names": "string",
    "tax_identification_number": "integer",
    "title": "Mr. | Mrs. | Miss",
    "address": "string",
    "digital_address": "string",
    "phone_number": "string",
    "email": "string",
    "national_id": "string"
  }
  ```
- Response: User object

### GET /users/{user_id}
- Description: Get user assets
- Path Parameters:
  - user_id: UUID
- Query Parameters:
  - tenant_name (required): string
  - dependencies: any
- Response: User object

## Buildings

### GET /buildings/
- Description: Get buildings
- Query Parameters:
  - tenant_name (required): string
  - limit (optional): integer, default: 10, max: 100
- Response: Array of Property objects

### POST /buildings/
- Description: Create building
- Query Parameters:
  - tenant_name (required): string
  - spatial_building_id (required): integer or null
  - dependencies: any
- Request Body: PropertyCreate
- Response: Empty object

### GET /buildings/{building_id}
- Description: Get building details
- Path Parameters:
  - building_id: UUID
- Query Parameters:
  - tenant_name (required): string
- Response: Property object

### PATCH /buildings/{building_id}
- Description: Update building details
- Security: Super Admins
- Path Parameters:
  - building_id: UUID
- Query Parameters:
  - tenant_name (required): string
- Request Body: PropertyUpdate
- Response: Property object

### GET /buildings/{building_id}/businesses
- Description: Get businesses in building
- Path Parameters:
  - building_id: UUID
- Query Parameters:
  - tenant_name (required): string
- Response: Array of Business objects

## Businesses

### GET /businesses/
- Description: Get businesses
- Query Parameters:
  - tenant_name (required): string
  - limit (optional): integer, default: 10, max: 100
- Response: Array of Business objects

### POST /businesses/
- Description: Create business
- Query Parameters:
  - tenant_name (required): string
  - spatial_building_id (required): integer or null
- Request Body: BusinessCreate
- Response: Empty object

### GET /businesses/{business_id}
- Description: Get business details
- Path Parameters:
  - business_id: UUID
- Query Parameters:
  - tenant_name (required): string
- Response: Business object

### PATCH /businesses/{business_id}
- Description: Update business details
- Path Parameters:
  - business_id: UUID
- Query Parameters:
  - tenant_name (required): string
- Request Body: BusinessUpdate
- Response: Business object

### GET /businesses/{tenant_name}
- Description: Get businesses geometry
- Path Parameters:
  - tenant_name: string
- Response: Array of BusinessGeom objects

## Root

### GET /
- Description: Ping (health check)
- Response: Empty object