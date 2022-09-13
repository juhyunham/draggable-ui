import React, { useCallback, useMemo, useEffect, useRef, useState } from "react";
import "./Draggable.css";
import { debounce } from "lodash";

function Draggable({
  children,
  handleRef,
  onMove,
  x,
  y
}) {
  const RefDrag = useRef(null);
  const initialX = useRef(0);
  const initialY = useRef(0);
  const [position, setPosition] = useState({
    x,
    y
  });
  const Move = useMemo(() => debounce((x, y) => onMove(x, y), 500), [onMove]);
  const onMouseMove = useCallback(event => {
    setPosition({
      x: event.clientX - initialX.current,
      y: event.clientY - initialY.current
    });
    Move(event.clientX - initialX.current, event.clientY - initialY.current);
  }, [Move]);
  const onRemove = useCallback(() => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onRemove);
    document.body.removeEventListener("mouseleave", onRemove);
  }, [onMouseMove]);
  const onMouseDown = useCallback(event => {
    const {
      left,
      top
    } = RefDrag.current.getBoundingClientRect();
    initialX.current = event.clientX - left;
    initialY.current = event.clientY - top;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onRemove);
    document.body.addEventListener("mouseleave", onRemove);
  }, [onMouseMove, onRemove]);
  useEffect(() => {
    const handle = handleRef.current;
    handle.addEventListener("mousedown", onMouseDown);
    return () => {
      handle.removeEventListener("mousedown", onMouseDown);
      Move.cancel();
    };
  }, [handleRef, onMouseDown, Move]);
  return /*#__PURE__*/React.createElement("div", {
    ref: RefDrag,
    className: "draggable",
    style: {
      transform: `translate(${position.x}px, ${position.y}px)`
    }
  }, children);
}

export default Draggable;