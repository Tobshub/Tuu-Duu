import { useState } from "react";
import { Form } from "react-router-dom";
import { NotificationArgs } from "./notification";
import "./notification.css";

const ActionNotifcation = ({ content, action }: NotificationArgs) => {
  const [waiting, setWaiting] = useState(false);
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
        <Form method="post">
          <button
            type="submit"
            disabled={waiting}
            title={action.name + " " + action.target}
            onClick={() => {
              action.execute();
              setWaiting(true);
            }}
            name="action"
            value="reverted action"
          >
            {action.name}
          </button>
        </Form>
      )}
    </div>
  );
};

export default ActionNotifcation;
