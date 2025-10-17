import CardComponentLayout from "./CardComponentLayout";

const CountCard = ({ className, icon, title, rightContent }) => {
  return (
    <div className={className}>
      <CardComponentLayout
        icon={icon}
        title={title}
        rightContent={rightContent}
      />
    </div>
  );
};

export default CountCard;
