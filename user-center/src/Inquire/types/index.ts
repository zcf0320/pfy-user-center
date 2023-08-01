// 对话接口
export interface TalkItem {
  createTime?: number;
  answer: string;
  question: string;
  recordId?: string;
  questionId?: string;
  type?: Array<number>;
  comment: number;
}

// 症状接口
export interface SymptomItem {
  id: string | number;
  name: string;
}

// 提问接口
export interface AnswerItem {
  answer: string;
  recordId: string;
  questionId: string;
}

// 搜索结果接口
export interface ResultItem {
  id: string | number;
  name: string;
  text?: string;
}

// 评论接口
export interface CommentItem {
  comment: number;
  recordId: string;
  recordIndex: number;
}
// 会话接口
export interface SeesionItem {
  doctorState?: number; // 1在线 2离线  (响应字段，C端不用传递)
  diagnoseType: number; // 1ai 2人工
  queueState?: number; // 1未满 2已满 (响应字段，C端不用传递)
  serviceRecordId: string; // 服务记录id
  chartRecordId: string; // 聊天记录id
  content: {
    type: number; // 1文本，2文件url，3欢迎语
    localType: Array<number>;
    msg: string; // 消息内容
    time: number; // 发送消息时间
    state?: number; // 1待处理，2处理中，3已完成，4已取消 (响应字段，C端不用传递)
    sendor: number; // 1为用户，2为医生
    comment?: number;
    questionId?: number;
    receiverId: string; // 医生是employeeNo，患者是userId
    aiConclusions?: Array<any>;
    conclusion?: {
      diseaseName: string;
      hospitalDepartment: string;
      diseaseDrug: string;
      diseaseId: number;
    };
  };
}
