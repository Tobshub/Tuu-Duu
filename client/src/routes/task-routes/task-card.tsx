import { useEffect, useState } from "react";
import { Form } from "react-router-dom";
import { Task, Todo, TodoStatus } from "../../types/project";
import EditSVG from "../../images/Edit.svg";
import DoneSVG from "../../images/Checkmark.svg";
import DeleteSVG from "../../images/Delete.svg";

const TaskCard = ({ task, index }: { task: Task; index: number }) => {
  const [magicStyle, setMagicStyle] = useState("magictime swashIn");
  const [gridRow, setGridRow] = useState("");
  const [hasCompletedTodos, setHasCompletedTodos] = useState(false);
  // change the span of task cards depending on their length
  useEffect(() => {
    const this_card = document.querySelectorAll(".task-card")[index];
    const height = parseInt(getComputedStyle(this_card).height);
    const span_ratio = parseInt((height / 100).toString());
    setGridRow(`span ${span_ratio > 2 ? span_ratio - 1 : span_ratio}`);
  }, [task, index]);

  useEffect(() => {
    let completed_todos = task.todos.filter(
      (todo) => todo.status === TodoStatus.DONE
    );
    completed_todos.length
      ? setHasCompletedTodos(true)
      : setHasCompletedTodos(false);
  }, [task.todos]);

  return (
    <div
      className={`task-card ${magicStyle}`}
      key={index}
      style={{
        gridRow: gridRow,
        animationDuration: "350ms",
      }}
    >
      <h2>{task.name}</h2>
      <div>{task.deadline?.toLocaleString()}</div>
      <ul className="todos">
        {task.todos && task.todos.length ? (
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
          <em>No awaiting Todos.</em>
        )}

        {hasCompletedTodos && <h5>Completed Todos: </h5>}
        {task.todos && task.todos.length ? (
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
          })
        ) : (
          <></>
        )}
      </ul>
      <Form method="post" className="task-actions">
        <button
          type="submit"
          name="editTask"
          value={index}
          className="edit-task-btn"
        >
          <img src={EditSVG} alt="Edit task" />
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
          }}
        >
          <img src={DeleteSVG} alt="Delete task" />
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
              <img src={DoneSVG} alt="Mark todo as done" />
            </button>
          </Form>
        ) : null}
      </span>
    </li>
  );
};
