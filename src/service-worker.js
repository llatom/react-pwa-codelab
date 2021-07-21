import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { NavigationRoute, skipWaiting, registerRoute } from "workbox-routing";
import { setCacheNameDetails, clientsClaim } from "workbox-core";
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { imageCache } from "workbox-recipes";
import { BackgroundSyncPlugin } from "workbox-background-sync";
import { BroadcastUpdatePlugin } from "workbox-broadcast-update";


// 设置缓存名称
setCacheNameDetails({
  prefix: 'hzdevsite',
  suffix: 'v0.0.1',
  precache: 'hz-precache',
  runtime: 'hz-runtime'
});

// 更新时自动生效
//self.skipWaiting();
addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
clientsClaim();

// 预缓存文件，self.__WB_MANIFEST是workbox生成的文件地址数组，项目中打包生成的所有静态文件都会自动添加到里面
precacheAndRoute(self.__WB_MANIFEST || []);

// This assumes /index.html has been precached.
const navHandler = createHandlerBoundToURL("/index.html");
const navigationRoute = new NavigationRoute(navHandler, {
  denylist: [new RegExp("/out-of-spa/")], // Also might be specified explicitly via allowlist
});
registerRoute(navigationRoute);

// Load details immediately and check for update right after
registerRoute(
  new RegExp("https://progwebnews-app.azurewebsites.net.*content/posts/slug.*"),
  new StaleWhileRevalidate({
    cacheName: "wb6-post",
    plugins: [
      new ExpirationPlugin({
        // Only cache requests for a week
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
      new BroadcastUpdatePlugin(),
    ],
  })
);

// Keeping lists always fresh
registerRoute(
  new RegExp("https://progwebnews-app.azurewebsites.net.*content/posts.*"),
  new NetworkFirst()
);

// 本地静态资源
registerRoute(
  new RegExp('/assets/'),
  new CacheFirst({
    // Use a custom cache name
    cacheName: 'hz:assets',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 50,
      })
    ],
  })
)

// CDN图片缓存
registerRoute(
  new RegExp('^https://static\.ghost\.org/'),
  new CacheFirst({
    cacheName: 'hz:cdnimage',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 300,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ]
  }),
)

imageCache({ cacheName: "hz:images", maxEntries: 10 });

// html的缓存策略
registerRoute(
  new RegExp('/'),
  new NetworkFirst ({
    cacheName:'hz:html',
    plugins: [
      // 需要缓存的状态筛选
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      // 缓存时间（秒）
      new ExpirationPlugin({
        // 最大缓存数量
        maxEntries: 20,
        // 缓存时间12小时
        maxAgeSeconds: 12 * 60 * 60
      })
    ]
  }), 'GET')

