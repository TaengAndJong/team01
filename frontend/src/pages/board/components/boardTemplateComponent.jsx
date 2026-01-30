import { useContext, useEffect } from "react";
import BoardListComponent from "./boardListComponent";
import { BoardListContext } from "../boardComponent";
import PropTypes from "prop-types";
import "@assets/css/board/userBoard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Btn from "@util/form/reuseBtn.jsx";

const BoardTemplateComponent = ({ category }) => {

  const boardList = useContext(BoardListContext);
  const list = boardList?.[category] || [];
  const navigate = useNavigate();


  // 컴포넌트 마운트/언마운트 추적
  useEffect(() => {
    setCheckedInput([]);

    return () => {
      //  console.log(`[${category}] BoardTemplateComponent 언마운트됨`);
    };
  }, [category]);

  //체크박스 전체 선택 하기 상태 관리
  //체크박스 상태관리(단일선택, 다중선택 초기값은 배열로)
  const [checkedInput, setCheckedInput] = useState([]);

  const getBoardId = (item) => {
    switch (category) {
      case "product":
        return item.qnaProId;
      case "delivery":
        return item.qnaDelId;
      case "one":
        return item.qnaOneId;
      default:
        return item.qnaId; // 기본값
    }
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {

      // 모든 boardId를 배열에 추가
      const allIds = list.map((item) => getBoardId(item));

      setCheckedInput(allIds);
    } else {
      // 전부 해제

      setCheckedInput([]);
    }
  };

  const onChangeCheck = (qnaId, isChecked) => {
    if (isChecked) {
      setCheckedInput((prev) => {
        const newArray = [...prev, qnaId];

        return newArray;
      });
    } else {
      setCheckedInput((prev) => {
        const newArray = prev.filter((id) => id !== qnaId);

        return newArray;
      });
    }
  };

  const handleCreateBoard = () => {
    navigate(`/board/createBoard`, {
      state: { category },
    });
  };

  return (
    <div>
      <table className="table table-custom">
        <caption className="sr-only">등록된 게시물 테이블</caption>
        <thead>
          <tr>

            <th scope="col" className="text-center">
              No.
            </th>
            <th scope="col" className="text-center">
              제목
            </th>
            <th scope="col" className="text-center">
              작성자
            </th>
            <th scope="col" className="text-center">
              답변여부
            </th>
            <th scope="col" className="text-center">
              등록일
            </th>
          </tr>
        </thead>

        <tbody className="">
          {list && list.length === 0 ? (
            <tr className="">
              <td colSpan="5" className="text-center p-4">
                문의하신 글이 없습니다.
              </td>
            </tr>
          ) : (
            list.map((item, index) => (
              <BoardListComponent
                key={index}
                categoryListData={item}
                category={category}
                number={index + 1}
                checkedInput={checkedInput}
                onChangeCheck={onChangeCheck}
                getBoardId={getBoardId}
              />
            ))
          )}
        </tbody>
      </table>

      <div className="btn-Box p-4 m-2">
        <Btn
          className={"create btn custom-btn01 btn-create"}
          id={"createBtn"}
          type={"button"}
          onClick={() => handleCreateBoard()}
          text="문의 하기"
        />
      </div>
    </div>
  );
};

BoardTemplateComponent.propTypes = {
  category: PropTypes.string.isRequired,
};

export default BoardTemplateComponent;
