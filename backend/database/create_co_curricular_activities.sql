-- Add co-curricular activities table

CREATE TABLE IF NOT EXISTS co_curricular_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    image_url VARCHAR(500),
    description TEXT,
    year VARCHAR(50),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_activities_order (display_order)
);
