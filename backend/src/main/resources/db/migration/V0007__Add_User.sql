CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role SMALLINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password, role)
VALUES ('Administrador', 'admin@admin.com', '$2a$10$83Bgzxbsv/4JFHSNjTd8vuJx49vIGXwQI8qJf4NRtQAZSGN/9CVGm', 0);
