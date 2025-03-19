-- seeddb.sql

-- Insert test data into users table
INSERT INTO users (name, email, password, role)
VALUES 
  ('John Doe', 'john@example.com', 'hashedpassword123', 'user'),
  ('Jane Smith', 'jane@example.com', 'hashedpassword456', 'restaurant');

-- Insert test data into restaurants table
INSERT INTO restaurants (user_id, name, location, logo, description)
VALUES 
  (2, 'Pizza Palace', '123 Pizza Street', 'https://example.com/logo1.png', 'Best pizza in town.'),
  (2, 'Burger Bonanza', '456 Burger Avenue', 'https://example.com/logo2.png', 'Amazing burgers.');

-- Insert test data into deals table
INSERT INTO deals (restaurant_id, title, description, price, type, image, validity_start, validity_end)
VALUES 
  (1, '50% Off Large Pizzas', 'Get half off large pizzas this weekend only!', 9.99, 'weekly', 'https://example.com/pizza.png', '2025-03-15', '2025-03-21'),
  (2, 'Buy 1 Get 1 Free Burger', 'Get a free burger with every burger you purchase.', 7.99, 'daily', 'https://example.com/burger.png', '2025-03-16', '2025-03-16');

-- Insert test data into bids table
INSERT INTO bids (restaurant_id, amount)
VALUES 
  (1, 50.00), -- Pizza Palace places a bid
  (2, 75.00); -- Burger Bonanza places a higher bid

-- Insert test data into reviews table
INSERT INTO reviews (user_id, deal_id, rating, comment)
VALUES 
  (1, 1, 5, 'Best pizza deal ever!'),
  (1, 2, 4, 'Good burger, but service was slow.');

-- Insert test data into redemptions table
INSERT INTO redemptions (user_id, deal_id, redeemed_at)
VALUES 
  (1, 1, CURRENT_TIMESTAMP),
  (1, 2, CURRENT_TIMESTAMP);
