-- TECNICO=0, PROFESSOR=1, ALUNO=2 (enum ordinals after adding TECNICO)
-- Previous: PROFESSOR=0, ALUNO=1

UPDATE users SET role = 2 WHERE role = 1;

UPDATE users
SET name = 'Matoso',
    email = 'matoso@etec.com'
WHERE email = 'admin@admin.com';

INSERT INTO users (name, email, password, role)
SELECT 'Professor', 'professor@etec.com', '$2a$10$83Bgzxbsv/4JFHSNjTd8vuJx49vIGXwQI8qJf4NRtQAZSGN/9CVGm', 1
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'professor@etec.com');
