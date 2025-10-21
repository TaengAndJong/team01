const CountCard = ({ iconTag, title, countData, cardName }) => {
  return (
    <>
      <div className={`${cardName} cardwrapper rounded-4 p-5 shadow`}>
        <h2 className="card-title text-start d-flex">
          <i className={iconTag}></i>
          <span>{title}</span>
        </h2>
        <span className="float-end mt-4">
          <em className="count">{countData}</em>개
        </span>
      </div>
    </>
  );
};

export default CountCard;
