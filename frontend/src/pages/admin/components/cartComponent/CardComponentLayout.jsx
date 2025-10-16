import "@css/board/adminDashBoard.css";
const CardComponentLayout = ({ icon, title, rightContent }) => {
  return (
    <>
      <div className="card-box rounded">
        <i>{icon}</i>
        <h3>{title}</h3>
      </div>
      <div>
        <span>{rightContent}</span>
      </div>
    </>
  );
};
export default CardComponentLayout;
