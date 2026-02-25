import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import CustomerLoginDialog from '@/components/customer/CustomerLoginDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Clock, Search, Leaf, Filter } from 'lucide-react';
import CartButton from '@/components/customer/CartButton';
import BottomNav from '@/components/customer/BottomNav';
import { calculatePlatformMargin } from '@/lib/priceUtils';

interface HomemadeItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_vegetarian: boolean;
  preparation_time_minutes: number | null;
  category_id: string | null;
  platform_margin_type: string | null;
  platform_margin_value: number | null;
  images: { id: string; image_url: string; is_primary: boolean }[];
  category: { id: string; name: string } | null;
}

const getCustomerPrice = (item: HomemadeItem): number => {
  const marginType = (item.platform_margin_type || 'percent') as 'percent' | 'fixed';
  const marginValue = item.platform_margin_value || 0;
  const margin = calculatePlatformMargin(item.price, marginType, marginValue);
  return item.price + margin;
};

const HomemadeOrder: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { requireAuth, showLoginDialog, setShowLoginDialog, onLoginSuccess } = useAuthCheck();

  const [items, setItems] = useState<HomemadeItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Get all food_item_ids that have at least one active+available cook allocated
        const { data: cookDishes, error: cookDishesError } = await supabase
          .from('cook_dishes')
          .select(`
            food_item_id,
            cooks!inner(is_active, is_available)
          `);

        if (cookDishesError) throw cookDishesError;

        const allocatedItemIds = [...new Set(
          (cookDishes || [])
            .filter((cd: any) => cd.cooks?.is_active && cd.cooks?.is_available)
            .map((cd: any) => cd.food_item_id)
        )];

        if (allocatedItemIds.length === 0) {
          setItems([]);
          setIsLoading(false);
          return;
        }

        // 2. Fetch those food items that are homemade + available + allocated to a cook
        const { data: foodItems, error: itemsError } = await supabase
          .from('food_items')
          .select(`
            id, name, description, price, is_vegetarian, preparation_time_minutes,
            category_id, platform_margin_type, platform_margin_value,
            images:food_item_images(id, image_url, is_primary),
            category:food_categories(id, name)
          `)
          .or('service_types.cs.{homemade},service_type.eq.homemade')
          .eq('is_available', true)
          .in('id', allocatedItemIds)
          .order('name');

        if (itemsError) throw itemsError;

        setItems((foodItems || []) as unknown as HomemadeItem[]);

        // Extract unique categories from results
        const cats = new Map<string, string>();
        (foodItems || []).forEach((item: any) => {
          if (item.category?.id && item.category?.name) {
            cats.set(item.category.id, item.category.name);
          }
        });
        setCategories(Array.from(cats.entries()).map(([id, name]) => ({ id, name })));
      } catch (error) {
        console.error('Error fetching homemade items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (e: React.MouseEvent, item: HomemadeItem) => {
    e.stopPropagation();
    requireAuth(() => addToCart(item.id));
  };

  const handleItemClick = (itemId: string) => {
    requireAuth(() => navigate(`/item/${itemId}`));
  };

  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        default: return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="flex h-14 items-center gap-3 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-display text-lg font-semibold">🏠 Homemade Food</h1>
        </div>
      </header>

      {/* Coming Soon */}
      <main className="flex flex-col items-center justify-center px-4 py-24 text-center">
        <span className="text-7xl">🏠</span>
        <h2 className="mt-6 text-2xl font-bold">Coming Soon!</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Homemade food delivery is launching soon. Stay tuned for fresh, home-cooked meals delivered to your doorstep!
        </p>
        <Button className="mt-6" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default HomemadeOrder;
