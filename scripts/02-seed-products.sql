-- Insert sample tea products
INSERT INTO public.products 
(name, description, price, category, image_url, stock_quantity, size, is_available) 
VALUES
('Ubuntu Harmony Blend', 'A carefully crafted blend of African herbs designed to support hormonal balance and women''s wellness. Features rooibos, honeybush, and traditional healing herbs.', 24.99, 'hormonal_balance', '/placeholder.svg?height=400&width=400', 50, '250g', true),

('Chi Energy Boost', 'Energizing morning blend with African potato, moringa, and ginger. Perfect for starting your day with natural vitality and focus.', 22.99, 'energy', '/placeholder.svg?height=400&width=400', 45, '200g', true),

('Serene Sleep Ritual', 'Calming evening blend featuring chamomile, African potato, and lavender. Promotes restful sleep and relaxation after a long day.', 26.99, 'sleep', '/placeholder.svg?height=400&width=400', 40, '250g', true),

('Wellness Warrior', 'Immune-boosting blend with African herbs, echinacea, and antioxidant-rich rooibos. Support your body''s natural defenses.', 28.99, 'wellness', '/placeholder.svg?height=400&width=400', 35, '300g', true),

('Morning Vitality', 'Invigorating breakfast tea with African black tea, ginger, and citrus notes. Start your day with purpose and energy.', 21.99, 'energy', '/placeholder.svg?height=400&width=400', 60, '200g', true),

('Moonlight Calm', 'Gentle nighttime blend with passionflower, African herbs, and honey bush. Perfect for evening meditation and wind-down.', 25.99, 'sleep', '/placeholder.svg?height=400&width=400', 30, '250g', true);
