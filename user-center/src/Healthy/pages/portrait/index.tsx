import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Component } from 'react';
import Page from '@components/page';
import AuthModal from '@components/AuthModal';
import utils from '@utils/index';
import { getUserPortraitList, createUserPortrait } from '@actions/healthy';
import i18n from '@i18n/index';
import './index.scss';

interface IState {
  portraitList: Array<string>;
  selectText: string;
  showModal: boolean;
}
class Portrait extends Component<{}, IState> {
  constructor (props) {
    super(props);
    this.state = {
      portraitList: [],
      selectText: '',
      showModal: false
    };
  }

  componentDidMount () {
    getUserPortraitList().then((res: any) => {
      this.setState({
        portraitList: res || []
      });
    });
  }

  goHealth = () => {
    const { userInfo } = utils.appConfig;
    const user = Taro.getStorageSync(userInfo) || {};
    const { hasIdCard } = user;

    if (hasIdCard) {
      Taro.switchTab({
        url: '/Healthy/pages/index'
      });
    } else {
      this.setState({
        showModal: true
      });
    }
  };

  clickItem = index => {
    const { selectText, portraitList } = this.state;
    // 判断是否有值
    const name: string = portraitList[index];
    let newSelect = '';

    let selectList = selectText.split(',');
    if (selectList[0] === '') {
      selectList = [];
    }
    const inIndex = selectList.indexOf(name);
    if (inIndex > -1) {
      selectList.splice(inIndex, 1);
    } else {
      selectList.push(name);
    }
    newSelect = selectList.join(',');
    this.setState({
      selectText: newSelect
    });
  };

  save = () => {
    const { selectText } = this.state;

    if (selectText.split(',').length >= 2) {
      createUserPortrait({
        tags: selectText
      }).then(() => {
        Taro.redirectTo({
          url: '/Healthy/pages/portraitDetail/index'
        });
      });
    }
  };

  render () {
    const { portraitList, selectText, showModal } = this.state;
    return (
      <Page showBack title={i18n.chain.healthPortrait.title}>
        <View className='page-portrait'>
          <View className='portratit-title'>
            {portraitList.length >= 10
              ? i18n.chain.healthPortrait.hereAre
              : i18n.chain.healthPortrait.toLow}
          </View>
          <View className='limit'>{i18n.chain.healthPortrait.least2}</View>
          <View className='tag-list flex'>
            {portraitList.length > 0 &&
              portraitList.map((item, index) => {
                return (
                  <View
                    className={`tag-item flex ${
                      selectText.indexOf(item) > -1 ? 'select' : ''
                    }`}
                    key={index}
                    onClick={() => {
                      this.clickItem(index);
                    }}
                  >
                    <View className='add-icon'></View>
                    <Text>{item}</Text>
                  </View>
                );
              })}
          </View>
          {portraitList.length < 10
            ? (
            <View className='tips'>
              <Text className='go' onClick={this.goHealth}>
                {i18n.chain.healthPortrait.improve}
              </Text>
              <Text>{i18n.chain.healthPortrait.helpGenerate}</Text>
            </View>
              )
            : null}

          <View
            className={`bottom flex ${
              selectText.split(',').length >= 2 ? '' : 'disable'
            }`}
            onClick={this.save}
          >
            {i18n.chain.healthPortrait.generate}
          </View>
        </View>
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
export default Portrait;
