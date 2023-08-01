import Taro, { getCurrentInstance } from '@tarojs/taro';
import Page from '@components/page';
import { View, Image } from '@tarojs/components';
import { useState, useEffect } from 'react';
import { getClaimsInfo } from '@api/claims';
import './index.scss';

export default function MaterialInfo () {
  const [status, setStatus] = useState(0);
  const { router } = getCurrentInstance();
  const claimRecordId = (router?.params && router.params.claimRecordId) || '';
  const [claimInfo, setClaimInfo] = useState({
    userBaseInfoVO: {} as any,
    hospitalTreatmentInfoVO: {} as any,
    materialVOS: [],
    settlementClassifyVO: {} as any
  });
  useEffect(() => {
    if (claimRecordId) {
      getClaimsInfo(claimRecordId)
        .then((res: any) => {
          setClaimInfo(res);
        })
        .catch(() => {});
    }
  }, [claimRecordId]);
  return (
    <Page showBack title='查看理赔材料'>
      <View className='material-info'>
        <View className='page-title flex'>
          <View
            className={`tab-item ${status === 0 ? 'active' : ''}`}
            onClick={() => setStatus(0)}
          >
            理赔资料
          </View>
          <View
            className={`tab-item ${status === 1 ? 'active' : ''}`}
            onClick={() => setStatus(1)}
          >
            图片资料
          </View>
        </View>
        {status === 0
          ? (
          <View className='base-info'>
            <View className='card'>
              <View className='card-title'>基本信息</View>
              <View className='card-item'>
                <View className='left'>被保险人</View>
                <View className='right'>
                  {claimInfo.userBaseInfoVO.insuredName}
                </View>
              </View>
              <View className='card-item'>
                <View className='left'>身份证号</View>
                <View className='right'>
                  {claimInfo.userBaseInfoVO.insuredIdCard}
                </View>
              </View>
              <View className='card-item'>
                <View className='left'>手机号码</View>
                <View className='right'>
                  {claimInfo.userBaseInfoVO.insuredMobile}
                </View>
              </View>
              <View className='card-item'>
                <View className='left'>邮箱</View>
                <View className='right'>
                  {claimInfo.userBaseInfoVO.insuredEmail || '-'}
                </View>
              </View>
            </View>
            {claimInfo.hospitalTreatmentInfoVO && Object.keys(claimInfo.hospitalTreatmentInfoVO).length
              ? (
              <View className='card'>
                <View className='card-title'>诊疗信息</View>
                {claimInfo.hospitalTreatmentInfoVO.patientName
                  ? (
                  <View className='card-item'>
                    <View className='left'>就诊人姓名</View>
                    <View className='right'>
                      {claimInfo.hospitalTreatmentInfoVO.patientName}
                    </View>
                  </View>
                    )
                  : null}
                {claimInfo.hospitalTreatmentInfoVO.treatmentTime
                  ? (
                  <View className='card-item'>
                    <View className='left'>就诊时间</View>
                    <View className='right'>
                      {claimInfo.hospitalTreatmentInfoVO.treatmentTime || '-'}
                    </View>
                  </View>
                    )
                  : null}
                {claimInfo.hospitalTreatmentInfoVO.treatmentHospital
                  ? (
                  <View className='card-item'>
                    <View className='left'>就诊医院</View>
                    <View className='right'>
                      {claimInfo.hospitalTreatmentInfoVO.treatmentHospital ||
                        '-'}
                    </View>
                  </View>
                    )
                  : null}
                {claimInfo.hospitalTreatmentInfoVO.treatmentDepartment
                  ? (
                  <View className='card-item'>
                    <View className='left'>就诊科室</View>
                    <View className='right'>
                      {claimInfo.hospitalTreatmentInfoVO.treatmentDepartment ||
                        '-'}
                    </View>
                  </View>
                    )
                  : null}
                {claimInfo.hospitalTreatmentInfoVO.diseaseNameList &&
                claimInfo.hospitalTreatmentInfoVO.diseaseNameList.length
                  ? (
                  <View className='card-item-wrap'>
                    <View className='left'>确诊疾病</View>
                    <View className='disease-list'>
                      {claimInfo.hospitalTreatmentInfoVO.diseaseNameList.map(
                        item => {
                          return (
                            <View className='disease-item' key={item}>
                              <View className='name'>{item}</View>
                            </View>
                          );
                        }
                      )}
                    </View>
                  </View>
                    )
                  : null}
                  {claimInfo.hospitalTreatmentInfoVO.drugAllergy &&
                    claimInfo.hospitalTreatmentInfoVO.drugAllergy.length
                    ? (
                      <View className='card-item-wrap'>
                        <View className='left'>过敏药</View>
                        <View className='disease-list'>
                          {claimInfo.hospitalTreatmentInfoVO.drugAllergy.map(
                            item => {
                              return (
                                <View className='disease-item' key={item}>
                                  <View className='name'>{item}</View>
                                </View>
                              );
                            }
                          )}
                        </View>
                      </View>
                      )
                    : null}
                      {claimInfo.hospitalTreatmentInfoVO.medicines &&
                        claimInfo.hospitalTreatmentInfoVO.medicines.length
                        ? (
                          <View className='card-item-wrap'>
                            <View className='left'>曾用药</View>
                            <View className='disease-list'>
                              {claimInfo.hospitalTreatmentInfoVO.medicines.map(
                                item => {
                                  return (
                                    <View className='disease-item' key={item}>
                                      <View className='name'>{item}</View>
                                    </View>
                                  );
                                }
                              )}
                            </View>
                          </View>
                          )
                        : null}
                {
                claimInfo.hospitalTreatmentInfoVO.userPaid
                  ? (
                  <View className='card-item'>
                    <View className='left'>自费金额</View>
                    <View className='right'>
                      {claimInfo.hospitalTreatmentInfoVO.userPaid || '-'}
                    </View>
                  </View>
                    )
                  : null}
              </View>
                )
              : null}

            {claimInfo.settlementClassifyVO &&
              claimInfo.settlementClassifyVO.drugsList &&
              claimInfo.settlementClassifyVO.drugsList.length > 0 && (
                <View className='card'>
                  <View
                    className={`card-title ${
                      claimInfo.settlementClassifyVO.drugsList.length > 1
                        ? 'flex-bt'
                        : ''
                    }`}
                  >
                    处方单药品
                    {claimInfo.settlementClassifyVO.drugsList.length > 1 && (
                      <View
                        className='more'
                        onClick={() => {
                          Taro.navigateTo({
                            url: `/ClaimsSettle/pages/MoreInfo/index?claimRecordId=${router?.params &&
                              router.params.claimRecordId}&type=1`
                          });
                        }}
                      >
                        查看更多
                      </View>
                    )}
                  </View>
                  <View className='card-item'>
                    <View className='left'>药品名称</View>
                    <View className='right'>
                      {claimInfo.settlementClassifyVO.drugsList[0].name || '-'}
                    </View>
                  </View>
                  <View className='card-item'>
                    <View className='left'>药品规格</View>
                    <View className='right'>
                      {claimInfo.settlementClassifyVO.drugsList[0]
                        .specifications || '-'}
                    </View>
                  </View>
                  <View className='card-item'>
                    <View className='left'>药品单价(元)</View>
                    <View className='right'>
                      {claimInfo.settlementClassifyVO.drugsList[0].unitPrice ||
                        '-'}
                    </View>
                  </View>
                  <View className='card-item'>
                    <View className='left'>药品数量</View>
                    <View className='right'>
                      {claimInfo.settlementClassifyVO.drugsList[0].num || '-'}
                    </View>
                  </View>
                </View>
            )}
            {claimInfo.settlementClassifyVO &&
              claimInfo.settlementClassifyVO.checkList &&
              claimInfo.settlementClassifyVO.checkList.length > 0 && (
                <View className='card'>
                  <View
                    className={`card-title ${
                      claimInfo.settlementClassifyVO.checkList.length > 1
                        ? 'flex-bt'
                        : ''
                    }`}
                  >
                    检验检查单
                    {claimInfo.settlementClassifyVO.checkList.length > 1 && (
                      <View
                        className='more'
                        onClick={() => {
                          Taro.navigateTo({
                            url: `/ClaimsSettle/pages/MoreInfo/index?claimRecordId=${router?.params &&
                              router.params.claimRecordId}&type=2`
                          });
                        }}
                      >
                        查看更多
                      </View>
                    )}
                  </View>
                  <View className='card-item'>
                    <View className='left'>项目名称</View>
                    <View className='right'>
                      {claimInfo.settlementClassifyVO.checkList[0].checkName || '-'}
                    </View>
                  </View>
                  <View className='card-item'>
                    <View className='left'>药品单价(元)</View>
                    <View className='right'>
                      {claimInfo.settlementClassifyVO.checkList[0].checkUnitPrice ||
                        '-'}
                    </View>
                  </View>
                  <View className='card-item'>
                    <View className='left'>药品数量</View>
                    <View className='right'>
                      {claimInfo.settlementClassifyVO.checkList[0].checkNum || '-'}
                    </View>
                  </View>
                </View>
            )}
          </View>
            )
          : (
          <View className='base-info'>
            <View className='card pb-64'>
              <View className='card-title'>图片材料</View>
              {claimInfo.materialVOS &&
                claimInfo.materialVOS.length > 0 &&
                claimInfo.materialVOS.map((item: any) => {
                  return (
                    <View key={item.materialId}>
                      <View className='material-name'>{item.materialName}</View>
                      <View className='img-list'>
                        {item.files &&
                          item.files.length &&
                          item.files.map(item => {
                            return (
                              <Image
                                key={item}
                                className='img'
                                src={item}
                                onClick={() => {
                                  Taro.previewImage({
                                    urls: [item]
                                  });
                                }}
                              ></Image>
                            );
                          })}
                      </View>
                    </View>
                  );
                })}
            </View>
          </View>
            )}
      </View>
    </Page>
  );
}
