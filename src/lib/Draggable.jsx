import React, { useCallback, useEffect, useRef } from "react";
import "Draggable.css";

function Draggable({ children, handleRef, onMove, x, y }) {
  const RefDrag = useRef(null);
  const initialX = useRef(0);
  const initialY = useRef(0);

  const onMouseMove = () => {};

  const onRemove = () => {};

  const onMouseDown = useCallback((event) => {
    const { left, top } = RefDrag.current.getBoundingClientRect();
    initialX = event.clientX - left;
    initialY = event.clientY - top;

    document.addEventListener("mousemove", onMouseMove);

    document.addEventListener("mouseup", onRemove);
    document.body.addEventListener("mouseleave", onRemove);
  }, []);

  useEffect(() => {
    const handle = handleRef.current;

    handle.addEventListener("mousedown", onMouseDown);

    return () => {
      handle.removeEventListener("mousedown", onMouseDown);
    };
  }, [handleRef, onMouseDown]);

  return (
    <div ref={RefDrag} className="draggable" style={{ transform: `translate(${0}px, ${0}px)` }}>
      {children}
    </div>
  );
}

export default Draggable;
