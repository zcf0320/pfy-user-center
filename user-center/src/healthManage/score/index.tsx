import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import AuthModal from '@components/AuthModal';
import utils from '@utils/index';
import { getHealthScore, updateHealthScore } from '@actions/healthManage';
import { getUserPortrait } from '@actions/healthy';
import i18n from '@i18n/index';
import './index.scss';

interface IState {
  scrollHeight: number;
  userInfo: {
    hasIdCard?: boolean;
  };
  response: {
    createTime?: number;
    score?: number;
  };
  list: Array<string>;
  showModal: boolean;
}
class Score extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      scrollHeight: 0,
      response: {},
      userInfo: {},
      list: [],
      showModal: false
    };
  }

  componentDidShow () {
    const { windowHeight, windowWidth } = utils.appConfig;
    this.setState({
      scrollHeight: windowHeight - (windowWidth / 375) * 44
    });
    utils.Auth.checkSession(true).then(res => {
      this.setState({ userInfo: res });
      const { userInfo } = utils.appConfig;
      Taro.setStorageSync(userInfo, res);
    });
    getUserPortrait().then((res: any) => {
      this.setState({
        list: res
      });
    });
    getHealthScore().then((res: any) => {
      res &&
        this.setState({
          response: res
        });
    });
  }

  update = () => {
    const { response } = this.state;
    const { createTime } = response || {};
    if (createTime && utils.isSameWeek(createTime)) {
      Taro.showToast({
        title: i18n.chain.healthyScore.nextWeek,
        icon: 'none'
      });
      return;
    }
    updateHealthScore().then((res: any) => {
      res &&
        this.setState({
          response: res
        });
    });
  };

  goHealth = () => {
    const { userInfo } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo) || {};
    const { hasIdCard } = user;

    if (!hasIdCard) {
      this.setState({
        showModal: true
      });
      return;
    }

    Taro.switchTab({ url: '/Healthy/pages/index' });
  };

  goPortrait () {
    const { list } = this.state;
    const { userInfo } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo) || {};
    const { hasIdCard } = user;
    if (!hasIdCard) {
      this.setState({
        showModal: true
      });
      return;
    }
    let url = '/Healthy/pages/portrait/index';
    list && (url = '/Healthy/pages/portraitDetail/index');
    Taro.navigateTo({
      url
    });
  }

  render () {
    const { scrollHeight, response, userInfo, showModal } = this.state;
    const { score, createTime } = response;
    const { hasIdCard } = userInfo;
    return (
      <Page showBack title={i18n.chain.healthyScore.healthScore}>
        <ScrollView
          className='page-health-score flex'
          scrollY
          style={{ height: `${scrollHeight}px` }}
        >
          <View className='scroll-view flex'>
            <View className='page-bg'></View>
            <View
              className='go-score flex'
              onClick={() => {
                this.goPortrait();
              }}
            >
              {i18n.chain.healthyScore.healthPortrait}
            </View>
            <View className='score-border flex'>
              <View className='score-border-content flex'>{score || 0}</View>
            </View>
            <View className='update-time'>
              {i18n.chain.healthyScore.lastUpdated}：
              {createTime ? `${utils.timeFormat(createTime, 'y-m-d')}` : '-'}
            </View>
            <View className='update flex' onClick={this.update}>
              {i18n.chain.healthyScore.updateScore}
            </View>
            <View className='score-bg'></View>
            <View className='health-score-content'>
              <View className='health-score-content-title'>
                {i18n.chain.healthyScore.growthStrategy}
              </View>
              <View className='content-item flex'>
                <View className='item-left flex'>
                  <View className='left-icon icon-1'></View>
                  <View className='left-content'>
                    <View className='left-title'>
                      {i18n.chain.healthyScore.improveHealth}
                    </View>
                    <View className='left-text'>
                      {i18n.chain.healthyScore.healthScore}
                    </View>
                  </View>
                </View>
                <View
                  className='item-right flex'
                  onClick={() => {
                    this.goHealth();
                  }}
                >
                  {i18n.chain.healthyScore.goPerfect}
                </View>
              </View>
              <View className='content-item flex'>
                <View className='item-left flex'>
                  <View className='left-icon icon-2'></View>
                  <View className='left-content'>
                    <View className='left-title'>
                      {i18n.chain.healthyScore.personalInformation}
                    </View>
                    <View className='left-text'>
                      {i18n.chain.healthyScore.helpScore}
                    </View>
                  </View>
                </View>
                <View
                  className={`item-right flex ${hasIdCard ? 'disable' : ''}`}
                  onClick={() => {
                    if (hasIdCard) {
                      return;
                    }
                    Taro.navigateTo({
                      url: '/pages/register/index?back=true'
                    });
                  }}
                >
                  {hasIdCard
                    ? i18n.chain.healthyScore.filedin
                    : i18n.chain.healthyScore.filin}
                </View>
              </View>
              <View className='content-item flex'>
                <View className='item-left flex'>
                  <View className='left-icon icon-3'></View>
                  <View className='left-content'>
                    <View className='left-title'>
                      {i18n.chain.healthyScore.uploadPhysical}
                    </View>
                    <View className='left-text'>
                      {i18n.chain.healthyScore.helpScore}
                    </View>
                  </View>
                </View>
                <View className='item-right flex disable'>
                  {i18n.chain.healthyScore.comingSoon}
                </View>
              </View>
            </View>
            <View className='score-sys' id='scoreSys'>
              <View className='score-sys-title'>
                {i18n.chain.healthyScore.scoringSystem}
              </View>
              <View className='border'></View>
              <View className='doctor'></View>
              <View className='score-sys-common'>
                <View className='score-sys-common-title flex'>
                  <View className='score-sys-common-bg'></View>
                  <Text>{i18n.chain.healthyScore.whatIs}</Text>
                </View>
                <View className='sys-introduce'>
                  {i18n.chain.healthyScore.whatIsTip}
                </View>
              </View>
              <View className='score-sys-common'>
                <View className='score-sys-common-title flex'>
                  <View className='score-sys-common-bg'></View>
                  <Text>{i18n.chain.healthyScore.useScore}</Text>
                </View>
                <View className='sys-introduce'>
                  {i18n.chain.healthyScore.useScoreTip}
                </View>
              </View>
              <View className='score-sys-common'>
                <View className='score-sys-common-title flex'>
                  <View className='score-sys-common-bg'></View>
                  <Text>{i18n.chain.healthyScore.addScore}</Text>
                </View>
                <View className='sys-introduce introduce-three'>
                  {i18n.chain.healthyScore.addScoreTip}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        {showModal && (
          <AuthModal
            onConfirm={() => {
              this.setState({
                showModal: false
              });
              Taro.navigateTo({
                url: '/pages/register/index?isJump=true'
              });
            }}
            onCancel={() => {
              this.setState({
                showModal: false
              });
            }}
          ></AuthModal>
        )}
      </Page>
    );
  }
}
export default Score;
