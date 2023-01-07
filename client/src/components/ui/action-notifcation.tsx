import { useState } from "react";
import { Form } from "react-router-dom";
import "@styles/notification.css";

const ActionNotifcation = ({ content, action }: NotificationArgs) => {
  const [loading, setLoading] = useState(false);
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
        <Form method="post" onSubmit={action?.nextAction ?? null}>
          <button
            className="btn btn-warning btn-sm"
            type="submit"
            disabled={loading}
            title={`${action?.name} ${action?.target}`}
            onClick={
              action
                ? () => action.execute().then(() => setLoading(true))
                : undefined
            }
            name="action"
            value="revert_action"
          >
            {action?.name}
          </button>
        </Form>
      )}
    </div>
  );
};

export default ActionNotifcation;
