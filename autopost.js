// alive_dualpost.js

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


//deepseek
// addEventListener("fetch", event => {
//   const req = event.request;
  
//   // 只处理 alives.cn 的 POST
//   if (/https?:\/\/.*\.alives\.cn/.test(req.url) && req.method === "POST") {
    
//     // 先检查循环标记 - 必须放在最前面
//     if (req.headers.get("X-Duplicate-Req") === "true") {
//       return event.respondWith(fetch(req)); // 已标记的请求直接放行
//     }
    
//     // 克隆原始请求
//     const originalReq = req.clone();
    
//     // 创建复制请求（添加标记）
//     const dualHeaders = new Headers(req.headers);
//     dualHeaders.set("X-Duplicate-Req", "true");
    
//     // 发送复制请求（使用圈X的 $task.fetch）
//     event.waitUntil((async () => {
//       try {
//         // 正确传递 Headers 对象
//         const resp = await $task.fetch({
//           url: req.url,
//           method: req.method,
//           headers: dualHeaders, // 直接使用 Headers 对象
//           body: await req.arrayBuffer() // 确保 body 可重复使用
//         });
//         console.log(`[DUPLICATE] ${req.url} status: ${resp.statusCode}`);
//       } catch (err) {
//         console.error(`[DUPLICATE ERROR] ${err}`);
//       }
//     })());
    
//     // 继续处理原始请求
//     return event.respondWith(fetch(originalReq));
//   }
  
//   // 非目标请求直接放行
//   return event.respondWith(fetch(req));
// });

const req = $request
console.log("请求方法:", req.method);

if (req.method === "POST") {
    console.log("开始尝试抓包并修改请求");
    console.log("请求方法:", req.method);
    console.log("请求URL:", req.url);
    // 随机昵称生成器
    const nicknames = [
      "星语者", "云端漫步", "量子诗人", "时光旅人", "星河绘师",
      "幻夜歌者", "森林守护", "晨曦微光", "暗夜骑士", "碧海听涛",
      "风语旅人", "月影舞者", "雪域行者", "沙漠孤鹰", "草原牧歌",
      "极光追梦", "深海潜航", "山岳攀登", "星空守望", "雨林探险",
      "墨香书客", "琴韵悠扬", "棋局掌控", "画布人生", "诗酒年华",
      "代码诗人", "算法舞者", "数据猎人", "比特旅人", "像素艺术家",
      "咖啡品鉴", "茶道行者", "美食猎人", "甜品大师", "香料魔法",
      "梦境编织", "幻象大师", "谜题解密", "预言学者", "时空观测",
      "元素掌控", "自然共鸣", "星辰召唤", "暗影穿梭", "光明使者",
      "机械之心", "蒸汽朋克", "赛博旅人", "数字幽灵", "虚拟歌姬"
    ];
    var body = req.body;
    
    var obj = JSON.parse(body);
    console.log("请求体:", body);
    const randomIndex = Math.floor(Math.random() * nicknames.length);
    const newName = nicknames[randomIndex];
    if(!obj.name){
        console.log("请求体中无变量name");
        $done();
    }
    obj.name = newName;
    f(!obj.name){
        console.log("请求体中无变量user");
        $done();
    }
    obj.user.objectId = '66123fac91cabd6bffab333e';
    // obj['name'] = newName;
    // obj['user']['objectId'] = '66123fac91cabd6bffab333e';
    const newBody = JSON.stringify(obj);
    
    console.log(newBody);
    
    $done(newBody);
} else {
    console.log("非POST请求，跳过");
    $done();
}


















