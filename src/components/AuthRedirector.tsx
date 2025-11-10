'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function AuthRedirector() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // This will trigger on SIGN_IN and SIGN_OUT
      // On sign-in, Supabase automatically refreshes the session, and we can safely redirect.
      // On sign-out, this ensures we refresh the page to clear any sensitive data.
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
          router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return null; // This component doesn't render anything.
}
