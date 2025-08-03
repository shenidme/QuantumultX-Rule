// alive_dualpost.js

// 只拦截 script-request-body 或 script-request-header，需在配置里指定：
/*
[rewrite_local]
^https?:\/\/alive\.cn\/.*$ script-request-body alive_dualpost.js
*/

addEventListener("fetch", event => {
  const req = event.request;
  // 只处理 alives.cn 的 POST
  if (req.url.includes("alives.cn") && req.method === "POST") {
    // 已标记过的，直接放行
    if (req.headers.get("X-Duplicate-Req") === "true") {
      return event.respondWith(fetch(req));
    }
    
    // 克隆请求
    const dualReq = req.clone();
    // 添加循环标记
    const newHeaders = new Headers(dualReq.headers);
    newHeaders.set("X-Duplicate-Req", "true");
    
    // 构造原始参数对象给 $task.fetch
    $task.fetch({
      url: dualReq.url,
      method: dualReq.method,
      headers: Object.fromEntries(newHeaders),
      body: dualReq.body
    }).then(resp => {
      console.log(`[DUPLICATE] ${dualReq.url} status: ${resp.status}`);
    }).catch(err => {
      console.error(`[DUPLICATE ERROR] ${err}`);
    });
    
    // 原始请求照常放行
    return event.respondWith(fetch(req));
  } else {
    // 非目标请求，直接放行
    return event.respondWith(fetch(req));
  }
});



