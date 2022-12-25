import React, { useState, useRef } from "react";
import { Form, useNavigate } from "react-router-dom";

const NewForm = ({
  form_type,
  required,
  nextAction,
  backAction,
}: NewFormProps) => {
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
  });
  const navigate = useNavigate();
  const createBtnRef = useRef(null);

  function handleChange({
    target,
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormValues(state => ({
      ...state,
      [target.name]: target.value,
    }));
    createBtnRef.current ? (createBtnRef.current.disabled = false) : null;
  }

  return (
    <Form
      className="new-project"
      method="post"
    >
      <input
        type="text"
        name="name"
        required={required?.name ? true : false}
        value={formValues.name}
        onChange={handleChange}
        placeholder={`${form_type} Title`}
        id="usr"
        className="form-control np-name"
      />
      <textarea
        name="description"
        placeholder={`${form_type} Description`}
        required={required?.description ? true : false}
        id="comment"
        className="form-control np-desc"
        value={formValues.description}
        onChange={handleChange}
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
