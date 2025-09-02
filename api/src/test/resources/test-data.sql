-- Test environment variables  
INSERT INTO variables (id, key, value) VALUES 
(1, 'LINK', 'http://localhost:8080'),
(2, 'SENDGRID_API_KEY', 'SG.test_key.test_value'),
(3, 'SKIP_EMAIL_SERVICE', 'true')
ON CONFLICT (id) DO UPDATE SET 
key = EXCLUDED.key,
value = EXCLUDED.value;

-- Test users for various scenarios
INSERT INTO users (id, email, website, password, enabled, role, is_admin, referral, walkthrough) VALUES 
(1, 'test@example.com', 'test.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM0sYiWkMKlU6w2SRu4G', true, 'USER', false, '', '[{"page": "NEWSLETTERS_LIST","shouldShow": "true"},{"page": "COLLECTORS_LIST","shouldShow": "true"}]'),
(2, 'admin@example.com', 'admin.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM0sYiWkMKlU6w2SRu4G', true, 'ADMIN', true, '', '[{"page": "NEWSLETTERS_LIST","shouldShow": "true"},{"page": "COLLECTORS_LIST","shouldShow": "true"}]'),
(3, 'pending@example.com', 'pending.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM0sYiWkMKlU6w2SRu4G', false, 'USER', false, '', '[{"page": "NEWSLETTERS_LIST","shouldShow": "true"},{"page": "COLLECTORS_LIST","shouldShow": "true"}]');

-- Test senders
INSERT INTO senders (id, website, sendgrid_api_key, mailchimp_api_key, smtp_host, smtp_port, smtp_username, smtp_password, sender_type) VALUES 
(1, 'test.com', 'SG.test_key.test_value', '', '', 0, '', '', 'cx_sendgrid_default'),
(2, 'admin.com', 'SG.test_key.test_value', '', '', 0, '', '', 'cx_sendgrid_default'),
(3, 'pending.com', 'SG.test_key.test_value', '', '', 0, '', '', 'cx_sendgrid_default');

-- Test email newsletters
INSERT INTO email_newsletters (id, website, template_name, html_components) VALUES 
(1, 'test.com', 'Default Basic', '[]'),
(2, 'admin.com', 'Default Basic', '[]'),
(3, 'pending.com', 'Default Basic', '[]');

-- Test websites
INSERT INTO websites (id, link, package_type, user_id, sender_id, newsletter_id, collector, emails_quota, is_active, analytics_enabled) VALUES 
(1, 'test.com', 'freemium', 1, 1, 1, '{"titleText": "Subscribe to our email newsletter", "subtitleText": "Don\'t miss out on anything!", "buttonText": "Subscribe", "type": "bottom-popup", "template": "template-basic", "isActive": true}', 10, true, false),
(2, 'admin.com', 'premium', 2, 2, 2, '{"titleText": "Subscribe to our email newsletter", "subtitleText": "Don\'t miss out on anything!", "buttonText": "Subscribe", "type": "bottom-popup", "template": "template-basic", "isActive": true}', 1000, true, true);

-- Test confirmation tokens
INSERT INTO confirmation_tokens (id, token, creation_date, user_id) VALUES 
(1, 'test-confirmation-token-123', NOW(), 3);
