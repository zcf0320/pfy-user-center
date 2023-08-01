import {
  GET_ARTICLE_TYPE,
  GET_ARTICLE_LIST,
  GET_ARTICLE_DETAIL,
  SET_LOAD_ALL
} from '@constants/article';

const INITIAL_STATE = {
  articleType: [],
  articleList: [],
  articleListAll: false,
  articleDetail: {}
};

export default function article (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_ARTICLE_TYPE:
      return {
        ...state,
        articleType: action.payload
      };
    case GET_ARTICLE_LIST: {
      return {
        ...state,
        articleListAll: !!(action.pageSize > action.payload.length),
        articleList:
          action.pageNum === 1
            ? action.payload
            : state.articleList.concat(action.payload)
      };
    }
    case SET_LOAD_ALL: {
      return {
        ...state,
        articleListAll: action.payload
      };
    }
    case GET_ARTICLE_DETAIL: {
      return {
        ...state,
        articleDetail: action.payload
      };
    }
    default:
      return state;
  }
}
