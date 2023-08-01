export interface ISessionItem {
  diagnoseType: number; // 1ai 2人工
  queueState?: number; // 1未满 2已满 (响应字段，C端不用传递)
  userId: string;
  coinNum?: number;
  content: {
    type: number; // 1文本，2文件url，3欢迎语
    answerType: number;
    answers?: Array<any>;
    msg: string; // 消息内容
    time: number; // 发送消息时间
    state?: number; // 1待处理，2处理中，3已完成，4已取消 (响应字段，C端不用传递)
    sendor: number; // 1为用户，2为医生
    questionId?: number;
    receiver: string; // 医生是employeeNo，患者是userId
    localType: number;
  };
}
