import { NavigationRoute, registerRoute } from 'workbox-routing';
import { CacheFirst,NetworkFirst, NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies';
import {createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { setCacheNameDetails, skipWaiting, clientsClaim } from 'workbox-core';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';
import {ExpirationPlugin} from 'workbox-expiration';

// 设置缓存名称
setCacheNameDetails({
  prefix: 'hzdevsite',
  suffix: 'v0.0.1',
  precache: 'precache',
  runtime: 'runtime'
});

// 更新时自动生效
skipWaiting();
clientsClaim();

// 预缓存文件，self.__WB_MANIFEST是workbox生成的文件地址数组，项目中打包生成的所有静态文件都会自动添加到里面
precacheAndRoute(self.__WB_MANIFEST || []);

// 引入预缓存列表（precacheManifest 是workbox自动生成的）
precacheAndRoute(
  self.__precacheManifest || [], {
    ignoreUrlParametersMatching: [/./],
    cleanUrls: false,
  }
);

// 本地静态资源
registerRoute(
  new RegExp('/static/media/'),
  new CacheFirst({
    // Use a custom cache name
    cacheName: 'hz:static',
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


registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'hz:image',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  })
);

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


// api 接口的缓存策略
registerRoute(
  new RegExp('https://api.jisuapi.com/.*'),
  new NetworkFirst({
    cacheName:'hz:apifetch',
    plugins: [
      // 需要缓存的状态筛选
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      // 缓存时间
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 12 * 60 * 60
      })
    ]
  }), 'GET')

