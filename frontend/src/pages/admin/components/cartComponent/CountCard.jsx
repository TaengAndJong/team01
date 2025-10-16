import CardComponentLayout from "./CardComponentLayout";

const CountCard = ({ icon, title, rightContent }) => {
  return (
    <>
      <CardComponentLayout
        icon={icon}
        title={title}
        rightContent={rightContent}
      />
    </>
  );
};

export default CountCard;
