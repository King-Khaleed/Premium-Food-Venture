'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export function AuthRedirector() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAdmin(!!user);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAdmin(true);
        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (isAdmin) {
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Link href="/admin" passHref>
                <Button size="lg">
                    <LogIn className="mr-2 h-5 w-5" />
                    Go to Admin
                </Button>
            </Link>
        </div>
    );
  }

  return null;
}
