import { useContext, useEffect } from "react";
import BoardListComponent from "./boardListComponent";
import { BoardListContext } from "../boardComponent";
import PropTypes from "prop-types";
import "@assets/css/board/userBoard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Btn from "@util/reuseBtn.jsx";

const BoardTemplateComponent = ({ category }) => {
  // console.log("카테고리 뭐임?", category);
  // console.log("카테고리 속성 뭐임?", typeof category);
  const boardList = useContext(BoardListContext);
  const list = boardList?.[category] || [];
  const navigate = useNavigate();
  //console.log(`[${category}] 카테고리에 해당하는 게시물 목록`, list);

  // 컴포넌트 마운트/언마운트 추적
  useEffect(() => {
    setCheckedInput([]);
    //console.log(`[${category}] BoardTemplateComponent 마운트됨`);
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
      console.log(`[${category}] selectAll`, isChecked);
      // 모든 boardId를 배열에 추가
      const allIds = list.map((item) => getBoardId(item));
      console.log(`[${category}] allIds-category`, allIds);
      setCheckedInput(allIds);
    } else {
      // 전부 해제
      console.log(`[${category}] 모든 선택 해제`);
      setCheckedInput([]);
    }
  };

  const onChangeCheck = (qnaId, isChecked) => {
    if (isChecked) {
      setCheckedInput((prev) => {
        const newArray = [...prev, qnaId];
        console.log(`[${category}] checkedInput 배열에 들어간다`, newArray);
        return newArray;
      });
    } else {
      setCheckedInput((prev) => {
        const newArray = prev.filter((id) => id !== qnaId);
        console.log(`[${category}] checkedInput 배열에서 나간다`, newArray);
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
              <input
                type="checkbox"
                id="selectAll"
                checked={checkedInput.length === list.length && list.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </th>
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
              <td colSpan="12" className="text-center">
                데이터가 없습니다.
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
          className={"create btn custom-btn00 btn-create"}
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
