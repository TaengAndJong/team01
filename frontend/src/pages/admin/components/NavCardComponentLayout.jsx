const NavCardComponentLayout = (icon, title, children) => {
  return (
    <>
      <div>
        <i>{icon}</i>
        <h3>{title}</h3>
      </div>
      <div>
        <span>{children.item.length}건</span>
      </div>
    </>
  );
};
export default NavCardComponentLayout;
