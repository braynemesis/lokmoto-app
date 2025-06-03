/*
  # Add Sample Motorcycle Data

  1. Sample Data
    - Add 10 motorcycles with realistic data
    - Include various brands, models, and categories
    - Set reasonable daily rates
    - Add sample images from Pexels
*/

-- Insert sample motorcycles
INSERT INTO motorcycles (
  brand,
  model,
  year,
  color,
  license_plate,
  chassis_number,
  renavam,
  daily_rate,
  description,
  category,
  status,
  image_urls,
  owner_id
) VALUES
-- Sport Motorcycles
(
  'Honda',
  'CBR 1000RR',
  2024,
  'Red/Black',
  'ABC1234',
  'CBR1000RR2024001',
  '12345678901',
  299.90,
  'Powerful and agile superbike perfect for experienced riders. Features include ABS, traction control, and multiple riding modes.',
  'Sport',
  'available',
  ARRAY[
    'https://images.pexels.com/photos/2393821/pexels-photo-2393821.jpeg',
    'https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilots-163210.jpeg'
  ],
  (SELECT id FROM profiles WHERE email = 'admin@example.com' LIMIT 1)
),
(
  'Yamaha',
  'YZF R6',
  2023,
  'Blue/Silver',
  'DEF5678',
  'YZFR62023001',
  '23456789012',
  249.90,
  'High-performance supersport motorcycle with exceptional handling and aggressive styling.',
  'Sport',
  'available',
  ARRAY[
    'https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg',
    'https://images.pexels.com/photos/205957/pexels-photo-205957.jpeg'
  ],
  (SELECT id FROM profiles WHERE email = 'admin@example.com' LIMIT 1)
),
-- Urban/Naked Motorcycles
(
  'Kawasaki',
  'Z900',
  2024,
  'Green/Black',
  'GHI9012',
  'Z900202400001',
  '34567890123',
  199.90,
  'Versatile naked bike with excellent power delivery and modern electronics package.',
  'Urban',
  'available',
  ARRAY[
    'https://images.pexels.com/photos/2549942/pexels-photo-2549942.jpeg',
    'https://images.pexels.com/photos/595807/pexels-photo-595807.jpeg'
  ],
  (SELECT id FROM profiles WHERE email = 'admin@example.com' LIMIT 1)
),
(
  'BMW',
  'F900R',
  2023,
  'White/Blue',
  'JKL3456',
  'F900R2023001',
  '45678901234',
  189.90,
  'Premium middleweight roadster with advanced technology and comfortable ergonomics.',
  'Urban',
  'available',
  ARRAY[
    'https://images.pexels.com/photos/1715193/pexels-photo-1715193.jpeg',
    'https://images.pexels.com/photos/2611686/pexels-photo-2611686.jpeg'
  ],
  (SELECT id FROM profiles WHERE email = 'admin@example.com' LIMIT 1)
),
-- Trail/Adventure Motorcycles
(
  'BMW',
  'R1250GS Adventure',
  2024,
  'Black/Gray',
  'MNO7890',
  'R1250GS2024001',
  '56789012345',
  299.90,
  'The ultimate adventure motorcycle with unmatched versatility and comfort for long journeys.',
  'Trail',
  'available',
  ARRAY[
    'https://images.pexels.com/photos/2519374/pexels-photo-2519374.jpeg',
    'https://images.pexels.com/photos/2611687/pexels-photo-2611687.jpeg'
  ],
  (SELECT id FROM profiles WHERE email = 'admin@example.com' LIMIT 1)
),
(
  'Honda',
  'Africa Twin',
  2023,
  'Red/White/Black',
  'PQR1234',
  'AFRICATWIN2023001',
  '67890123456',
  259.90,
  'Capable adventure motorcycle with excellent off-road abilities and touring comfort.',
  'Trail',
  'available',
  ARRAY[
    'https://images.pexels.com/photos/2611690/pexels-photo-2611690.jpeg',
    'https://images.pexels.com/photos/2365572/pexels-photo-2365572.jpeg'
  ],
  (SELECT id FROM profiles WHERE email = 'admin@example.com' LIMIT 1)
),
-- Custom/Cruiser Motorcycles
(
  'Harley-Davidson',
  'Street Bob',
  2024,
  'Black',
  'STU5678',
  'STREETBOB2024001',
  '78901234567',
  279.90,
  'Classic American cruiser with modern performance and timeless styling.',
  'Custom',
  'available',
  ARRAY[
    'https://images.pexels.com/photos/1413414/pexels-photo-1413414.jpeg',
    'https://images.pexels.com/photos/258092/pexels-photo-258092.jpeg'
  ],
  (SELECT id FROM profiles WHERE email = 'admin@example.com' LIMIT 1)
),
(
  'Indian',
  'Scout Bobber',
  2023,
  'Matte Black',
  'VWX9012',
  'SCOUTBOBBER2023001',
  '89012345678',
  249.90,
  'Stylish bobber with powerful V-twin engine and excellent handling characteristics.',
  'Custom',
  'available',
  ARRAY[
    'https://images.pexels.com/photos/1045535/pexels-photo-1045535.jpeg',
    'https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg'
  ],
  (SELECT id FROM profiles WHERE email = 'admin@example.com' LIMIT 1)
),
-- Urban Commuters
(
  'Triumph',
  'Trident 660',
  2024,
  'Silver/Red',
  'YZA3456',
  'TRIDENT2024001',
  '90123456789',
  179.90,
  'Modern middleweight roadster perfect for city riding and weekend adventures.',
  'Urban',
  'available',
  ARRAY[
    'https://images.pexels.com/photos/2519375/pexels-photo-2519375.jpeg',
    'https://images.pexels.com/photos/1005115/pexels-photo-1005115.jpeg'
  ],
  (SELECT id FROM profiles WHERE email = 'admin@example.com' LIMIT 1)
),
(
  'Ducati',
  'Monster',
  2023,
  'Red',
  'BCD7890',
  'MONSTER2023001',
  '01234567890',
  229.90,
  'Iconic naked bike combining style, performance, and advanced electronics.',
  'Urban',
  'available',
  ARRAY[
    'https://images.pexels.com/photos/1645011/pexels-photo-1645011.jpeg',
    'https://images.pexels.com/photos/1413413/pexels-photo-1413413.jpeg'
  ],
  (SELECT id FROM profiles WHERE email = 'admin@example.com' LIMIT 1)
);