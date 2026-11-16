-- Migration: Allow NULL password for GitHub OAuth users
-- Jalankan perintah ini di MySQL:
-- mysql -u groqchat_user -p groqchat < migrations/002_github_oauth.sql

ALTER TABLE users MODIFY password VARCHAR(255) NULL;
