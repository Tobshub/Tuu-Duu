const ActionButton = (props: ActionButtonProps) => {
  return (
    <button
      type={props.type ?? "submit"}
      name={props.name ?? "action"}
      value={props.value ?? ""}
      className={props.className + " action-button"}
      onClick={props.onClick ? () => props.onClick() : null}
      style={props.style ?? {}}
    >
      <img
        src={props.icon}
        alt={props.icon_alt}
        loading={props.islazy ? "lazy" : "eager"}
        width={"inherit"}
      />
    </button>
  );
};

export default ActionButton;
