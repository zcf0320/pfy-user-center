import { useState, useEffect, useCallback } from 'react';
import { View, Image, Input } from '@tarojs/components';
import SearchResult from '@components/searchResult';
import {
  searchDepartment,
  searchHospital,
  searchDrug,
  searchProgram
} from '@actions/common';
import utils from '@utils/index';
import './index.scss';

const { ossHost } = utils.appConfig;
interface IProps {
  title: string;
  close: () => any;
  confirm: any;
  showNumber: number;
  serviceRecordId?: string;
  drug: boolean;
}

const ClaimsSearch = (props: IProps) => {
  const [text] = useState('');
  const [value, setValue] = useState('');
  const [resultList, setResultList] = useState([]);

  const search = useCallback(() => {
    const callBack = res => {
      res.forEach(item => {
        const reg = new RegExp(value, 'g'); // 定义正则
        props.drug && (item.name = item.name.split(' - ')[0]);
        item.oldName = item.name;
        item.name = item.name.replace(
          reg,
          `<div class="keyword">${value}</div>`
        ); // 进行替换，并定义高亮的样式
        props.showNumber === 3 &&
          (item.name =
            `<div class=" flex recommend recommend-${item.recommend ? 1 : 0}">${
              item.recommend ? '权益药品' : '非权益药品'
            }</div>` + `${item.name}`);
      });
      setResultList(res);
    };
    if (value) {
      if (props.showNumber === 1) {
        // 就诊医院
        searchHospital({
          searchKey: value
        }).then(res => {
          // 匹配关键字高亮
          callBack(res);
        });
      } else if (props.showNumber === 2) {
        // 就诊科室
        searchDepartment({
          searchKey: value
        }).then(res => {
          // 匹配关键字高亮
          callBack(res);
        });
      } else if (props.showNumber === 3) {
        // 药品
        const data: any = {
          searchKey: value
        };
        props.serviceRecordId && (data.serviceRecordId = props.serviceRecordId);
        searchDrug(data).then(res => {
          // 匹配关键字高亮
          callBack(res);
        });
      } else if (props.showNumber === 4) {
        // 药品
        searchProgram({
          searchKey: value
        }).then(res => {
          // 匹配关键字高亮
          callBack(res);
        });
      }
    }
  }, [props.drug, props.serviceRecordId, props.showNumber, value]);
  useEffect(() => {
    search();
  }, [search, value]);

  return (
    <View className='drawer-overlay'>
      <View className='search'>
        <View className='search-header flex'>
          <View className='search-content flex'>
            <View className='left flex'>
              {!value && (
                <Image src={`${ossHost}images/search-icon.png`} className='search-icon'></Image>
              )}
              <Input
                adjustPosition={false}
                onInput={e => {
                  setValue(e.detail.value);
                }}
                className='claims-search-input'
                value={value}
              />
            </View>

            <View
              className='search-text'
              onClick={() => {
                search();
              }}
            >
              搜索
            </View>
          </View>
          <Image
            src={`${ossHost}images/icon_close.png`}
            className='claims-close'
            onClick={() => {
              props.close();
            }}
          ></Image>
        </View>
        <View className='content'>
          <SearchResult
            resultList={resultList}
            text={text}
            callback={(item: any) => {
              props.confirm(item.oldName);
              setValue('');
              setResultList([]);
            }}
          ></SearchResult>
        </View>
      </View>
    </View>
  );
};

export default ClaimsSearch;
