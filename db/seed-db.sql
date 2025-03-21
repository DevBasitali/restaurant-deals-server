-- Insert Users
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@foodypand.com', 'hashedpassword', 'admin'),
('John Doe', 'johndoe@foodypand.com', 'hashedpassword', 'restaurant'),
('Jane Smith', 'janesmith@foodypand.com', 'hashedpassword', 'user');

-- Insert Restaurants
INSERT INTO restaurants (name, description, address, owner_id, subscription_plan) VALUES
('Doe’s Diner', 'A cozy family diner.', '123 Main Street', 2, 'Pro'),
('Smith’s Eatery', 'A trendy modern cafe.', '456 Oak Avenue', 2, 'Basic');

-- Insert Deals
INSERT INTO deals (restaurant_id, title, description, price, deal_type, start_time, end_time) VALUES
(1, 'Breakfast Special', 'Get 20% off our breakfast menu', 5.99, 'daily', '2025-03-20 08:00:00', '2025-03-20 11:00:00'),
(1, 'Weekend Dinner Combo', 'Buy 1 get 1 free on selected dinner items', 15.99, 'weekly', '2025-03-21 18:00:00', '2025-03-21 22:00:00'),
(2, 'Lunch Discount', 'Enjoy 10% off all lunch items', 7.99, 'daily', '2025-03-19 12:00:00', '2025-03-19 14:00:00');

-- Insert Bids
INSERT INTO bids (restaurant_id, deal_id, bid_amount) VALUES
(1, 1, 50.00),
(2, 3, 35.00);

-- Insert Subscriptions
INSERT INTO subscriptions (restaurant_id, plan, start_date, end_date) VALUES
(1, 'Pro', '2025-03-01 00:00:00', '2025-06-01 00:00:00'),
(2, 'Basic', '2025-03-01 00:00:00', '2025-06-01 00:00:00');

-- Insert Flash Deals
INSERT INTO flash_deals (deal_id, discount_percentage, start_time, end_time) VALUES
(1, 30.00, '2025-03-20 10:00:00', '2025-03-20 11:00:00');

-- Insert Reviews
INSERT INTO reviews (user_id, deal_id, rating, review_text) VALUES
(3, 1, 4, 'The breakfast was delicious and the discount made it even better!'),
(3, 3, 5, 'Great value for a tasty lunch.');

-- Insert Admin Management Actions
INSERT INTO admin_management (admin_id, action, target_id, target_type) VALUES
(1, 'Approved restaurant Doe’s Diner', 1, 'restaurant'),
(1, 'Banned restaurant Smith’s Eatery', 2, 'restaurant');
