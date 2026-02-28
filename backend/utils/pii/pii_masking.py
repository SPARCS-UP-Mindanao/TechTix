import re

def mask_email(email: str) -> str:
    """Masks an email address for safe logging."""
    if not email or '@' not in email:
        return '***'
    local, domain = email.split('@', 1)
    return f'{local[0]}***@{domain}'

def mask_sensitive_data(message: str) -> str:
    """Scans a log message and masks any detected sensitive data."""
    # Mask emails
    message = re.sub(
        r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
        lambda m: mask_email(m.group()), message
    )
    # Mask passwords
    message = re.sub(
        r'(password|TEMPORARY_PASSWORD|temp_password)[^\s]*',
        '***', message, flags=re.IGNORECASE
    )
    return message