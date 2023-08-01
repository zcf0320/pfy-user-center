import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Canvas } from '@tarojs/components';
import Page from '@components/page';
import { Component } from 'react';
import utils from '@utils/index';
import { uploadPicWithEncode } from '@actions/common';
import { commitElectronicSignature } from '@actions/claimsSettle';
import { connect } from 'react-redux';
import { SAVE_SIGN_URL, SET_SIGN_URL } from '@constants/claimsSettle';
import './index.scss';

let ctx: any = null;
let startX = 0;
let startY = 0;

let canvas: any = null;
interface IProps {
  setSignUrl: Function;
  onSaveSignUrl: Function;
}
interface IState {
  canvasw: number;
  canvash: number;
  isPaint: boolean;
  ratio: number;
}
@connect(
  state => state.claimsSettle,
  dispatch => {
    return {
      setSignUrl (url) {
        dispatch({
          type: SET_SIGN_URL,
          payload: url
        });
      },
      onSaveSignUrl (url) {
        dispatch({
          type: SAVE_SIGN_URL,
          payload: url
        });
      }
    };
  }
)
export default class Signature extends Component<IProps, IState> {
  constructor (props) {
    super(props);
    this.state = {
      canvasw: 0,
      canvash: 0,
      isPaint: false,
      ratio: 0
    };
  }

  componentDidMount () {
    this.getCanvasSize();
  }

  componentWillUnmount () {
    ctx = null;
  }

  // 获取 canvas 的尺寸（宽高）
  getCanvasSize () {
    const { windowWidth } = Taro.getSystemInfoSync();
    const ratio = windowWidth / 750;
    const canvasw = 687 * ratio;
    const canvash = 686 * ratio;
    this.setState(
      {
        canvasw,
        canvash,
        ratio
      },
      () => {
        this.initCanvas();
      }
    );
  }

