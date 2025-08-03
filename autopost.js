// alive_dualpost.js

// 只拦截 script-request-body 或 script-request-header，需在配置里指定：
/*
[rewrite_local]
^https?:\/\/alive\.cn\/.*$ script-request-body alive_dualpost.js
*/

// addEventListener("fetch", event => {
//   const req = event.request;
//   // 只处理 alives.cn 的 POST
//   if (/https?:\/\/.*\\.alives\\.cn/.test(req.url) && req.method === "POST") {
//     // 已标记过的，直接放行
//     if (req.headers.get("X-Duplicate-Req") === "true") {
//       return event.respondWith(fetch(req));
//     }
    
//     // 克隆请求
//     const dualReq = req.clone();
//     // 添加循环标记
//     const newHeaders = new Headers(dualReq.headers);
//     newHeaders.set("X-Duplicate-Req", "true");
    
//     // 构造原始参数对象给 $task.fetch
//     $task.fetch({
//       url: dualReq.url,
//       method: dualReq.method,
//       headers: Object.fromEntries(newHeaders),
//       body: dualReq.body
//     }).then(resp => {
//       console.log(`[DUPLICATE] ${dualReq.url} status: ${resp.status}`);
//     }).catch(err => {
//       console.error(`[DUPLICATE ERROR] ${err}`);
//     });
    
//     // 原始请求照常放行
//     return event.respondWith(fetch(req));
//   } else {
//     // 非目标请求，直接放行
//     return event.respondWith(fetch(req));
//   }
// });

addEventListener("fetch", event => {
  const req = event.request;
  
  // 只处理 alives.cn 的 POST
  if (/https?:\/\/.*\.alives\.cn/.test(req.url) && req.method === "POST") {
    
    // 先检查循环标记 - 必须放在最前面
    if (req.headers.get("X-Duplicate-Req") === "true") {
      return event.respondWith(fetch(req)); // 已标记的请求直接放行
    }
    
    // 克隆原始请求
    const originalReq = req.clone();
    
    // 创建复制请求（添加标记）
    const dualHeaders = new Headers(req.headers);
    dualHeaders.set("X-Duplicate-Req", "true");
    
    // 发送复制请求（使用圈X的 $task.fetch）
    event.waitUntil((async () => {
      try {
        // 正确传递 Headers 对象
        const resp = await $task.fetch({
          url: req.url,
          method: req.method,
          headers: dualHeaders, // 直接使用 Headers 对象
          body: await req.arrayBuffer() // 确保 body 可重复使用
        });
        console.log(`[DUPLICATE] ${req.url} status: ${resp.statusCode}`);
      } catch (err) {
        console.error(`[DUPLICATE ERROR] ${err}`);
      }
    })());
    
    // 继续处理原始请求
    return event.respondWith(fetch(originalReq));
  }
  
  // 非目标请求直接放行
  return event.respondWith(fetch(req));
});




