import { useEffect, useRef, useState } from "react";
import { Form } from "react-router-dom";
import EditSVG from "@images/Edit.svg";
import DoneSVG from "@images/Checkmark.svg";
import DeleteSVG from "@images/Delete.svg";
import ActionButton from "@UIcomponents/action-button";
import { editProject } from "@services/projects";
import { setTaskStatus } from "@services/tasks";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

const TaskCard = ({
  project,
  task,
  deleteFunction,
}: {
  project: Project;
  task: Task;
  deleteFunction: () => void;
}) => {
  const [magicStyle, setMagicStyle] = useState("magictime swashIn");
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
  }, [task.todos]);

  useEffect(() => {
    setShadowColor(() => {
      return task.status === "in progess"
        ? "yellow" // yellow means some todos have been done
        : task.status === "completed"
        ? "green" // gree means all todos have been finished
        : task.todos.length
        ? "red" // red means no todo has been done
        : "white"; // white means no todos
    });
  }, [task.status]);

  const projectQueryClient = useQueryClient();

  async function markTodo(todoIndex: number) {
    task.todos[todoIndex].status = "completed";
    task.status = setTaskStatus(task);
    project.tasks[
      project.tasks.findIndex(prevTask => prevTask.id === task.id)
    ] = task;
    await editProject(project).then(res => {
      if (res) {
        projectQueryClient.setQueryData("projects", res);
      }
    });
    toggleShowShadow(false);
  }

  return (
    <div
      className={`task-card ${magicStyle}`}
      ref={cardRef}
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
            if (todo.status === "awaiting") {
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

        {task.status !== "idle" && <em>Completed Todos: </em>}
        {!!task.todos &&
          !!task.todos.length &&
          task.todos.map((todo, key) => {
            if (todo.status === "completed") {
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
      <Form
        method="post"
        className="task-actions"
      >
        <ActionButton
          name="editTask"
          title="Edit task"
          value={task.id}
          className="edit-task-btn"
          icon={EditSVG}
          icon_alt="Edit task"
          islazy={true}
        />
        <ActionButton
          type="button"
          name="deleteTask"
          title="Delete task"
          className="delete-task-btn"
          onClick={() => {
            setMagicStyle("magictime holeout");
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
        {todo.status === "awaiting" ? (
          <ActionButton
            name="markTodo"
            title="Mark as done"
            className="mark-todo-done-btn"
            icon={DoneSVG}
            icon_alt="Mark as done"
            islazy={true}
            style={{ width: "18px" }}
            onClick={() => {
              todo.status === "completed";
              markTodoFn ? markTodoFn() : null;
            }}
          />
        ) : null}
      </span>
    </li>
  );
};
