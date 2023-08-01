
import { useState } from 'react';
import { View, Image, Text, Input } from '@tarojs/components';
import utils from '@utils/index';
import ClaimsSearch from '@components/ClaimsSearch';
import './index.scss';

const { ossHost } = utils.appConfig;

interface IProps {
  data: any;
  changeCheck: Function;
  onDeleteItem?: Function;
  changeData?: Function;
  onSetModal?: Function;
  onSetList?: Function;
  index: number;
  serviceRecordId?: string;
  codeList?: Array<any>;
}

function Detail (props: IProps) {
  const { data, index: MIndex, codeList } = props;
  const [isSearch, setSearch] = useState(false);
  const [showNumber, setShowNumber] = useState(0);
  const closeSearch = () => {
    setSearch(false);
  };
  const getName = (name:string) => {
    data.name = name.split(' - ')[0];
    data.specifications = name.split(' - ')[1];
    props.onSetList && props.onSetList(showNumber === 3 ? 1 : 2, props.index, {
      name: name.split(' - ')[0],
      specifications: name.split(' - ')[1]
    });
    closeSearch();
  };

  return (
    <View className='claims-step2'>
      {data && data.isChecked === '药品' && (
        <View>
          {codeList &&
            codeList.length &&
            codeList.map(item => {
              return (
                <View key={item.code + Math.random().toString()}>
                  {item.code === 'JLjhsq'
                    ? (
                    <View className='claims-step2-top-box'>
                      <View className='claims-step2-top-left flex'>
                        <Text>药品名称</Text>
                        {item.required ? <View className='must'></View> : null}
                      </View>
                      {!data.name && (
                        <View
                          className='claims-step2-search'
                          onClick={() => {
                            setShowNumber(3);
                            setSearch(true);
                          }}
                        >
                          请搜索
                          <Image
                            src={`${ossHost}claims_arrow.png`}
                            className='claims-step2-top-img'
                          />
                        </View>
                      )}
                      {data.name && (
                        <View
                          className='claims-step2-name claims-step2-drug'
                          onClick={() => {
                            setShowNumber(3);
                            setSearch(true);
                          }}
                        >
                          {data.name}
                        </View>
                      )}
                    </View>
                      )
                    : null}
                  {
                    item.code === 'YtqHGq'
                      ? (
                    <View className='claims-step2-top-box'>
                      <View className='claims-step2-top-left flex'>
                        <Text>药品规格</Text>
                        {item.required ? <View className='must'></View> : null}
                      </View>
                      <Text
                        className='claims-step2-input'

                        //   type="text"
                        //   maxlength={10}
                        //   placeholderClass="claims-step2-place"
                        //   placeholder="请输入药品规格"
                        //   value={data.specifications}
                        //   onInput={e => {
                        //     data.specifications = e.detail.value;
                        //   }}
                      >
                        {data.specifications || '-'}
                      </Text>
                    </View>
                        )
                      : null}
                  {item.code === 'NYbshu'
                    ? (
                    <View className='claims-step2-top-box'>
                      <View className='claims-step2-top-left flex'>
                        <Text>药品单价(元)</Text>
                        {item.required ? <View className='must'></View> : null}
                      </View>
                      <Input
                        className='claims-step2-input price'
                        type='digit'
                        maxlength={10}
                        placeholderClass='claims-step2-place'
                        placeholder='请输入药品单价(元)'
                        value={data.unitPrice}
                        onInput={e => {
                          props.onSetList && props.onSetList(1, props.index, {
                            unitPrice: e.detail.value
                          });
                          data.unitPrice = e.detail.value;
                        }}
                      />
                    </View>
                      )
                    : null}
                  {item.code === 'HgsfKJ'
                    ? (
                    <View className='claims-step2-top-box'>
                      <View className='claims-step2-top-left flex'>
                        <Text>药品数量</Text>
                        {item.required ? <View className='must'></View> : null}
                      </View>
                      <Input
                        className='claims-step2-input'
                        type='number'
                        maxlength={10}
                        placeholderClass='claims-step2-place'
                        placeholder='请输入药品数量'
                        value={data.num}
                        onInput={e => {
                          props.onSetList && props.onSetList(1, props.index, {
                            num: e.detail.value
                          });
                          data.num = e.detail.value;
                        }}
                      />
                    </View>
                      )
                    : null}
                </View>
              );
            })}
        </View>
      )}
      {data && data.isChecked === '检验/检查' && (
        <View>
          {codeList &&
            codeList.length &&
            codeList.map(item => {
              return (
                <View key={item.code + Math.random().toString()}>
                  {
                    item.code === 'HMNbas'
                      ? (
                    <View
                      className='claims-step2-top-box'
                      onClick={() => {
                        setShowNumber(4);
                        setSearch(true);
                      }}
                    >
                      <View className='claims-step2-top-left flex'>
                        <Text>项目名称</Text>
                        {item.required ? <View className='must'></View> : null}
                      </View>
                      <View
                        className={`claims-step2-input  claims-step2-drug ${
                          data.name ? '' : 'placeholder'
                        }`}
                        //   type="text"
                        //   maxlength={15}
                        //   placeholder="请输入项目名称"
                        //   placeholderClass="claims-step2-place"
                        //   value={data.name}
                        //   onInput={e => {
                        //     data.name = e.detail.value;
                        //   }}
                      >
                        {data.name || '请搜索'}
                      </View>
                      <Image
                        src={`${ossHost}claims_arrow.png`}
                        className='claims-step2-top-img'
                      />
                    </View>
                        )
                      : null}
                  {item.code === 'JksQWs'
                    ? (
                    <View className='claims-step2-top-box'>
                      <View className='claims-step2-top-left flex'>
                        <Text>项目单价(元)</Text>
                        {item.required ? <View className='must'></View> : null}
                      </View>
                      <Input
                        className='claims-step2-input price'
                        type='digit'
                        maxlength={10}
                        placeholder='请输入项目单价(元)'
                        placeholderClass='claims-step2-place'
                        value={data.unitPrice}
                        onInput={e => {
                          props.onSetList && props.onSetList(2, props.index, {
                            unitPrice: e.detail.value
                          });
                          data.unitPrice = e.detail.value;
                        }}
                      />
                    </View>
                      )
                    : null}
                  {item.code === 'JUIliw'
                    ? (
                    <View className='claims-step2-top-box'>
                      <View className='claims-step2-top-left flex'>
                        <Text>项目数量</Text>
                        {item.required ? <View className='must'></View> : null}
                      </View>
                      <Input
                        className='claims-step2-input'
                        type='number'
                        maxlength={10}
                        placeholder='请输入项目数量'
                        placeholderClass='claims-step2-place'
                        value={data.num}
                        onInput={e => {
                          props.onSetList && props.onSetList(2, props.index, {
                            num: e.detail.value
                          });
                          data.num = e.detail.value;
                        }}
                      />
                    </View>
                      )
                    : null}
                </View>
              );
            })}
        </View>
      )}
      {MIndex !== 0 && (
        <View
          className='claims-step2-delete'
          onClick={() => {
            props.onSetModal && props.onSetModal({
              show: true,
              content: '确认删除',
              cancelText: '确认',
              confirmText: '取消',
              clickCancel: () => {
                props.onDeleteItem && props.onDeleteItem(data.key);
              }
            });
          }}
        >
          删除
        </View>
      )}
      {isSearch && (
        <ClaimsSearch
          title=''
          showNumber={showNumber}
          serviceRecordId={props.serviceRecordId || ''}
          close={() => {
            closeSearch();
          }}
          confirm={(name) => {
            getName(name);
          }}
        ></ClaimsSearch>
      )}
    </View>
  );
}
export default Detail;
