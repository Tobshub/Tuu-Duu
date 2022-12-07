import { useEffect, useRef, useState } from "react";
import { Form } from "react-router-dom";
import Project, { Task, Todo, TodoStatus } from "../../types/project";
import EditSVG from "../../images/Edit.svg";
import DoneSVG from "../../images/Checkmark.svg";
import DeleteSVG from "../../images/Delete.svg";
import ActionButton from "../components/action-button";
import { editProject } from "../../operations/projects";

const TaskCard = ({
  project,
  task,
  index,
  show_notification,
  deleteFunction,
}: {
  project: Project;
  task: Task;
  index: number;
  show_notification: () => void;
  deleteFunction: () => void;
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
        boxShadow: showShadow ? `0 0 0.6em 0.1em ${shadowColor}` : "",
      }}
      onMouseEnter={() => toggleShowShadow(true)}
      onMouseLeave={() => toggleShowShadow(false)}
    >
      <h4>{task.name}</h4>
      <h6>
        {!!task.deadline ? new Date(task.deadline).toLocaleString() : null}
      </h6>
      <ul className="todos">
        {!!task.todos && !!task.todos.length ? (
          task.todos.map((todo, key) => {
            if (todo.status === TodoStatus.AWAITING) {
              return (
                <TodoComponent
                  project={project}
                  todo={todo}
                  key={key}
                  index={key}
                  parent={index}
                  markTodoFn={() => setHasCompletedTodos(true)}
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
        <ActionButton
          name="editTask"
          title="Edit task"
          value={index}
          className="edit-task-btn"
          icon={EditSVG}
          icon_alt="Edit task"
          islazy={true}
        />
        <ActionButton
          type="button"
          name="deleteTask"
          title="Delete task"
          value={index}
          className="delete-task-btn"
          onClick={() => {
            setMagicStyle("magictime holeOut");
            setTimeout(() => {
              setMagicStyle("magictime");
            }, 200);
            show_notification();
            deleteFunction();
          }}
          icon={DeleteSVG}
          icon_alt="Delete task"
          islazy={true}
        />
      </Form>
    </div>
  );
};

export default TaskCard;

const TodoComponent = ({
  todo,
  index,
  parent,
  project,
  markTodoFn,
}: {
  todo: Todo;
  index: number;
  parent: number;
  project?: Project;
  markTodoFn?: () => void;
}) => {
  return (
    <li>
      <span>{todo.content}</span>
      <span>
        {todo.status === TodoStatus.AWAITING ? (
          <ActionButton
            name="markTodo"
            title="Mark as done"
            className="mark-todo-done-btn"
            icon={DoneSVG}
            icon_alt="Mark as done"
            islazy={true}
            style={{ width: "18px" }}
            onClick={() => {
              project.tasks[parent].todos[index].status = TodoStatus.DONE;
              editProject(project);
              markTodoFn();
            }}
          />
        ) : null}
      </span>
    </li>
  );
};
