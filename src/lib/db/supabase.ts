import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions
export const db = {
  // Users
  users: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    
    search: async (query: string) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    
    updatePoints: async (userId: string, points: number) => {
      const { data, error } = await supabase
        .from('users')
        .update({
          total_points: points,
          available_points: points
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    create: async (userData: {
      email: string;
      name: string;
      phone?: string;
      referral_code: string;
      referred_by?: string;
    }) => {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          email: userData.email,
          name: userData.name,
          phone: userData.phone || null,
          referral_code: userData.referral_code,
          referred_by: userData.referred_by || null,
          total_points: 0,
          available_points: 0
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    update: async (userId: string, userData: {
      email?: string;
      name?: string;
      phone?: string;
      total_points?: number;
      available_points?: number;
    }) => {
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    delete: async (userId: string) => {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      return { success: true };
    }
  },
  
  // Admins
  admins: {
    getByEmail: async (email: string) => {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) throw error;
      return data;
    }
  },
  
  // Tasks
  tasks: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  },
  
  // Task Submissions
  submissions: {
    getAll: async (status?: string) => {
      let query = supabase
        .from('task_submissions')
        .select(`
          *,
          user:users(*),
          task:tasks(*)
        `)
        .order('created_at', { ascending: false });
      
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('task_submissions')
        .select(`
          *,
          user:users(*),
          task:tasks(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    
    approve: async (id: string, adminId: string) => {
      const { data, error } = await supabase
        .from('task_submissions')
        .update({
          status: 'approved',
          validated_by: adminId,
          validated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    
    reject: async (id: string, adminId: string, reason: string) => {
      const { data, error } = await supabase
        .from('task_submissions')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          validated_by: adminId,
          validated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },
  
  // Certificates
  certificates: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          user:users(*),
          task_submission:task_submissions(
            *,
            task:tasks(*)
          )
        `)
        .order('issued_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    
    create: async (certificate: any) => {
      const { data, error } = await supabase
        .from('certificates')
        .insert(certificate)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    
    updateEmailStatus: async (id: string, sent: boolean) => {
      const { data, error } = await supabase
        .from('certificates')
        .update({
          email_sent: sent,
          email_sent_at: sent ? new Date().toISOString() : null
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },
  
  // Redeem Requests
  redeemRequests: {
    getAll: async (status?: string) => {
      let query = supabase
        .from('redeem_requests')
        .select(`
          *,
          user:users(*)
        `)
        .order('created_at', { ascending: false });
      
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    
    approve: async (id: string, adminId: string, notes?: string) => {
      const { data, error } = await supabase
        .from('redeem_requests')
        .update({
          status: 'approved',
          admin_notes: notes,
          processed_by: adminId,
          processed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    
    reject: async (id: string, adminId: string, reason: string) => {
      const { data, error } = await supabase
        .from('redeem_requests')
        .update({
          status: 'rejected',
          admin_notes: reason,
          processed_by: adminId,
          processed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },
  
  // Payouts
  payouts: {
    getAll: async (status?: string) => {
      let query = supabase
        .from('payouts')
        .select(`
          *,
          user:users(*),
          redeem_request:redeem_requests(*)
        `)
        .order('created_at', { ascending: false });
      
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    
    update: async (id: string, updates: any) => {
      const { data, error } = await supabase
        .from('payouts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },
  
  // Referrals
  referrals: {
    getByUserId: async (userId: string) => {
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          referrer:referrer_id(*)
,
          referred:referred_id(*)
        `)
        .or(`referrer_id.eq.${userId},referred_id.eq.${userId}`);
      
      if (error) throw error;
      return data;
    }
  },
  
  // Dashboard Stats
  stats: {
    getDashboard: async () => {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      // Get total referrals
      const { count: totalReferrals } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true });
      
      // Get pending validations
      const { count: pendingValidations } = await supabase
        .from('task_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      // Get pending redemptions
      const { count: pendingRedemptions } = await supabase
        .from('redeem_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      // Get total points awarded
      const { data: usersData } = await supabase
        .from('users')
        .select('total_points');
      
      const totalPointsAwarded = usersData?.reduce((sum, user) => sum + (user.total_points || 0), 0) || 0;
      
      // Get completed payouts
      const { count: completedPayouts } = await supabase
        .from('payouts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');
      
      return {
        totalUsers: totalUsers || 0,
        totalReferrals: totalReferrals || 0,
        pendingValidations: pendingValidations || 0,
        pendingRedemptions: pendingRedemptions || 0,
        totalPointsAwarded,
        completedPayouts: completedPayouts || 0
      };
    }
  }
};
