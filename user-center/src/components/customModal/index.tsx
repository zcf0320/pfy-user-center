import { Component } from 'react';
import { View } from '@tarojs/components';
import { connect } from 'react-redux';
import { INIT_MODAL } from '@constants/common';
import './index.scss';

interface IProps {
  customModal: any;
  initData: () => void;
}
interface IState {
  changeState: boolean;
}
@connect(
  state => {
    return Object.assign({}, state.common);
  },
  dispatch => ({
    initData () {
      dispatch({
        type: INIT_MODAL
      });
    }
  })
)
class CustomModal extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      changeState: false
    };
  }

  static getDerivedStateFromProps (nextProps, state) {
    if (nextProps.customModal.show !== state.changeState) {
      return {
        changeState: true
      };
    }
    return null;
  }

  render () {
    const { customModal } = this.props;
    const {
      title,
      show,
      content,
      subTitle,
      subColor,
      cancelText,
      confirmText,
      clickCancel,
      clickConfirm,
      confirmColor,
      cancelColor,
      showCancel
    } = customModal;
    const { changeState } = this.state;
    return (
      <View>
        {show
          ? (
          <View className='custom-modal'>
            <View
              className={`custom-modal-content ${changeState ? 'show' : ''}`}
            >
            {
              title ? <View className='title flex'>{title}</View> : null
            }

              <View className='modal-content flex'>
                <View className='content-text'>{content}</View>
                {subTitle
                  ? (
                  <View
                    className='sub-title-text'
                    style={{ color: subColor || '#FEBD44' }}
                  >
                    {subTitle}
                  </View>
                    )
                  : null}
                <View
                  className={`action-list flex ${showCancel ? '' : 'around'}`}
                >
                  {showCancel
                    ? (
                    <View
                      className='action-item flex'
                      onClick={() => {
                        clickCancel();
                        this.props.initData();
                      }}
                      style={{ background: cancelColor }}
                    >
                      {cancelText}
                    </View>
                      )
                    : null}
                  <View
                    className='action-item flex'
                    onClick={() => {
                      clickConfirm();
                      this.props.initData();
                    }}
                    style={{ background: confirmColor }}
                  >
                    {confirmText}
                  </View>
                </View>
              </View>
            </View>
          </View>
            )
          : null}
      </View>
    );
  }
}

export default CustomModal;
