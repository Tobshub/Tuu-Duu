import { Form } from "react-router-dom";
import { NotificationArgs } from "./notification";
import "./notification.css";

const ActionNotifcation = ({ content, action }: NotificationArgs) => {
  return (
    <div
      className="notification-container magictime spaceInRight"
      style={{
        animationDuration: "350ms",
      }}
    >
      {content && content.title && <h3>{content.title}</h3>}
      <p>{content && content.message}</p>
      {action && (
        <Form>
          <button onClick={action.execute}>{action.name}</button>
        </Form>
      )}
    </div>
  );
};

export default ActionNotifcation;
