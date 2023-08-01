// 继续问诊
export const continueInquire = (recordList: any, res: any) => {
  // 是否有诊断结果
  if (!res.conclusion) {
    recordList[recordList.length - 1].histories.push({
      ...res,
      type: [5]
    });
  } else {
    const { noSpecificConclusions } = res.conclusion;
    if (noSpecificConclusions) {
      const resultArr = [
        {
          ...res,
          type: [9]
        },
        {
          recordId: res.recordId,
          answer: '',
          question: '请您对这次的问诊进行评价',
          type: [7]
        }
      ];
      recordList[recordList.length - 1].histories = [
        ...recordList[recordList.length - 1].histories,
        ...resultArr
      ];
    } else {
      recordList[recordList.length - 1].conclusion = res.conclusion;
      const resultArr = [
        {
          recordId: res.recordId,
          answer: '',
          question: '根据您的表述，初步诊断结果为',
          type: [6]
        },
        {
          recordId: res.recordId,
          answer: '',
          question: '请您对这次的问诊进行评价',
          type: [7]
        }
      ];
      recordList[recordList.length - 1].histories = [
        ...recordList[recordList.length - 1].histories,
        ...resultArr
      ];
    }
  }
  return recordList;
};
// 继续问诊
//      doctorState":1,//1在线 2离线  (响应字段，C端不用传递)
//     "diagnoseType":1,//1ai 2人工
//     "queueState":1,//1未满 2已满 (响应字段，C端不用传递)
//     "serviceRecordId":"3322",//服务记录id
//     "chartRecordId":"143214321",//聊天记录id
//     "content":{
//       "type":1,//1文本，2文件url，3欢迎语
//       "localType": 前端本地的type
//       "msg":"31543",//消息内容
//       "time":16000993832 //发送消息时间
//       "state":1,//1待处理，2处理中，3已完成，4已取消 (响应字段，C端不用传递)
//       "sendor":1,//1为用户，2为医生
//       "revevier": 2,//1为用户，2为医生
//       "receiverId":"231321",//医生是employeeNo，患者是userId,
//       "comment" // 评价
//       "conclusion": {
//         "diseaseName": "心脏病",
//         "hospitalDepartment": "内科",
//         "diseaseDrug": "阿莫西林"
//       }
//     }
//   }
export const commonQuestion = (recordList: any, res: any) => {
  // 是否有诊断结果
  const { content, diagnoseType } = res;
  if (!content.conclusion) {
    // 如果是人工的
    if (diagnoseType === 2) {
      res.content.localType = [];
    } else {
      res.content.type === 1 && (res.content.localType = [5]);
    }
    recordList.push(res);
  } else {
    const { noSpecificConclusions } = res.content.conclusion;
    const resultArr = [] as any;
    if (noSpecificConclusions) {
      // 结束语
      res.content.localType = [];
      resultArr.push(res);
      resultArr.push({
        content: {
          localType: [9]
        }
      });
    } else {
      // recordList[recordList.length - 1].conclusion = res.conclusion
      res.content.localType = [6];
      res.content.msg = '根据您的表述，初步诊断结果为';

      resultArr.push(res);
      // 结束语
      resultArr.push({
        content: {
          msg: '',
          localType: [9]
        }
      });
    }
    // diagnoseType === 2 && resultArr.push({
    //     diagnoseType,
    //     chartRecordId,
    //     content: {
    //         msg: '请您对这次的问诊进行评价',
    //         type: 1,
    //         localType: [7],
    //         sendor: 2,
    //         time: new Date().getTime()
    //     }
    // })
    recordList = recordList.concat(resultArr);
  }
  return recordList;
};
export const commonAnswer = (recordList: any, res: any) => {
  const { content } = res;
  recordList.push({
    ...res,
    content: {
      sendor: 1,
      type: 1,
      time: new Date().getTime(),
      localType: [],
      // state: 2,
      questionId: recordList[recordList.length - 1].content.questionId,
      ...content
    }
  });
  return recordList;
};
