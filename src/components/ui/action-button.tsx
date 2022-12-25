const ActionButton = (props: ActionButtonProps) => {
  return (
    <button
      type={props.type ?? "submit"}
      name={props.name ?? "action"}
      value={props.value ?? ""}
      className={props.className + " action-button"}
      onClick={props.onClick ? e => props.onClick(e) : null}
      style={props.style ?? {}}
    >
      <img
        style={props.style?.width ? { width: props.style?.width } : {}}
        src={props.icon}
        alt={props.icon_alt}
        loading={props.islazy ? "lazy" : "eager"}
        width={"inherit"}
      />
    </button>
  );
};

export default ActionButton;
