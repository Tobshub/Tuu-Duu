import { useEffect, useRef, useState } from "react";
import { Form } from "react-router-dom";
import EditSVG from "@images/Edit.svg";
import EditPenSVG from "@images/EditPen.svg";
import DoneSVG from "@images/Checkmark.svg";
import DeleteSVG from "@images/Delete.svg";
import CloseSVG from "@images/Close.svg";
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
  const [showShadow, toggleShowShadow] = useState(true);
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

  function changeShadowColor() {
    setShadowColor(() => {
      return task.status === "in progess"
        ? "yellow" // yellow means some todos have been done
        : task.status === "completed"
        ? "green" // gree means all todos have been finished
        : task.todos.length
        ? "red" // red means no todo has been done
        : "white"; // white means no todos
    });
  }
  useEffect(() => {
    changeShadowColor();
  }, [task.status]);

  const projectQueryClient = useQueryClient();

  async function editAndSet(project: Project) {
    const val = await editProject(project).then(res => {
      if (res) {
        projectQueryClient.setQueryData("projects", res);
      }
      changeShadowColor();
      return res;
    });

    return val ? val : [];
  }

  async function markTodo(todoIndex: number) {
    task.todos[todoIndex].status = "completed";
    task.status = setTaskStatus(task);
    project.tasks[
      project.tasks.findIndex(prevTask => prevTask.id === task.id)
    ] = task;
    editAndSet(project);
  }

  async function editTodo(todoIndex: number, content: string) {
    task.todos[todoIndex].content = content;
    project.tasks[
      project.tasks.findIndex(prevTask => prevTask.id === task.id)
    ] = task;
    editAndSet(project);
  }

  async function unMarkTodoFn(todoIndex: number) {
    task.todos[todoIndex].status = "awaiting";
    task.status = setTaskStatus(task);
    project.tasks[
      project.tasks.findIndex(prevTask => prevTask.id === task.id)
    ] = task;
    editAndSet(project);
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
      onMouseEnter={() => toggleShowShadow(false)}
      onMouseLeave={() => toggleShowShadow(true)}
    >
      <p className="h5">{task.name}</p>
      <h6
        className="text-muted"
        style={{
          fontSize: ".95rem",
        }}
      >
        {task.deadline
          ? `Deadline: ${new Date(task.deadline).toDateString()}`
          : null}
      </h6>
      <ul className="todos">
        {task.todos && task.todos.length ? (
          task.todos.map((todo, key) => {
            if (todo.status === "awaiting") {
              return (
                <TodoComponent
                  todo={todo}
                  key={key}
                  markTodoFn={() => markTodo(key)}
                  editTodoFn={(content: string) => editTodo(key, content)}
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
                  unMarkTodoFn={() => unMarkTodoFn(key)}
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
  editTodoFn,
  unMarkTodoFn,
}: {
  todo: Todo;
  markTodoFn?: () => void;
  editTodoFn?: (content: string) => Promise<void>;
  unMarkTodoFn?: () => void;
}) => {
  const [editMode, setEditMode] = useState(false);
  const [hoverState, setHoverState] = useState(false);

  if (editMode && editTodoFn) {
    return (
      <EditTodoComponent
        todo={todo}
        cancel={() => setEditMode(false)}
        confirm={editTodoFn}
      />
    );
  }
  return (
    <li
      style={{
        boxShadow: hoverState
          ? `0 0 0.5em ${todo.status === "awaiting" ? "red" : "green"}`
          : "",
        cursor: "default",
      }}
      onMouseOver={() => setHoverState(true)}
      onMouseOut={() => setHoverState(false)}
    >
      <span>{todo.content}</span>
      <span className="d-inline-flex align-items-center">
        {todo.status === "awaiting" ? (
          <>
            <ActionButton
              className="todo-icon"
              icon={EditPenSVG}
              icon_alt="edit todo"
              islazy={true}
              title="edit todo"
              onClick={() => setEditMode(true)}
            />
            <ActionButton
              name="markTodo"
              className="todo-icon"
              title="Done"
              icon={DoneSVG}
              icon_alt="Done"
              islazy={true}
              onClick={() => {
                todo.status = "completed";
                markTodoFn ? markTodoFn() : null;
              }}
            />
          </>
        ) : (
          <>
            <ActionButton
              className="todo-icon"
              title="Not done"
              icon={CloseSVG}
              icon_alt="Not done"
              islazy={true}
              onClick={() => {
                todo.status = "awaiting";
                unMarkTodoFn ? unMarkTodoFn() : null;
              }}
            />
          </>
        )}
      </span>
    </li>
  );
};

const EditTodoComponent = ({
  todo,
  cancel,
  confirm,
}: {
  todo: Todo;
  cancel: () => void;
  confirm: (content: string) => Promise<void>;
}) => {
  const [todoContent, setTodoContent] = useState(todo.content);

  return (
    <div className="d-flex flex-column gap-1">
      <input
        className="form-control"
        value={todoContent}
        onChange={({ target }) => setTodoContent(target.value)}
      />
      <span className="d-flex gap-2">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => confirm(todoContent).then(() => cancel())}
        >
          Confirm
        </button>
        <button className="btn btn-danger btn-sm" onClick={cancel}>
          Cancel
        </button>
      </span>
    </div>
  );
};
