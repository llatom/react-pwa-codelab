#Service Worker更新

------
Workbox 是 Google Chrome 团队推出的一套 PWA 的解决方案，这套解决方案当中包含了核心库和构建工具，利用 Workbox 可以实现 Service Worker 的快速开发。配置完成后，需要注意SW的更新和离线状态，SW的更新较为复杂，如果处理不当回引发各种问题。
#### 以下为两种方案的处理思路：

***方案一***：
在注册 SW 的地方可以通过监听 controllerchange 事件来得知控制当前页面的 SW 是否发生了变化，当发现控制当前页面的 SW 已经发生了变化，那就刷新当前页面，让页面从头到尾都被新的 SW 控制，就一定能保证数据的一致性。
大致的流程是：

>     1.刷新不能使得 SW 发生更新，即老的 SW 不会退出，新的 SW 也不会激活。

>     2.这个方法是通过 skipWaiting 迫使 SW 新老交替。在交替完成后，通过 controllerchange 监听到变化再执行刷新。

 >     3.方案一的弊端在于SW文件的变更刷新一般在页面加载后的几秒内，用户在浏览内容时遇到莫名的刷新，体验不佳。
 
***方案二***：
在方案一的思路上做一些改进，毫无征兆的刷新页面的确不可接受，所以可以再改进一下，给用户一个提示，让用户来点击后更新SW
大致流程如下：
>     1.浏览器检测到存在新的（不同的）SW 时，安装并让它等待，同时触发 updatefound 事件

>     2.监听事件，弹出一个提示条，询问用户是不是要更新 SW

>     3.如果用户确认，则向处在等待的 SW 发送消息，要求其执行 skipWaiting 并取得控制权

>     4.因为 SW 的变化触发 controllerchange 事件，我们在这个事件的回调中刷新页面即可

### 代码实现

```javascript
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
```
