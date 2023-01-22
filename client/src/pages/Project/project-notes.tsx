import "@styles/project-notes.css";
import ActionButton from "@UIcomponents/action-button";
import ArrowLeft from "@images/arrow-back.svg";
import ArrowRight from "@images/arrow-forward.svg";
import { useRef, useState } from "react";

const ProjectNotes = () => {
  const [note, setNote] = useState("");
  const noteTextArea = useRef<HTMLTextAreaElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  function toggleOpen() {
    // when opening enable the textarea
    if (!isOpen && noteTextArea.current) {
      noteTextArea.current.disabled = false;
    }
    // when closing disable and blur the textarea
    else if (isOpen && noteTextArea.current) {
      noteTextArea.current.blur();
      noteTextArea.current.disabled = true;
    }
    setIsOpen(state => !state);
  }

  return (
    <article
      className="text-reset notes-container"
      style={{
        right: isOpen ? "-5px" : "-325px",
      }}
      onClick={() => {
        if (noteTextArea.current && isOpen) {
          noteTextArea.current.focus();
        }
      }}
    >
      <ActionButton
        type="button"
        icon_alt="open notes"
        icon={isOpen ? ArrowRight : ArrowLeft}
        title="Open Notes"
        islazy={true}
        onClick={toggleOpen}
      />
      <h5 className="fs-5 text-center m-0 pb-1">Notes</h5>
      <textarea
        ref={noteTextArea}
        value={note}
        onChange={({ target }) => setNote(target.value)}
      />
    </article>
  );
};

export default ProjectNotes;
