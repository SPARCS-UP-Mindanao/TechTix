# Contributing to SPARCS TECHTIX API

Thank you for your interest in contributing to the SPARCS Events API! This document provides guidelines and best practices for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Coding Conventions](#coding-conventions)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Review](#code-review)

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to maintain a welcoming and inclusive environment for all contributors.

## Getting Started

1. Follow the setup instructions in the [README.md](README.md)
2. Create a new branch for your feature or bugfix:
   ```shell
   git checkout -b feature/your-feature-name
   ```
3. Make your changes following the conventions below
4. Test your changes thoroughly
5. Submit a pull request

## Coding Conventions

### Python Style Guide

We follow PEP 8 with some project-specific conventions:

#### Naming Conventions

- **snake_case** for variables, functions, methods, and module names:
  ```python
  def calculate_total_price(item_count, unit_price):
      total_price = item_count * unit_price
      return total_price
  ```

- **PascalCase** for class names:
  ```python
  class UserRepository:
      pass
  
  class EventRegistration:
      pass
  ```

- **UPPER_SNAKE_CASE** for constants:
  ```python
  MAX_RETRY_ATTEMPTS = 3
  DEFAULT_TIMEOUT_SECONDS = 30
  API_BASE_URL = "https://api.example.com"
  ```

#### Tuple Deconstruction on Returns

When returning multiple values, use tuple deconstruction for clarity:

**✅ Good:**
```python
def get_user_info(user_id: str) -> tuple[str, str, int]:
    """
    Retrieves user information.
    
    :param user_id: The unique identifier for the user
    :type user_id: str
    
    :return: A tuple containing (username, email, age)
    :rtype: tuple[str, str, int]
    """
    # ... implementation
    return username, email, age

# Usage with tuple deconstruction
username, email, age = get_user_info("123")
```

**❌ Bad:**
```python
def get_user_info(user_id: str) -> dict:
    # ... implementation
    return {"username": username, "email": email, "age": age}

# Less clear usage
user_info = get_user_info("123")
username = user_info["username"]
```

For complex returns with many values, prefer using dataclasses or Pydantic models:

```python
from dataclasses import dataclass

@dataclass
class UserInfo:
    username: str
    email: str
    age: int
    created_at: datetime
    is_active: bool

def get_user_info(user_id: str) -> UserInfo:
    """
    Retrieves detailed user information.
    
    :param user_id: The unique identifier for the user
    :type user_id: str
    
    :return: User information object
    :rtype: UserInfo
    """
    # ... implementation
    return UserInfo(
        username=username,
        email=email,
        age=age,
        created_at=created_at,
        is_active=is_active
    )
```

#### Docstrings

Use reStructuredText (reST) format as specified in PEP 287:

```python
def process_payment(amount: float, currency: str, payment_method: str) -> tuple[bool, str]:
    """
    Processes a payment transaction.
    
    :param amount: The payment amount
    :type amount: float
    
    :param currency: The currency code (e.g., 'USD', 'EUR')
    :type currency: str
    
    :param payment_method: The payment method identifier
    :type payment_method: str
    
    :return: A tuple containing (success_status, transaction_id)
    :rtype: tuple[bool, str]
    
    :raises ValueError: If amount is negative or currency is invalid
    :raises PaymentProcessingError: If payment processing fails
    """
    # ... implementation
    return success, transaction_id
```

#### Type Hints

Always use type hints for function parameters and return values:

```python
from typing import Optional, List, Dict

def find_events(
    category: str,
    start_date: Optional[datetime] = None,
    limit: int = 10
) -> List[Dict[str, any]]:
    """Find events matching the criteria."""
    # ... implementation
    return events
```

#### Clean Architecture Principles

Follow the dependency rule: **dependencies point inward**

```python
# ❌ Bad: Domain layer depending on infrastructure
# model/event.py
from repository.event_repository import EventRepository  # Wrong!

class Event:
    def save(self):
        repo = EventRepository()
        repo.save(self)

# ✅ Good: Infrastructure depends on domain
# repository/event_repository.py
from model.event import Event  # Correct!

class EventRepository:
    def save(self, event: Event) -> bool:
        # ... implementation
        return success
```

Layer structure:
1. **Domain (`model/`)** - No dependencies on other layers
2. **Application (`usecase/`)** - Depends on domain only
3. **Infrastructure (`repository/`, `aws/`)** - Depends on domain and application
4. **Presentation (`controller/`)** - Depends on application and domain
5. **External (`external_gateway/`, `functions/`)** - Outermost layer

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, white-space, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to build process or auxiliary tools
- **ci**: Changes to CI configuration files and scripts
- **build**: Changes that affect the build system or external dependencies

### Scope Examples

Use the layer or module affected:
- `model` - Domain models
- `usecase` - Use case implementations
- `repository` - Data access layer
- `controller` - API controllers
- `gateway` - External gateway integrations
- `auth` - Authentication/authorization
- `config` - Configuration changes

### Commit Examples

```
feat(model): add Event domain model with validation

Implements the Event entity with business rules validation:
- Event name must be between 3-100 characters
- Start date must be before end date
- Capacity must be positive

Refs: #123
```

```
fix(repository): resolve transaction rollback issue

Fixed race condition in event registration that caused
inconsistent state when concurrent registrations exceeded capacity.

- Added proper transaction isolation
- Implemented optimistic locking
- Added retry logic for deadlock scenarios

Fixes: #456
```

```
refactor(usecase): extract common validation logic

Extracted duplicate validation code into shared validator classes
to improve maintainability and reduce code duplication.

Breaking Change: ValidationError now requires error_code parameter
```

```
docs(readme): update deployment instructions

Added troubleshooting section for common deployment issues
```

### Using Commitizen

We recommend using [Commitizen](https://commitizen-tools.github.io/commitizen/) to help craft proper commit messages:

#### Installation

```shell
# Using pip
pip install commitizen

# Using uv
uv pip install commitizen
```

#### Usage

Instead of `git commit`, use:

```shell
cz commit
```

Or the shorthand:

```shell
cz c
```

This will prompt you through the commit message creation process.

#### Pre-commit Hook (Optional)

To enforce commit message format, add to [.pre-commit-config.yaml](.pre-commit-config.yaml):

```yaml
  - repo: https://github.com/commitizen-tools/commitizen
    rev: v3.13.0
    hooks:
      - id: commitizen
        stages: [commit-msg]
```

## Pull Request Process

1. **Update Documentation**: Ensure any new functionality is documented
   
2. **Add Tests**: Include unit tests for new features or bug fixes
   
3. **Run Pre-commit Checks**: 
   ```shell
   pre-commit run --all-files
   ```

4. **Update CHANGELOG** (if applicable): Add entry for significant changes

5. **PR Title**: Follow conventional commit format:
   ```
   feat(controller): add certificate generation endpoint
   ```

6. **PR Description Template**:
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   Describe testing performed
   
   ## Checklist
   - [ ] Code follows project conventions
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] Tests added/updated
   - [ ] Pre-commit checks pass
   
   ## Related Issues
   Closes #123
   ```

## Code Review

### Review Checklist

Reviewers should verify:

- [ ] Code follows Clean Architecture principles
- [ ] Naming conventions are consistent
- [ ] Type hints are present and accurate
- [ ] Docstrings follow reST format
- [ ] No dependencies flow outward (layer violations)
- [ ] Tests cover new functionality
- [ ] Error handling is appropriate
- [ ] Security considerations addressed
- [ ] Performance implications considered

### Review Guidelines

- Be constructive and respectful
- Explain the "why" behind suggestions
- Approve when minor changes are needed but don't block merge
- Request changes when significant issues exist

## Questions?

If you have questions about contributing, please:
- Check the [README.md](README.md) for setup and architecture info
- Review existing code for examples
- Ask in pull request comments
- Contact the maintainers

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to SPARCS Techtix API! 🎉