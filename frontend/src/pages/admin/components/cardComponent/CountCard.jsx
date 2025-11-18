const CountCard = ({ iconTag, title, countData, cardName }) => {
  return (
    <>
      <div className={`${cardName} cardwrapper rounded-4  shadow`}>
        <i className={iconTag}></i>
        <h2 className="card-title text-start">
          <span className="title-text">{title}</span>
        </h2>
        <span className="card-text">
          <em className="count">{countData}</em>건
        </span>
      </div>
    </>
  );
};

export default CountCard;
