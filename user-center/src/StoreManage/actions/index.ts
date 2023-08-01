import httpService from '@utils/request';

/**
 * 获取二维码
 * @param itemId
 * @param policyNo
 * @returns
 */
export function getQrCode (itemId?: string, policyNo?: string) {
  return httpService({
    url: 'qrcode/getQrCode',
    data: {
      itemId,
      policyNo
    },
    method: 'GET'
  });
}

/**
 * 重新理赔
 * @param serviceRecordId
 * @returns
 */
export function reset (serviceRecordId: string) {
  return httpService({
    url: 'qrcode/reset',
    data: {
      serviceRecordId
    },
    method: 'GET'
  });
}

/**
 * 获取状态
 * @param itemId
 * @param policyNo
 * @returns
 */
export function getStatus (itemId?: string, policyNo?: string) {
  return httpService({
    url: 'qrcode/getQrCodeStatus',
    data: {
      itemId,
      policyNo
    },
    method: 'GET'
  });
}
/**
 * 获取核销列表
 * @param itemId
 * @param policyNo
 * @returns
 */
export function getWriteOffCodeList (itemId: string, policyNo: string) {
  return httpService({
    url: 'qrcode/getCodeList',
    data: {
      itemId,
      policyNo
    },
    method: 'GET'
  });
}
export function getStoreList (lat: number, lng: number) {
  return httpService({
    url: 'offline-drugstore/listByDistance',
    data: {
      lat,
      lng
    },
    method: 'GET'
  });
}
