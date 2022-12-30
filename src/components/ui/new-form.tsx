import React, { useState, useRef } from "react";
import { Form, useNavigate } from "react-router-dom";

const NewForm = (props: NewFormProps) => {
  const navigate = useNavigate();
  const createBtnRef = useRef(null);

  function localHandleChange() {
    createBtnRef.current ? (createBtnRef.current.disabled = false) : null;
  }

  return (
    <Form
      className="new-project"
      method="post"
      onSubmit={() => {
        createBtnRef.current
          ? (createBtnRef.current.disabled = true)
          : null;
        props.nextAction ? props.nextAction() : null;
      }}
    >
      <input
        type="text"
        name="name"
        required={props.required?.name ? true : false}
        value={props.formValues.name}
        onChange={e => {
          props.handleChange(e);
          localHandleChange();
        }}
        placeholder={`${props.form_type} Title`}
        id="usr"
        className="form-control np-name"
      />
      <textarea
        name="description"
        placeholder={`${props.form_type} Description`}
        required={props.required?.description ? true : false}
        id="comment"
        className="form-control np-desc"
        value={props.formValues.description}
        onChange={e => {
          props.handleChange(e);
          localHandleChange();
        }}
      />
      <button
        name="action"
        value="new"
        type="submit"
        ref={createBtnRef}
        className="btn btn-primary"
      >
        Create
      </button>
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => {
          props.backAction ? props.backAction() : null;
          navigate(-1);
        }}
      >
        Cancel
      </button>
    </Form>
  );
};

export default NewForm;
