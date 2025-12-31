-- Add contact_info table migration
USE portfolio_db;

-- Create contact_info table
CREATE TABLE IF NOT EXISTS contact_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('link', 'location', 'response_time') NOT NULL DEFAULT 'link',
    icon_name VARCHAR(100),
    label VARCHAR(255) NOT NULL,
    value VARCHAR(500) NOT NULL,
    href VARCHAR(500),
    color_class VARCHAR(100),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_contact_info_type (type),
    INDEX idx_contact_info_order (display_order)
);

-- Insert default contact info (optional - customize these values)
INSERT INTO contact_info (type, icon_name, label, value, href, color_class, display_order) VALUES
('link', 'MessageCircle', 'WhatsApp', '+1 (555) 123-4567', 'https://wa.me/15551234567', 'hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/50', 1),
('link', 'Linkedin', 'LinkedIn', 'linkedin.com/in/yourprofile', 'https://linkedin.com/in/yourprofile', 'hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/50', 2),
('link', 'Mail', 'Email', 'your.email@example.com', 'mailto:your.email@example.com', 'hover:bg-primary/10 hover:text-primary hover:border-primary/50', 3),
('link', 'Github', 'GitHub', 'github.com/yourusername', 'https://github.com/yourusername', 'hover:bg-foreground/10 hover:text-foreground hover:border-foreground/50', 4),
('location', 'MapPin', 'Location', 'Your City, Country', NULL, NULL, 5),
('response_time', 'Phone', 'Response Time', 'Usually within 24 hours', NULL, NULL, 6);

SELECT 'Migration completed successfully! contact_info table created and populated with default data.' as message;
