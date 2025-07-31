const BoardListComponent = ({ categoryListData }) => {
  console.log("categoryListData------------------", categoryListData);
  return (
    <div>
      <ul>
        {categoryListData.map((item, index) => (
          <>
            <li key={index}>{index + 1}</li>
            <li>{item.qnaTitle}</li>
            <li>{item.clientId}</li>
            <li>{item.qnaDate}</li>
          </>
        ))}
      </ul>
    </div>
  );
};

export default BoardListComponent;
