// 액션 타입 정의
const CHANGE_COLOR = "counter/CHANGE_COLOR";
const INCREMENT = "counter/INCREMENT";
const DECREMENT = "counter/DECREMENT";
// 문자열의 앞부분에 모듈 이름을 넣는다.

// 액션 생성함수 정의
export const changeColor = (color) => ({
  type: CHANGE_COLOR,
  color,
});
export const increment = () => ({ type: INCREMENT });

const initialState = {
  color: "red",
  number: 0,
};

// reducer 작성
export default function counter(state = initialState, action) {
  switch (action.type) {
    case CHANGE_COLOR:
      return {
        ...state,
        color: action.color,
      };
    case INCREMENT:
      return {
        ...state,
        color: state.number + 1,
      };
    default:
      return state;
  }
}
