CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role SMALLINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password, role)
VALUES ('Administrador', 'admin@admin.com', '$2a$10$jdRHn.BzY1gR/S0DdSaPxOtWy2tDmKaJcNCPGSJWvdqvt/5/W9/oi', 0);
