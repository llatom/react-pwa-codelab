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


// 设置缓存名称
setCacheNameDetails({
  prefix: 'hzdevsite',
  suffix: 'v0.0.1',
  precache: 'hz-precache',
  runtime: 'hz-runtime'
});

// 更新时自动生效
addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

//要求控制尽快启动运行时缓存
clientsClaim();

// 预缓存文件，self.__WB_MANIFEST是workbox生成的文件地址数组，项目中打包生成的所有静态文件都会自动添加到里面
precacheAndRoute(self.__WB_MANIFEST || []);

// 设定/index.html precached
const navHandler = createHandlerBoundToURL("/index.html");
const navigationRoute = new NavigationRoute(navHandler, {
  denylist: [new RegExp("/posts/")], // Also might be specified explicitly via allowlist
});
registerRoute(navigationRoute);

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
  new StaleWhileRevalidate({
    cacheName: 'hz:cdnimage',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 300,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ],
    // 添加如下fetch options
    fetchOptions: {
      mode: 'cors',
      credentials: 'omit',
    },
  }),
)

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

