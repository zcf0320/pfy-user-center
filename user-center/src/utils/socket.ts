import Taro from '@tarojs/taro';
import utils from '@utils/index';

export default class WS {
  // 是否为小程序
  isWeapp: boolean;
  // websocket 地址
  url: string;
  ws: any;
  lockReconnect: boolean;
  // 限制重连次数 重连多少次就不会重连了
  limit: number;
  // 重连的定时任务
  timer: any;
  // ping 发送的时间间隔
  timeout: number;
  // ping 的定时任务
  timeoutObj: any;
  serverTimeoutObj: any;
  messageCb: (data: any) => void;
  constructor (url, cb) {
    console.log(url);
    this.isWeapp = utils.appConfig.isWeapp;
    this.url = url;
    this.lockReconnect = false;
    this.limit = 0;
    this.timeout = 10000;
    this.messageCb = cb;
  }

  createWebSocket () {
    try {
      if (this.isWeapp) {
        Taro.connectSocket({
          url: this.url,
          success: () => {
            this.initEventHandles();
            console.log('websocket链接成功');
          }
        });
      } else {
        this.ws = new WebSocket(this.url);
        this.initEventHandles();
        console.log('websocket链接成功');
      }
    } catch (e) {
      console.log('catch');
    }
  }

  initEventHandles () {
    // 注册信息
    this.onSocketOpen();
    this.onSocketMessage();
    this.onSocketError();
    this.onSocketClose();
  }

  // 重连
  reconnect () {
    if (this.lockReconnect) return;
    this.lockReconnect = true;
    this.timer && clearTimeout(this.timer);
    if (this.limit < 12) {
      this.timer = setTimeout(() => {
        this.createWebSocket();
        this.lockReconnect = false;
      }, 5000);
      this.limit = this.limit + 1;
    }
  }

  // 重置
  reset () {
    this.timeoutObj && clearInterval(this.timeoutObj);
    this.serverTimeoutObj && this.close();
    return this;
  }

  // 开始
  start () {
    this.timeoutObj = setInterval(() => {
      this.sendSocketMessage({
        diagnoseType: 3,
        content: {
          msg: 'ping'
        }
      });
    }, this.timeout);
  }

  // 关闭
  close () {
    // this.serverTimeoutObj = setTimeout(() => {
    if (this.isWeapp) {
      console.log('关闭');
      this.timeoutObj && clearInterval(this.timeoutObj);
      Taro.closeSocket();
    } else {
      this.timeoutObj && clearInterval(this.timeoutObj);
      this.ws.close();
    }
    // }, this.timeout);
  }

  // 监听 WebSocket 连接打开事件
  onSocketOpen () {
    if (this.isWeapp) {
      Taro.onSocketOpen(() => {
        console.log('websocket打开了');
        this.reset().start();
      });
    } else {
      this.ws.onopen = () => {
        // 心跳检测重置
        console.log('websocket打开了');
        this.reset().start();
      };
    }
  }

  // 监听 WebSocket 接受消息
  onSocketMessage () {
    if (this.isWeapp) {
      Taro.onSocketMessage(res => {
        console.log('数据已接收...');
        const { data } = res;
        if (this.messageCb) {
          data !== 'OK' && this.messageCb(JSON.parse(data));
          data === 'close' && this.messageCb('close');
        }
      });
    } else {
      this.ws.onmessage = res => {
        console.log('数据已接收...');
        const { data } = res;
        if (this.messageCb) {
          data !== 'OK' && this.messageCb(JSON.parse(data));
          data === 'close' && this.messageCb('close');
        }
      };
    }
  }

  // 监听 WebSocket 错误事件
  onSocketError () {
    if (this.isWeapp) {
      Taro.onSocketError(res => {
        console.log('websocket发生错误');
        this.reconnect();
      });
    } else {
      this.ws.onerror = res => {
        console.log('websocket发生错误');

        this.reconnect();
      };
    }
  }

  // 监听 WebSocket 关闭事件
  onSocketClose () {
    // if (this.isWeapp) {
    //     Taro.onSocketClose((res) => {
    //         console.log("websocket关闭")
    //         console.log(res)
    //         this.reconnect()
    //     })
    // } else {
    //     this.ws.onclose = (res) => {
    //         console.log("websocket关闭")
    //         console.log(res)
    //         this.reconnect()
    //     }
    // }
  }

  // 发送信息
  sendSocketMessage (data) {
    if (this.isWeapp) {
      Taro.sendSocketMessage({
        data: JSON.stringify(data),
        success () {
          console.log('发送成功');
        }
      });
    } else {
      this.ws.send(JSON.stringify(data));
    }
  }
}
