import CardComponentLayout from "./CardComponentLayout";

const CountCard = ({ className, title }) => {
  return (
    <div className={className}>
      <CardComponentLayout title={title} />
    </div>
  );
};

export default CountCard;
