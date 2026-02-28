from backend.utils.pii.pii_masking import mask_email, mask_sensitive_data

def test_mask_email():
    # Normal email
    assert mask_email("participant@example.com") == "p***@example.com"

    # Short local part
    assert mask_email("a@example.com") == "a***@example.com"

    # Invalid email
    assert mask_email("notanemail") == "***"

    # Empty string
    assert mask_email("") == "***"

    print("✅ mask_email tests passed")

def test_mask_sensitive_data():
    # Email in a log message
    result = mask_sensitive_data("Sending email to participant@example.com for event")
    assert "participant@example.com" not in result
    assert "p***@example.com" in result

    # Password in a log message
    result = mask_sensitive_data("TEMPORARY_PASSWORD=mysecretpassword123")
    assert "mysecretpassword123" not in result

    print("✅ mask_sensitive_data tests passed")

if __name__ == "__main__":
    test_mask_email()
    test_mask_sensitive_data()
    print("✅ All tests passed!")