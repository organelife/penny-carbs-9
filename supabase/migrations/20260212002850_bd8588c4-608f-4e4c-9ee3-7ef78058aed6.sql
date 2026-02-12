-- Add custom_price column to cook_dishes so each cook can set their own price
ALTER TABLE public.cook_dishes ADD COLUMN custom_price numeric DEFAULT NULL;

-- Allow cooks to update their own dish prices
CREATE POLICY "Cooks can update their own dish prices"
ON public.cook_dishes
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM cooks c WHERE c.id = cook_dishes.cook_id AND c.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM cooks c WHERE c.id = cook_dishes.cook_id AND c.user_id = auth.uid()
));