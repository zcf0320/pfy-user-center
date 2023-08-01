import Taro from '@tarojs/taro';
import { View, Image, Picker } from '@tarojs/components';
import { useEffect, useState } from 'react';
import utils from '@utils/index';
import { getProvinceCitySite, updateServiceInfoId } from '@actions/service';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  serviceRecordId: string;
  close: () => any;
}

const ProvinceCitySite = (props: IProps) => {
  const [data, setData] = useState([] as any);
  const [cityData, setCityData] = useState([] as any);
  const [siteData, setSiteData] = useState([] as any);
  const [province, setProvince] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [city, setCity] = useState('');
  // const [cityId, setCityId] = useState('');
  const [site, setSite] = useState('');
  const [siteId, setSiteId] = useState('');
  const [serviceInfoId, setServiceInfoId] = useState('');
  useEffect(() => {
    getProvinceCitySite(props.serviceRecordId).then((res: any) => {
      setData(res);
    });
  }, [props.serviceRecordId]);
  const onProvinceChange = (e: any) => {
    if (data[e.detail.value].provinceId !== provinceId) {
      setCity('');
      // setCityId('');
      setSite('');
      setSiteData([]);
      // setSiteId('');
    }

    setProvinceId(data[e.detail.value].provinceId);
    setProvince(data[e.detail.value].provinceName);
    setCityData(data[e.detail.value].cities);
  };
  const onCityChange = (e: any) => {
    if (cityData.length) {
      // setCityId(cityData[e.detail.value].cityId);
      setCity(cityData[e.detail.value].cityName);
      setSiteData(cityData[e.detail.value].sites);
    }
  };
  const onSiteChange = (e: any) => {
    if (siteData.length) {
      setSiteId(siteData[e.detail.value].siteId);
      setSite(siteData[e.detail.value].serviceSiteName);
      setServiceInfoId(siteData[e.detail.value].serviceInfoId);
    }
  };
  const watchData = () => {
    return province && city && site;
  };
  const confirm = () => {
    if (!watchData()) {
      return;
    }
    updateServiceInfoId(serviceInfoId, props.serviceRecordId)
      .then(() => {
        props.close();
        Taro.navigateTo({
          url: `/service/appointment/newCommon/index?serviceRecordId=${props.serviceRecordId}&siteId=${siteId}`
        });
      })
      .catch(() => {});
  };
  return (
    <View className='province-city-site-modal'>
      <View className='drawer'>
        <View className='icon-close'>
          <Image className='icon' src={`${ossHost}images/gray-close.png`} onClick={props.close}></Image>
        </View>
        <View className='modal-content'>
          <View className='header'>
            <View className='title'>请选择您需要预约的城市</View>
          </View>
          <View className='content'>
            <Picker
              mode='selector'
              range={data}
              rangeKey='provinceName'
              onChange={e => onProvinceChange(e)}
            >
              <View className='select-item'>
                <View className={province ? 'value' : 'placeholder'}>
                  {province || '请选择省（市）'}
                </View>
                <Image className='right-icon' src={`${ossHost}images/black-arrow-down.png`}></Image>
              </View>
            </Picker>
            <Picker
              mode='selector'
              range={cityData}
              rangeKey='cityName'
              onChange={e => onCityChange(e)}
            >
              <View className='select-item'>
                <View className={province ? 'value' : 'placeholder'}>
                  {city || '请选择市（区）'}
                </View>
                <Image className='right-icon' src={`${ossHost}images/black-arrow-down.png`}></Image>
              </View>
            </Picker>
            <Picker
              mode='selector'
              range={siteData}
              rangeKey='serviceSiteName'
              onChange={e => onSiteChange(e)}
            >
              <View className='select-item'>
                <View className={province ? 'value' : 'placeholder'}>
                  {site || '请选择网点'}
                </View>
                <Image className='right-icon' src={`${ossHost}images/black-arrow-down.png`}></Image>
              </View>
            </Picker>
          </View>
          <View
            className={`btn-confirm ${watchData() ? '' : 'disabled'}`}
            onClick={() => {
              confirm();
            }}
          >
            确认
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProvinceCitySite;
