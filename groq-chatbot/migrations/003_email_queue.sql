CREATE TABLE IF NOT EXISTS email_queue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('welcome', 'login_notification') NOT NULL,
    target_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    provider VARCHAR(50),
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    last_error TEXT,
    status ENUM('pending', 'processing', 'sent', 'failed') DEFAULT 'pending',
    next_attempt_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);