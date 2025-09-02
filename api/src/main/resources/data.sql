INSERT INTO variables (id, key, value)
VALUES
  (1, 'LINK', 'http://localhost:8080'),
  (2, 'SENDGRID_API_KEY', 'SG.test_key.test_value'),
  (3, 'SKIP_EMAIL_SERVICE', 'false')
ON CONFLICT (id) DO UPDATE SET key = EXCLUDED.key, value = EXCLUDED.value;
