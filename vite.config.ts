import { defineConfig, loadEnv, type ProxyOptions } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  /** Faqat to'liq (http/https) manzildan origin oladi, aks holda ''. */
  const toOrigin = (value?: string) => {
    try {
      const url = new URL(value ?? '')
      return /^https?:$/.test(url.protocol) ? url.origin : ''
    } catch {
      return ''
    }
  }

  const apiOrigin = toOrigin(env.VITE_API_URL)

  // Nisbiy VITE_API_URL bilan proxy o'z-o'ziga (localhost'ga) so'rov yuborib qolardi.
  const useApiProxy =
    command === 'serve' && env.VITE_API_PROXY === 'true' && !!apiOrigin

  if (command === 'serve' && env.VITE_API_PROXY === 'true' && !apiOrigin) {
    console.warn(
      `[vite] VITE_API_PROXY=true, lekin VITE_API_URL to'liq manzil emas: "${env.VITE_API_URL}". Proxy o'chirildi.`,
    )
  }

  // Sanctum `EnsureFrontendRequestsAreStateful` so'rov Origin'ini
  // SANCTUM_STATEFUL_DOMAINS bilan solishtiradi. Dev'da biz localhost'dan
  // kiramiz — u ro'yxatda yo'q, shuning uchun sessiya cookie'si e'tiborsiz
  // qolib, logindan keyingi har bir so'rov 401 bilan qaytardi.
  // Yechim: proxy so'rovida Origin/Referer'ni ruxsat etilgan domenga almashtirish.
  const spoofOrigin = toOrigin(env.VITE_DEV_PROXY_ORIGIN) || apiOrigin

  const proxyOptions: ProxyOptions = {
    target: apiOrigin,
    changeOrigin: true,
    secure: true,
    // Cookie'lar localhost'ga tegishli bo'lsin (backend domeni emas).
    cookieDomainRewrite: '',
    headers: {
      origin: spoofOrigin,
      referer: `${spoofOrigin}/`,
      // ngrok (free) brauzer so'rovlariga JSON o'rniga ogohlantirish HTML sahifasini qaytaradi.
      ...(apiOrigin.includes('ngrok') && {
        'ngrok-skip-browser-warning': 'true',
      }),
    },
    configure: (proxy) => {
      // https backend `Secure` cookie qo'ysa, http://localhost'da (Safari va
      // b.) u saqlanmaydi — dev'da `Secure` va `SameSite=None` olib tashlanadi.
      proxy.on('proxyRes', (proxyRes) => {
        const cookies = proxyRes.headers['set-cookie']
        if (!cookies) return

        proxyRes.headers['set-cookie'] = cookies.map((cookie) =>
          cookie
            .replace(/;\s*secure/gi, '')
            .replace(/;\s*samesite=none/gi, '; SameSite=Lax'),
        )
      })
    },
  }

  return {
    plugins: [
      react(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace(
            '</head>',
            `<meta name="build-time" content="${Date.now()}"></head>`,
          )
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    ...(useApiProxy && {
      server: {
        proxy: {
          '/api': proxyOptions,
          // Sanctum CSRF cookie'si ham shu origin'dan kelishi kerak
          '/sanctum': proxyOptions,
        },
      },
    }),
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            query: ['@tanstack/react-query'],
            mantine: [
              '@mantine/core',
              '@mantine/hooks',
              '@mantine/form',
              '@mantine/dates',
            ],
            icons: ['@tabler/icons-react'],
          },
        },
      },
    },
  }
})
