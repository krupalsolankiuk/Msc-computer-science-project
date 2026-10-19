-- database/init.sql
-- Bootstrap schema for the Hotel Guest Check-In Assistant.
-- Mirrors the SQLAlchemy models in backend/app/models/. Alembic manages
-- ongoing migrations; this file is used by Docker Compose to seed a
-- fresh Postgres container on first run.

CREATE TABLE IF NOT EXISTS bookings (
    booking_id      SERIAL PRIMARY KEY,
    guest_full_name VARCHAR(150) NOT NULL,
    passport_no     VARCHAR(50),
    check_in_date   DATE NOT NULL,
    check_out_date  DATE NOT NULL,
    room_number     VARCHAR(10),
    room_type       VARCHAR(50) DEFAULT 'Standard Room',
    status          VARCHAR(20) DEFAULT 'CONFIRMED'
);

CREATE TABLE IF NOT EXISTS guests (
    guest_id        SERIAL PRIMARY KEY,
    booking_id      INTEGER REFERENCES bookings(booking_id),
    full_name       VARCHAR(150),
    date_of_birth   DATE,
    document_type   VARCHAR(30),
    document_number VARCHAR(50),
    nationality     VARCHAR(50),
    ocr_confidence  NUMERIC(5,2),
    created_at      TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS verification_logs (
    log_id           SERIAL PRIMARY KEY,
    guest_id         INTEGER REFERENCES guests(guest_id),
    session_id       UUID NOT NULL,
    face_match_score NUMERIC(6,4),
    face_verified    BOOLEAN,
    ocr_raw_text     TEXT,
    voice_transcript TEXT,
    result           VARCHAR(20),
    created_at       TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_name ON bookings (guest_full_name);
CREATE INDEX IF NOT EXISTS idx_guests_booking ON guests (booking_id);

-- Sample seed data for local development / demo purposes
INSERT INTO bookings (guest_full_name, passport_no, check_in_date, check_out_date, room_number, room_type, status)
VALUES
    ('Jane Dull', 'X1234567', CURRENT_DATE, CURRENT_DATE + INTERVAL '4 days', '204', 'King Room', 'CONFIRMED'),
    ('John Smith', 'Y9876543', CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days', '311', 'Premium Room', 'CONFIRMED'),
    ('CHANG SHUJEN', 'A1234567', CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days', '312', 'Deluxe Suite', 'CONFIRMED'),
    ('KRUPAL SOLANKI', 'A1234568', CURRENT_DATE, CURRENT_DATE + INTERVAL '5 days', '311', 'Standard Room', 'CONFIRMED')
ON CONFLICT DO NOTHING;
