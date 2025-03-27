-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'restaurant_owner', 'user')) NOT NULL,
    approvalstatus VARCHAR(50) DEFAULT 'pending',  -- New field added
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restaurants Table
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    ownerid INT NOT NULL,
    subscriptionplan VARCHAR(50) CHECK (subscriptionplan IN ('Basic', 'Pro', 'Premium')) DEFAULT 'Basic',
    FOREIGN KEY (ownerid) REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deals Table
CREATE TABLE deals (
    id SERIAL PRIMARY KEY,
    restaurantid INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    dealtype VARCHAR(50) CHECK (dealtype IN ('daily', 'weekly', 'monthly')) NOT NULL,
    starttime TIMESTAMP NOT NULL,
    endtime TIMESTAMP NOT NULL,
    FOREIGN KEY (restaurantid) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Bids Table
CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    restaurantid INT NOT NULL,
    dealid INT NOT NULL,
    bidamount DECIMAL(10, 2) NOT NULL,
    biddate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurantid) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (dealid) REFERENCES deals(id) ON DELETE CASCADE
);

-- Subscriptions Table
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    restaurantid INT NOT NULL,
    plan VARCHAR(50) CHECK (plan IN ('Basic', 'Pro', 'Premium')) NOT NULL,
    startdate TIMESTAMP NOT NULL,
    enddate TIMESTAMP NOT NULL,
    FOREIGN KEY (restaurantid) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Flash Deals Table
CREATE TABLE flash_deals (
    id SERIAL PRIMARY KEY,
    dealid INT NOT NULL,
    discountpercentage DECIMAL(5, 2) NOT NULL,
    starttime TIMESTAMP NOT NULL,
    endtime TIMESTAMP NOT NULL,
    FOREIGN KEY (dealid) REFERENCES deals(id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    dealid INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    reviewtext TEXT,
    reviewdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dealid) REFERENCES deals(id) ON DELETE CASCADE
);

-- Admin Management Table
CREATE TABLE admin_management (
    id SERIAL PRIMARY KEY,
    adminid INT NOT NULL,
    action TEXT NOT NULL,
    targetid INT,
    targettype VARCHAR(50) CHECK (targettype IN ('restaurant', 'deal', 'review')),
    actiondate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (adminid) REFERENCES users(id) ON DELETE CASCADE
);
