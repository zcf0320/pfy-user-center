import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { Map, View } from '@tarojs/components';
import utils from '@utils/index';
import { tMap } from '@utils/tMap';
import Page from '@components/page';
import { getStoreList } from '../actions/index';

import './index.scss';

interface IStoreItemProps {
  id: number;
  name: string;
  address: string;
  mobile: string;
  businessDate: string;
  distance: number;
  beginTime: string;
  endTime: string;
}
export default function StoreMaps () {
  const env = Taro.getEnv();
  const { txMapKey } = utils.appConfig;
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [markers, setMarkers] = useState([] as any);
  const [storeList, setStoreList] = useState([] as Array<IStoreItemProps>);

  useEffect(() => {
    if (env !== 'WEB') {
      Taro.getLocation({
        type: 'gcj02',
        success: function (res: any) {
          setLatitude(res.latitude);
          setLongitude(res.longitude);
          const QQMapWX = require('@utils/qqmap-wx-jssdk.min.js');
          const map = new QQMapWX({
            key: 'IZIBZ-ROGKU-6QQVU-2FUIF-DAB23-AMBIW'
          });
          map.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: function (mRes) {
              // 成功后的回调
              console.log(mRes);
              const res = mRes.result;
              const mks = [] as any;
              /**
               *  当get_poi为1时，检索当前位置或者location周边poi数据并在地图显示，可根据需求是否使用
               *
                  for (var i = 0; i < result.pois.length; i++) {
                  mks.push({ // 获取返回结果，放到mks数组中
                      title: result.pois[i].title,
                      id: result.pois[i].id,
                      latitude: result.pois[i].location.lat,
                      longitude: result.pois[i].location.lng,
                      iconPath: './resources/placeholder.png', //图标路径
                      width: 20,
                      height: 20
                  })
                  }
              *
              **/
              // 当get_poi为0时或者为不填默认值时，检索目标位置，按需使用
              mks.push({
                // 获取返回结果，放到mks数组中
                title: res.address,
                id: 0,
                latitude: res.location.lat,
                longitude: res.location.lng,

                width: 20,
                height: 20,
                callout: {
                  // 在markers上展示地址名称，根据需求是否需要
                  content: res.address,
                  color: '#000',
                  display: 'ALWAYS'
                }
              });
              setMarkers(mks);
              setLatitude(res.location.lat);
              setLongitude(res.location.lng);
            },
            fail: function (error) {
              console.error(error);
            },
            complete: function (res) {
              console.log(res);
            }
          });
          getStoreList(res.latitude, res.longitude).then(
            (res: Array<IStoreItemProps>) => {
              setStoreList(res);
            }
          );
        }
      });
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          location => {
            const lat = location.coords.latitude;
            const lng = location.coords.longitude;
            setLatitude(lat);
            setLongitude(lng);
            tMap(txMapKey).then((TMap: any) => {
              const map = new TMap.Map(document.getElementById('container'), {
                // 地图的中心地理坐标。
                center: new TMap.LatLng(lat, lng),
                zoom: 8,
                control: ''
              });
              const markerLayer = new TMap.MultiMarker({
                map: map, // 指定地图容器
                // 样式定义
                styles: {
                  // 创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
                  myStyle: new TMap.MarkerStyle({
                    width: 25, // 点标记样式宽度（像素）
                    height: 35, // 点标记样式高度（像素）
                    // src: '../img/marker.png', // 图片路径
                    // 焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
                    anchor: { x: 16, y: 32 }
                  })
                },
                // 点标记数据数组
                geometries: [
                  {
                    id: '1', // 点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
                    styleId: 'myStyle', // 指定样式id
                    position: new TMap.LatLng(lat, lng), // 点标记坐标位置
                    properties: {
                      // 自定义属性
                      title: 'marker1'
                    }
                  }
                ]
              });
              setMarkers(markerLayer);
            });

            getStoreList(lat, lng).then((res: Array<IStoreItemProps>) => {
              setStoreList(res);
            });
          },
          () => {
            Taro.showToast({ title: '该浏览器不支持获取地理位置。' });
            getStoreList(0, 0).then((res: Array<IStoreItemProps>) => {
              setStoreList(res);
            });
          }
        );
      }
    }
  }, [env, txMapKey]);
  return (
    <Page title='门店地址' showBack>
      <View className='map-list'>
        {env !== 'WEB'
          ? (
          <Map
            className='web-map'
            latitude={latitude}
            longitude={longitude}
            markers={markers}
            showCompass
            showScale
          />
            )
          : (
          <View className='web-map'>
            <View id='container'></View>
          </View>
            )}
        <View>
          {storeList &&
            storeList.length > 0 &&
            storeList.map((item: IStoreItemProps) => {
              return (
                <View className='store-list' key={item.id}>
                  <View className='store-info'>
                    <View className='name'>{item.name}</View>
                    <View className='address'>{item.address}</View>
                    <View className='mobile'>联系电话：{item.mobile}</View>
                  </View>
                  <View>
                    <View className='store-time'>
                      <View className='date'>{item.businessDate}</View>
                      <View className='time'>
                        {item.beginTime}-{item.endTime}
                      </View>
                    </View>
                    {item.distance !== -1
                      ? (
                      <View className='distance'>{item.distance}m</View>
                        )
                      : null}
                  </View>
                </View>
              );
            })}
        </View>
      </View>
    </Page>
  );
}
