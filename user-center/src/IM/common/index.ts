export const commonQuestion = (recordList: any, res: any) => {
  if (res.diagnoseType === 5) {
    res.content = {
      type: 0,
      questionId: ''
    };
  }
  recordList.push(res);

  return recordList;
};
export const commonAnswer = (recordList: any, res: any) => {
  recordList.push({
    queueState: 2,
    diagnoseType: 4,
    userId: recordList[recordList.length - 1].userId,
    content: {
      sendor: 1,
      receiver: 2,
      state: 2,
      type: recordList[recordList.length - 1].content.type,
      time: new Date().getTime(),
      questionId: recordList[recordList.length - 1].content.questionId,
      msg: res.msg,
      answerType: res.localType === 2 ? 4 : '',
      localType: res.localType
    }
  });
  return recordList;
};
