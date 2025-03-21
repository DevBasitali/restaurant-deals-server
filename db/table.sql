-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'restaurant', 'user')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restaurants Table
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    owner_id INT NOT NULL,
    subscription_plan VARCHAR(50) CHECK (subscription_plan IN ('Basic', 'Pro', 'Premium')) DEFAULT 'Basic',
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deals Table
CREATE TABLE deals (
    id SERIAL PRIMARY KEY,
    restaurant_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    deal_type VARCHAR(50) CHECK (deal_type IN ('daily', 'weekly', 'monthly')) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Bids Table
CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    restaurant_id INT NOT NULL,
    deal_id INT NOT NULL,
    bid_amount DECIMAL(10, 2) NOT NULL,
    bid_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE
);

-- Subscriptions Table
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    restaurant_id INT NOT NULL,
    plan VARCHAR(50) CHECK (plan IN ('Basic', 'Pro', 'Premium')) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Flash Deals Table
CREATE TABLE flash_deals (
    id SERIAL PRIMARY KEY,
    deal_id INT NOT NULL,
    discount_percentage DECIMAL(5, 2) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    deal_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE
);

-- Admin Management Table
CREATE TABLE admin_management (
    id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL,
    action TEXT NOT NULL,
    target_id INT,
    target_type VARCHAR(50) CHECK (target_type IN ('restaurant', 'deal', 'review')),
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);
