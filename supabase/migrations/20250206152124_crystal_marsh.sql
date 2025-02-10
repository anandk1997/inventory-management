/*
 # Initial Schema for Inventory Management System
 
 1. New Tables
 - `categories`
 - `id` (uuid, primary key)
 - `name` (text, unique)
 - `description` (text)
 - `created_at` (timestamp)
 
 - `products`
 - `id` (uuid, primary key)
 - `name` (text)
 - `description` (text)
 - `category_id` (uuid, foreign key)
 - `sku` (text, unique)
 - `quantity` (integer)
 - `min_quantity` (integer)
 - `unit_price` (decimal)
 - `created_at` (timestamp)
 - `updated_at` (timestamp)
 
 - `inventory_transactions`
 - `id` (uuid, primary key)
 - `product_id` (uuid, foreign key)
 - `type` (text) - 'IN' or 'OUT'
 - `quantity` (integer)
 - `notes` (text)
 - `created_at` (timestamp)
 - `created_by` (uuid, foreign key)
 
 2. Security
 - Enable RLS on all tables
 - Add policies for authenticated users
 */
-- Users table (storing additional user info)
CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name text,
    last_name text,
    email text UNIQUE NOT NULL,
    password text,
    phone text,
    address text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ALTER TABLE
--     users ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Allow authenticated users full access to users" ON users FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Categories table
CREATE TABLE categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    description text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE
    categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Products table
CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    category_id uuid REFERENCES categories(id),
    sku text UNIQUE NOT NULL,
    quantity integer NOT NULL DEFAULT 0,
    min_quantity integer NOT NULL DEFAULT 0,
    unit_price decimal(10, 2) NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE
    products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Inventory transactions table
CREATE TABLE inventory_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES products(id),
    type text NOT NULL CHECK (type IN ('IN', 'OUT')),
    quantity integer NOT NULL,
    notes text,
    created_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES users(id)
);

ALTER TABLE
    inventory_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to create and view transactions" ON inventory_transactions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Function to update product quantity
CREATE OR REPLACE FUNCTION update_product_quantity() RETURNS TRIGGER AS $$ 
BEGIN
    IF NEW.type = 'IN' THEN
        UPDATE products
        SET quantity = quantity + NEW.quantity,
            updated_at = now()
        WHERE id = NEW.product_id;
    
    ELSIF NEW.type = 'OUT' THEN
        UPDATE products
        SET quantity = quantity - NEW.quantity,
            updated_at = now()
        WHERE id = NEW.product_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update product quantity on transaction
CREATE TRIGGER update_product_quantity_trigger
AFTER INSERT
    ON inventory_transactions FOR EACH ROW EXECUTE FUNCTION update_product_quantity();
