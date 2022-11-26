import { useState, useRef } from "react";
import { Form, useNavigate } from "react-router-dom";
import { NewFormProps } from "../../types/new-form";

const NewForm = ({ form_type, nextAction, backAction }: NewFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const navigate = useNavigate();
  const createBtnRef = useRef(null);

  return (
    <Form className="new-project" method="post">
      <input
        type="text"
        name="name"
        value={title}
        onChange={({ target }) => setTitle(target.value)}
        placeholder={`${form_type} Title`}
        id="usr"
        className="form-control np-name"
      />
      <textarea
        name="description"
        placeholder={`${form_type} Description`}
        id="comment"
        className="form-control np-desc"
        value={description}
        onChange={({ target }) => setDesc(target.value)}
      />
      <button
        name="action"
        value="new"
        type="submit"
        ref={createBtnRef}
        className="btn btn-primary"
        onClick={() => {
          setTimeout(() => {
            createBtnRef.current
              ? (createBtnRef.current.disabled = true)
              : null;
          }, 50);
          nextAction ? nextAction() : null;
        }}
      >
        Create
      </button>
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => {
          backAction ? backAction() : null;
          navigate(-1);
        }}
      >
        Cancel
      </button>
    </Form>
  );
};

export default NewForm;
