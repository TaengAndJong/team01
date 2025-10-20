import "@css/board/adminDashBoard.css";
const CardComponentLayout = ({ title }) => {
  return (
    <>
      <div className="card-box rounded">
        <h3>{title}</h3>
      </div>
      <div>
        <span></span>
      </div>
    </>
  );
};
export default CardComponentLayout;
