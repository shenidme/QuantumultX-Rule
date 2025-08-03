// 文件名: alive_dualpost.js

addEventListener("request", (event) => {
  const request = event.request;
  
  // 仅处理 alive.cn 的 POST 请求
  if (request.url.includes("alive.cn") && request.method === "POST") {
    
    // 在脚本开头添加拦截检查
    if (request.headers["X-Duplicate-Req"] === "true") {
      event.respondWith(fetch(request)); // 放行标记请求
      return;
    }
    // 克隆原始请求
    const dualRequest = new Request(request);
    
    // 添加防循环标记 (避免二次触发)
    dualRequest.headers.set("X-Duplicate-Req", "true");
    
    // 发送克隆请求 (不等待响应)
    $task.fetch(dualRequest).then(response => {
      console.log(`[DUPLICATE] ${dualRequest.url} status: ${response.statusCode}`);
    }).catch(error => {
      console.error(`[DUPLICATE ERROR] ${error}`);
    });
  }
});
