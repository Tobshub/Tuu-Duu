export type ActionButtonProps = {
  icon: string;
  value: any;
  onClick?: () => void;
  icon_alt: string;
  title: string;
  style?: {};
  islazy?: boolean;
  name?: string;
  className: string;
};

const ActionButton = (props: ActionButtonProps) => {
  return (
    <button
      type="submit"
      name={props.name ?? "action"}
      value={props.value}
      className={props.className + " action-button"}
      onClick={() => (props.onClick ? props.onClick() : null)}
      style={props.style ?? {}}
    >
      <img
        src={props.icon}
        alt={props.icon_alt}
        loading={props.islazy ? "lazy" : "eager"}
      />
    </button>
  );
};

export default ActionButton;
