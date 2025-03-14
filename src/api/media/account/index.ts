import request from '@/config/axios';

// 媒体账号 VO
export interface AccountVO {
  accountId: string; // 账号ID
  media: string; // 媒体平台
  accountDesc: string; // 账户描述
  isEnable: number; // 是否启用
  clientKey: string; // Client Key
  clientSecret: string; // Client Secret
  companyName: string; // 公司名称
  employeeAccount: string; // 员工号
  refreshCountMax: number; // 最大次数
  getCodeUrl: string; // Code地址
}

// 媒体账号 API
export const AccountApi = {
  // 查询媒体账号分页
  getAccountPage: async (params: any) => {
    return await request.get({ url: `/media/account/page`, params });
  },

  // 查询媒体账号详情
  getAccount: async (id: number) => {
    return await request.get({ url: `/media/account/get?id=` + id });
  },

  // 新增媒体账号
  createAccount: async (data: AccountVO) => {
    return await request.post({ url: `/media/account/create`, data });
  },

  // 修改媒体账号
  updateAccount: async (data: AccountVO) => {
    return await request.put({ url: `/media/account/update`, data });
  },

  // 删除媒体账号
  deleteAccount: async (id: number) => {
    return await request.delete({ url: `/media/account/delete?id=` + id });
  },

  // 导出媒体账号 Excel
  exportAccount: async (params) => {
    return await request.download({ url: `/media/account/export-excel`, params });
  },

  // 查询媒体账号列表
  listAccount: async (params: any) => {
    return await request.get({ url: `/media/account/page`, params });
  },

  //获取抖音code之后重定向到以下URL
  setCode: async (data: any) => {
    return await request.put({ url: `/media/account/code`, data });
  },

  //获取Token
  getToken: async (accountId: any) => {
    return await request.get({ url: '/media/account/token/' + accountId });
  },

  //获取client ticket
  getClientTicket: async (accountId: any) => {
    return await request.get({ url: '/media/account/ticket/' + accountId });
  }
};
