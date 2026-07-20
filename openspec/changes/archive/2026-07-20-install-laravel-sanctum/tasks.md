## 1. Installation

- [x] 1.1 Install laravel/sanctum via Composer
- [x] 1.2 Publish Sanctum configuration file
- [x] 1.3 Publish Sanctum migration file

## 2. Database Setup

- [ ] 2.1 Run Sanctum migration to create personal_access_tokens table

## 3. Configuration

- [x] 3.1 Configure stateful domains in config/sanctum.php
- [x] 3.2 Configure middleware in bootstrap/app.php

## 4. Model Integration

- [x] 4.1 Add HasApiTokens trait to User model

## 5. Token Management

- [x] 5.1 Create API endpoint for issuing tokens
- [x] 5.2 Create API endpoint for revoking tokens
- [x] 5.3 Create API endpoint for listing user tokens

## 6. Role-Based Access

- [x] 6.1 Define token ability constants for each role (Tourist, Driver, Hotel Manager, Administrator)
- [x] 6.2 Implement token ability validation helper
