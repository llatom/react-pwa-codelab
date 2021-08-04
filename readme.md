###  service worker更新的处理

------

Workbox 是 Google Chrome 团队推出的一套 PWA 的解决方案，这套解决方案当中包含了核心库和构建工具，利用 Workbox 可以实现 Service Worker 的快速开发。配置完成后，需要注意SW的更新和离线状态，SW的更新较为复杂，如果处理不当回引发各种问题。
#### 以下为两种方案的处理思路：

***方案一***：
在注册 sw 的地方可以通过监听 controllerchange 事件来得知控制当前页面的 sw 是否发生了变化，当发现控制当前页面的 sw 生命周期改变，刷新当前页面，让页面从头到尾都被新的 sw 控制，保证数据的一致性。
大致的流程是：

1. 单纯的刷新不会导致 sw 发生更新，不过可以监听load事件来完成新sw的注册，使其处于waiting状态

2. 监听controllerchange 变化，执行reload()方法，通过skipWaiting迫使sw完成新老交替

3. 方案一的弊端在于监听sw状态变更的刷新一般在页面加载后的几秒内，用户在浏览内容时遇到莫名的刷新，体验不佳

   

***方案二***：
在方案一的思路上做一些改进，毫无征兆的刷新页面的确不可接受，所以可以再改进一下，给用户一个提示，让用户来点击后更新sw
大致流程如下：

1. 浏览器检测到存在新的（不同的）sw 时，立刻安装并让其处于等待状态
2. 监听waiting状态，展示更新提示，询问用户是否更新 
3. 如果用户确认，则向处于waiting状态的 sw 发送消息，要求其执行 skipWaiting 并取得控制权
4. 因为 sw 的变化触发 controllerchange 事件，我们在这个事件的回调中刷新页面即可



### 代码实现

```js
//index.js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const wb = new Workbox("/service-worker.js");
    const updateButton = document.querySelector("#app-update");
    //server worker 已经安装待激活
    wb.addEventListener("waiting", event => {
      updateButton.classList.add("show");
      updateButton.addEventListener("click", () => {
        //设置侦听，在等待状态的service worker 控制页面后立即重新加载页面
        wb.addEventListener("controlling", event => {
          window.location.reload();
        });
        wb.messageSW({ type: "SKIP_WAITING" });
      });
    });

    wb.register();
  });
}

//service-worker.js
addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
```
