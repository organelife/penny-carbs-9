import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReportFilters } from '@/types/reports';

export const useSalesReport = (filters: ReportFilters) => {
  return useQuery({
    queryKey: ['sales-report', filters],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select(`
          id,
          status,
          total_amount,
          service_type,
          panchayat_id,
          ward_number,
          created_at,
          panchayats!orders_panchayat_id_fkey(name)
        `);

      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate.toISOString());
      }
      if (filters.serviceType && filters.serviceType !== 'all') {
        query = query.eq('service_type', filters.serviceType as 'indoor_events' | 'cloud_kitchen' | 'homemade');
      }
      if (filters.panchayatId && filters.panchayatId !== 'all') {
        query = query.eq('panchayat_id', filters.panchayatId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useCookPerformanceReport = (filters: ReportFilters) => {
  return useQuery({
    queryKey: ['cook-performance-report', filters],
    queryFn: async () => {
      const { data: cooks, error: cooksError } = await supabase
        .from('cooks')
        .select('id, kitchen_name, rating, total_orders, panchayat_id');

      if (cooksError) throw cooksError;

      // Use order_assigned_cooks table which tracks actual cook assignments
      let assignmentsQuery = supabase
        .from('order_assigned_cooks')
        .select('cook_id, cook_status, order_id, orders!order_assigned_cooks_order_id_fkey(status, total_amount, created_at)');

      const { data: assignments, error: assignmentsError } = await assignmentsQuery;
      if (assignmentsError) throw assignmentsError;

      // Filter by date using the order's created_at
      const filteredAssignments = assignments?.filter(a => {
        const order = a.orders as unknown as { status: string; total_amount: number; created_at: string } | null;
        if (!order) return false;
        if (filters.startDate && new Date(order.created_at) < filters.startDate) return false;
        if (filters.endDate && new Date(order.created_at) > filters.endDate) return false;
        return true;
      }) || [];

      return cooks?.map(cook => {
        const cookAssignments = filteredAssignments.filter(a => a.cook_id === cook.id);
        return {
          cook_id: cook.id,
          kitchen_name: cook.kitchen_name,
          total_orders: cookAssignments.length,
          accepted_orders: cookAssignments.filter(a => ['accepted', 'preparing', 'cooked', 'ready'].includes(a.cook_status)).length,
          rejected_orders: cookAssignments.filter(a => a.cook_status === 'rejected').length,
          completed_orders: cookAssignments.filter(a => {
            const order = a.orders as unknown as { status: string } | null;
            return order?.status === 'delivered';
          }).length,
          average_rating: cook.rating || 0,
          total_earnings: cookAssignments.filter(a => {
            const order = a.orders as unknown as { status: string } | null;
            return order?.status === 'delivered';
          }).reduce((sum, a) => {
            const order = a.orders as unknown as { total_amount: number } | null;
            return sum + (order?.total_amount || 0);
          }, 0),
        };
      });
    },
  });
};

export const useDeliverySettlementReport = () => {
  return useQuery({
    queryKey: ['delivery-settlement-report'],
    queryFn: async () => {
      const { data: staff, error: staffError } = await supabase
        .from('delivery_staff')
        .select(`
          id,
          name,
          total_deliveries,
          delivery_wallets(collected_amount, job_earnings, total_settled)
        `);

      if (staffError) throw staffError;

      return staff?.map(s => {
        const wallet = Array.isArray(s.delivery_wallets) 
          ? s.delivery_wallets[0] 
          : s.delivery_wallets;
        return {
          staff_id: s.id,
          staff_name: s.name,
          total_deliveries: s.total_deliveries || 0,
          collected_amount: wallet?.collected_amount || 0,
          job_earnings: wallet?.job_earnings || 0,
          total_settled: wallet?.total_settled || 0,
          pending_settlement: (wallet?.collected_amount || 0) + (wallet?.job_earnings || 0) - (wallet?.total_settled || 0),
        };
      });
    },
  });
};

export const useReferralReport = () => {
  return useQuery({
    queryKey: ['referral-report'],
    queryFn: async () => {
      const { data: referralCodes, error: codesError } = await supabase
        .from('referral_codes')
        .select(`
          id,
          user_id,
          code,
          total_referrals,
          total_earnings
        `);

      if (codesError) throw codesError;

      const { data: referrals, error: referralsError } = await supabase
        .from('referrals')
        .select('referrer_id, commission_amount, status');

      if (referralsError) throw referralsError;

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, name');

      if (profilesError) throw profilesError;

      return referralCodes?.map(rc => {
        const userReferrals = referrals?.filter(r => r.referrer_id === rc.user_id) || [];
        const profile = profiles?.find(p => p.user_id === rc.user_id);
        return {
          referrer_id: rc.user_id,
          referrer_name: profile?.name || 'Unknown',
          referral_code: rc.code,
          total_referrals: userReferrals.length,
          total_commission: userReferrals.reduce((sum, r) => sum + (r.commission_amount || 0), 0),
          pending_commission: userReferrals.filter(r => r.status === 'pending').reduce((sum, r) => sum + (r.commission_amount || 0), 0),
          paid_commission: userReferrals.filter(r => r.status === 'paid').reduce((sum, r) => sum + (r.commission_amount || 0), 0),
        };
      });
    },
  });
};

export const useVehicleRentReport = (filters: ReportFilters) => {
  return useQuery({
    queryKey: ['vehicle-rent-report', filters],
    queryFn: async () => {
      let query = supabase
        .from('indoor_event_vehicles')
        .select(`
          id,
          order_id,
          vehicle_number,
          driver_name,
          driver_mobile,
          rent_amount,
          created_at,
          orders!indoor_event_vehicles_order_id_fkey(order_number, status, panchayat_id, panchayats!orders_panchayat_id_fkey(name))
        `)
        .not('rent_amount', 'is', null)
        .gt('rent_amount', 0);

      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate.toISOString());
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const usePanchayats = () => {
  return useQuery({
    queryKey: ['panchayats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('panchayats')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
  });
};
