import { ACCOUNT_APPEAL_UPDATE } from '@constants/user';

// 账号申诉信息
export default {
  setAccountAppeal (payload: any) {
    return {
      type: ACCOUNT_APPEAL_UPDATE,
      payload
    };
  }
};
