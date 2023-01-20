const ActionButton = (props: ActionButtonProps) => {
  return (
    <button
      title={props.title ?? ""}
      type={props.type ?? "submit"}
      name={props.name ?? "action"}
      value={props.value ?? ""}
      className={
        props.className
          ? props.className + " " + "action-button"
          : "action-button"
      }
      onClick={e => (props.onClick ? props.onClick(e) : undefined)}
      style={props.style ?? {}}
    >
      <img
        style={props.style?.width ? { width: props.style.width } : {}}
        src={props.icon}
        alt={props.icon_alt}
        loading={props.islazy ? "lazy" : "eager"}
        width={"inherit"}
      />
    </button>
  );
};

export default ActionButton;
