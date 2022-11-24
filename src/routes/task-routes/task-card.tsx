import { useEffect, useRef, useState } from "react";
import { Form } from "react-router-dom";
import { Task, Todo, TodoStatus } from "../../types/project";
import EditSVG from "../../images/Edit.svg";
import DoneSVG from "../../images/Checkmark.svg";
import DeleteSVG from "../../images/Delete.svg";

const TaskCard = ({
  task,
  index,
  delete_action,
}: {
  task: Task;
  index: number;
  delete_action: () => void;
}) => {
  const [magicStyle, setMagicStyle] = useState("magictime swashIn");
  const [gridRow, setGridRow] = useState("");
  const [hasCompletedTodos, setHasCompletedTodos] = useState(false);
  const [hasAwaitingTodos, setHasAwaitingTodos] = useState(false);
  const [showShadow, toggleShowShadow] = useState(false);
  const [shadowColor, setShadowColor] = useState("white");
  // change the span of task cards depending on their length
  const cardRef = useRef(null);
  useEffect(() => {
    if (cardRef.current) {
      const this_card = cardRef.current;
      const height = parseInt(getComputedStyle(this_card).height);
      const span_ratio = parseInt((height / 100).toString());
      setGridRow(`span ${span_ratio > 2 ? span_ratio - 1 : span_ratio}`);
    }
  }, [task, index]);

  useEffect(() => {
    let completed_todos = task.todos.filter(
      (todo) => todo.status === TodoStatus.DONE
    );
    let awaiting_todos = task.todos.filter(
      (todo) => todo.status === TodoStatus.AWAITING
    );
    completed_todos.length
      ? setHasCompletedTodos(true)
      : setHasCompletedTodos(false);
    awaiting_todos.length
      ? setHasAwaitingTodos(true)
      : setHasAwaitingTodos(false);
  }, [task.todos]);

  useEffect(() => {
    setShadowColor(() => {
      return hasCompletedTodos && hasAwaitingTodos
        ? "yellow" // yellow means some todos have been done
        : hasCompletedTodos
        ? "green" // gree means all todos have been finished
        : task.todos.length
        ? "red" // red means no todo has been done
        : "white"; // white means no todos
    });
  }, [hasAwaitingTodos, hasCompletedTodos]);

  return (
    <div
      className={`task-card ${magicStyle}`}
      ref={cardRef}
      key={index}
      style={{
        gridRow: gridRow,
        animationDuration: "350ms",
        boxShadow: showShadow ? `0 0.1em 0.5em ${shadowColor}` : "",
      }}
      onMouseEnter={() => toggleShowShadow(true)}
      onMouseLeave={() => toggleShowShadow(false)}
    >
      <h3>{task.name}</h3>
      <h6>
        {!!task.deadline ? new Date(task.deadline).toLocaleString() : null}
      </h6>
      <ul className="todos">
        {!!task.todos && !!task.todos.length ? (
          task.todos.map((todo, key) => {
            if (todo.status === TodoStatus.AWAITING) {
              return (
                <TodoComponent
                  todo={todo}
                  key={key}
                  index={key}
                  parent={index}
                />
              );
            }
          })
        ) : (
          <em>Click the edit icon to add a Todo</em>
        )}

        {hasCompletedTodos && <h5>Completed Todos: </h5>}
        {!!task.todos &&
          !!task.todos.length &&
          task.todos.map((todo, key) => {
            if (todo.status === TodoStatus.DONE) {
              return (
                <TodoComponent
                  todo={todo}
                  key={key}
                  index={key}
                  parent={index}
                />
              );
            }
            return null;
          })}
      </ul>
      <Form method="post" className="task-actions">
        <button
          type="submit"
          name="editTask"
          value={index}
          className="edit-task-btn"
        >
          <img src={EditSVG} alt="Edit task" loading="lazy" />
        </button>
        <button
          type="submit"
          name="deleteTask"
          value={index}
          className="delete-task-btn"
          onClick={() => {
            setMagicStyle("magictime holeOut");
            setTimeout(() => {
              setMagicStyle("magictime");
            }, 200);
            delete_action();
          }}
        >
          <img src={DeleteSVG} alt="Delete task" loading="lazy" />
        </button>
      </Form>
    </div>
  );
};

export default TaskCard;

const TodoComponent = ({
  todo,
  index,
  parent,
}: {
  todo: Todo;
  index: number;
  parent: number;
}) => {
  return (
    <li>
      <span>{todo.content}</span>
      <span>
        {todo.status === TodoStatus.AWAITING ? (
          <Form method="post">
            <button
              type="submit"
              name="markTodo"
              title="Mark as done"
              value={[parent.toString(), index.toString()]}
              className="mark-todo-done-btn"
            >
              <img src={DoneSVG} alt="Mark todo as done" loading="lazy" />
            </button>
          </Form>
        ) : null}
      </span>
    </li>
  );
};