  initCanvas () {
    const { isWeapp } = utils.appConfig;
    const { canvasw, canvash } = this.state;
    if (isWeapp) {
      ctx = Taro.createCanvasContext('canvas', this);
      ctx.setStrokeStyle('#000000');
      ctx.setLineWidth(4);
      // ctx.setFillStyle('#fff')
      // ctx.fillRect(0, 0, canvasw, canvash)
      ctx.setLineCap('round');
      ctx.setLineJoin('round');
    } else {
      canvas = document.querySelector('#canvas');
      console.log(canvas);
      ctx = canvas.getContext('2d');
      canvas.addEventListener(
        'touchstart',
        this.h5CanvasStart.bind(this),
        false
      );
      canvas.addEventListener('touchmove', this.h5CanvasMove.bind(this), false);
      canvas.addEventListener('touchend', this.h5CanvasEnd, false);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvasw, canvash);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round'; // 线条末端添加圆形线帽，减少线条的生硬感
      ctx.lineJoin = 'round'; // 线条交汇时为原型边角
      // 利用阴影，消除锯齿
      ctx.shadowBlur = 1;
      ctx.shadowColor = '#000';
    }
  }

  h5CanvasStart (e) {
    const { ratio } = this.state;

    const pageX = e.changedTouches[0].pageX;
    const pageY = e.changedTouches[0].pageY;

    startX = pageX - 32 * ratio;
    startY = pageY - 206 * ratio;

    ctx.beginPath();

    ctx.moveTo(startX, startY);
  }

  h5CanvasMove (e) {
    if (startX !== 0) {
      this.setState({
        isPaint: true
      });
    }
    const { ratio } = this.state;

    const pageX = e.changedTouches[0].pageX;
    const pageY = e.changedTouches[0].pageY;

    startX = pageX - 32 * ratio;
    startY = pageY - 206 * ratio;

    ctx.lineTo(startX, startY);
    ctx.stroke();
  }

  h5CanvasEnd () {
    ctx.closePath();
  }

  canvasStart (e) {
    const { isWeapp } = utils.appConfig;
    const { ratio } = this.state;
    console.log(e.changedTouches[0].pageX);
    console.log(e.changedTouches[0].pageY);
    startX = isWeapp ? e.changedTouches[0].x : e.changedTouches[0].pageX;
    startY = isWeapp ? e.changedTouches[0].y : e.changedTouches[0].pageY;
    if (!isWeapp) {
      startX = startX - 32 * ratio;
      startY = startY - 206 * ratio;
    }
    // startY = e.changedTouches[0].y
    ctx.beginPath();
  }

  canvasMove (e) {
    const { isWeapp } = utils.appConfig;
    if (startX !== 0) {
      this.setState({
        isPaint: true
      });
    }
    let x = isWeapp ? e.changedTouches[0].x : e.changedTouches[0].pageX;
    let y = isWeapp ? e.changedTouches[0].y : e.changedTouches[0].pageY;
    const { ratio } = this.state;
    if (!isWeapp) {
      x = x - 32 * ratio;
      y = y - 206 * ratio;
    }
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.stroke();
    isWeapp && ctx.draw(true);
    startX = x;
    startY = y;
  }

  canvasEnd () {
    // do something
  }

  // 取消
  clearDraw () {
    const { isWeapp } = utils.appConfig;
    const { canvasw, canvash } = this.state;
    startX = 0;
    startY = 0;
    ctx.clearRect(0, 0, canvasw, canvash);
    isWeapp && ctx.draw(true);
    this.setState({
      isPaint: false
    });
  }

  createImg () {
    const { router } = getCurrentInstance();
    if (!this.state.isPaint) {
      return;
    }
    const vm = this;
    // 生成图片
    const { isWeapp } = utils.appConfig;
    if (!isWeapp) {
      const imgBase64 = canvas.toDataURL();

      uploadPicWithEncode({
        filePath: imgBase64,
        module: 'sign'
      }).then((result: string) => {
        const res = JSON.parse(result);
        vm.props.setSignUrl(res.data);
        commitElectronicSignature({
          electronicSignatureImg: res.data,
          productReviewConfigId:
            router?.params && router.params.productReviewConfigId
        })
          .then((res2: any) => {
            vm.props.onSaveSignUrl(res2);
            Taro.navigateBack({
              delta: 1
            });
          })
          .catch(() => {});
      });
    }

    isWeapp &&
      Taro.canvasToTempFilePath({
        canvasId: 'canvas',
        success: res => {
          uploadPicWithEncode({
            filePath: res.tempFilePath,
            module: 'sign'
          }).then((result: string) => {
            const r = JSON.parse(result);
            vm.props.setSignUrl(r.data);
            commitElectronicSignature({
              electronicSignatureImg: r.data,
              productReviewConfigId:
                router?.params && router.params.productReviewConfigId
            }).then((res2: any) => {
              vm.props.onSaveSignUrl(res2);
              Taro.navigateBack({
                delta: 1
              });
            });
          });
        },
        fail (err) {
          console.log(err);
        }
      });
  }

  render () {
    const { canvash, canvasw, isPaint } = this.state;
    const { isH5 } = utils.appConfig;
    return (
      <Page title='签字板' showBack>
        <View className='page-signature'>
          <View className='canvas-box'>
            <View className='top flex'>请在框内使用 正楷 签名</View>
            {isH5
              ? (
              <canvas
                id='canvas'
                className='canvas'
                width={`${canvasw}px`}
                height={`${canvash}px`}
              ></canvas>
                )
              : (
              <Canvas
                canvasId='canvas'
                className='canvas'
                disableScroll
                onTouchStart={this.canvasStart.bind(this)}
                onTouchMove={this.canvasMove.bind(this)}
                width={`${canvasw}px`}
                height={`${canvash}px`}
              ></Canvas>
                )}
            <View className='bottom flex'>
              <View
                className={`bottom-item flex cancel ${isPaint ? 'active' : ''}`}
                onClick={this.clearDraw.bind(this)}
              >
                重签
              </View>
              <View
                className={`bottom-item flex confirm ${
                  isPaint ? 'active' : ''
                }`}
                onClick={this.createImg.bind(this)}
              >
                确认
              </View>
            </View>
          </View>
        </View>
      </Page>
    );
  }
}
