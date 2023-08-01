import { View, Image } from '@tarojs/components';
import { Component } from 'react';
import utils from '@utils/index';
import Page from '@components/page';
import './index.scss';

const { ossHost } = utils.appConfig;
class Review extends Component {
  render () {
    return (
      <Page title='审核中' showBack>
        <View className='review-box pd-32'>
          <View className='flex-center review-tip mb-32'>
            <View>
              <View className='flex-center'>
                <Image src={`${ossHost}images/review.png`} className='review-img'></Image>
              </View>
              <View className='review-title'>您的材料已提交成功,正在审核中...</View>
              <View className='review-sub-title'>
                预计1-3个工作日会给您答复,请耐心等待
              </View>
            </View>
          </View>
        </View>
      </Page>
    );
  }
}
export default Review;
