import Taro, { useRouter } from '@tarojs/taro';
import { useState, useEffect } from 'react';
import { RichText, View, Text } from '@tarojs/components';
import Page from '@components/page';
import { getArticleDetail } from '@actions/minApp';
import utils from '@utils/index';
import './index.scss';

function Detail () {
  const [info, setInfo] = useState<any>({});
  const [content, setContent] = useState('');
  const [showPage, setShowPage] = useState(false);
  const router = useRouter();
  useEffect(() => {
    let show = true;
    const time = new Date().getTime();
    const createTime = Number(router?.params && router.params.createTime);
    createTime && (show = !!(time - createTime < 60 * 2 * 1000));
    !show &&
      Taro.showToast({
        title: '二维码已过期',
        icon: 'none'
      });
    setShowPage(show);
    show &&
      getArticleDetail({ articleId: router?.params && router.params.id }).then(
        (res: any) => {
          setInfo(res);
          const newContent = res.content.replace(
            /<img/gi,
            '<img style="max-width:100%;height:auto;display:block;"'
          );
          setContent(newContent);
          Taro.setNavigationBarTitle({
            title: '健康百科详情'
          });
        }
      );
  }, [router.params]);
  return (
    <Page showBack title='健康百科详情'>
      {showPage
        ? (
        <View className='page-article-detail'>
          <View className='title'>{info.title}</View>
          <View className='time flex'>
            <Text>{utils.timeFormat(info.updateTime, 'y-m-d h:m')}</Text>
            <Text>{info.typeName}</Text>
          </View>
          <RichText nodes={content}></RichText>
        </View>
          )
        : null}
    </Page>
  );
}
export default Detail;
