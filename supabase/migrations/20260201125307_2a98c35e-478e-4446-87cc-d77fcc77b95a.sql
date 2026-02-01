-- Add discount and featured columns to food_items table
ALTER TABLE public.food_items
ADD COLUMN IF NOT EXISTS discount_percent numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Add index for featured items lookup
CREATE INDEX IF NOT EXISTS idx_food_items_featured ON public.food_items(is_featured) WHERE is_featured = true;