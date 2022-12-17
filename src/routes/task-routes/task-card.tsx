import { useEffect, useMemo, useRef, useState } from "react";
import { Form } from "react-router-dom";
import Project, { Task, TaskStatus, Todo, TodoStatus } from "../../types/project";
import EditSVG from "../../images/Edit.svg";
import DoneSVG from "../../images/Checkmark.svg";
import DeleteSVG from "../../images/Delete.svg";
import ActionButton from "../components/action-button";
import { editProject } from "../../operations/projects";
import { setTaskStatus } from "../../operations/tasks";

const TaskCard = ({
  project,
  task,
  index,
  deleteFunction,
}: {
  project: Project;
  task: Task;
  index: number;
  deleteFunction: () => void;
}) => {
  const [gridRow, setGridRow] = useState("");
  const [showShadow, toggleShowShadow] = useState(false);
  const [shadowColor, setShadowColor] = useState("white");
  // change the span of task cards depending on their length
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (cardRef.current) {
      const this_card = cardRef.current;
      const height = parseInt(getComputedStyle(this_card).height);
      const span_ratio = parseInt((height / 100).toString());
      setGridRow(`span ${span_ratio > 2 ? span_ratio - 1 : span_ratio}`);
    }
  }, [task, index]);


  useEffect(() => {
    setShadowColor(() => {
      return task.status === TaskStatus.IN_PROGRESS
        ? "yellow" // yellow means some todos have been done
        : task.status === TaskStatus.COMPLETE
          ? "green" // gree means all todos have been finished
          : task.todos.length && task.status === TaskStatus.IDLE
            ? "red" // red means no todo has been done
            : "white"; // white means no todos
    });
  }, [task.status]);


  async function markTodo(todoIndex: number) {
    project.tasks[index].todos[todoIndex].status = TodoStatus.DONE;
    task.status = setTaskStatus(task);
    project.tasks[index] = task;
    editProject(project);
    toggleShowShadow(false);
  }

  return (
    <div
      className={`task-card`}
      ref={cardRef}
      key={index}
      style={{
        gridRow: gridRow,
        animationDuration: "200ms",
        boxShadow: showShadow ? `0 0 0.6em 0.1em ${shadowColor}` : "",
      }}
      onMouseEnter={() => toggleShowShadow(true)}
      onMouseLeave={() => toggleShowShadow(false)}
    >
      <h5>{task.name}</h5>
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
                  markTodoFn={() => markTodo(key)}
                />
              );
            }
          })
        ) : (
          <em>Click the edit icon to add a Todo</em>
        )}

        {task.status !== TaskStatus.IDLE && <em>Completed Todos: </em>}
        {!!task.todos &&
          !!task.todos.length &&
          task.todos.map((todo, key) => {
            if (todo.status === TodoStatus.DONE) {
              return (
                <TodoComponent
                  todo={todo}
                  key={key}
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
  markTodoFn,
}: {
  todo: Todo;
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
              todo.status === TodoStatus.DONE;
              markTodoFn ? markTodoFn() : null;
            }}
          />
        ) : null}
      </span>
    </li>
  );
};
