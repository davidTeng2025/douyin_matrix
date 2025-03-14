// 引入依赖的SDK（在Vue项目中不推荐直接在HTML中写<script>标签）。
// Vue CLI配置文件也可以直接使用 dynamic import (import xxx from "xxx URL")。

export function createDyOpenSchema(options) {
  const dyOpenUtil = (window as any).dy_open_util as {
    serialize: (input: any) => string;
    [key: string]: any;
  };

  if (!dyOpenUtil || typeof dyOpenUtil.serialize !== 'function') {
    throw new Error("dy_open_util SDK未加载或不存在，请检查Script加载。");
  }
  console.log('options from server', options);
  const schema = dyOpenUtil.serialize({
    share_type: "h5",
    client_key: options.client_key || '', // 应用key
    nonce_str: options.nonce_str || '', // 随机字符串
    timestamp: options.timestamp || String(Math.floor(Date.now() / 1000)), // 时间戳
    signature: options.signature || '', // 验签签名
    video_path: options.video_path || '', // 视频路径
    image_path: options.video_path || '', // 封面图片路径
    share_to_publish: options.share_to_publish !== undefined ? options.share_to_publish : 0, // 默认为0
    state: options.state
    // hashtag_list: JSON.stringify(options.hashtag_list || []), // 话题列表
    //   micro_app_info: options.micro_app_info
    //     ? JSON.stringify({
    //         appId: options.micro_app_info.appId || '',
    //         appTitle: options.micro_app_info.appTitle || '',
    //         description: options.micro_app_info.description || '',
    //         appUrl: options.micro_app_info.appUrl || '',
    //       })
    //     : undefined,
    });
    console.log('serialized schema data', schema);
    return schema;
  }