import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (typeof document === 'undefined') return '';
          const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
          return match ? decodeURIComponent(match[2]) : '';
        },
        set(name: string, value: string, options: any) {
          if (typeof document === 'undefined') return;
          // Force session cookie by stripping maxAge and expires
          const { maxAge, expires, ...rest } = options;

          let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${rest.path || '/'}`;
          if (rest.domain) cookieStr += `; domain=${rest.domain}`;
          if (rest.secure) cookieStr += `; secure`;
          if (rest.sameSite) cookieStr += `; samesite=${rest.sameSite}`;

          document.cookie = cookieStr;
        },
        remove(name: string, options: any) {
          if (typeof document === 'undefined') return;
          let cookieStr = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${options.path || '/'}`;
          if (options.domain) cookieStr += `; domain=${options.domain}`;
          if (options.sameSite) cookieStr += `; samesite=${options.sameSite}`;
          document.cookie = cookieStr;
        },
      }
    }
  )
}
