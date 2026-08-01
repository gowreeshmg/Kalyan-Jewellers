import React, { useState, useRef, useEffect, useId, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import "../index.css";

function GooeyFilter({ filterId, blur }) {
  return (
    <svg className="gooey-filter-svg" aria-hidden style={{ position: 'absolute', width: 0, height: 0, display: 'none' }}>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}

function SearchIcon({ layoutId }) {
  return (
    <motion.svg
      layoutId={layoutId}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      style={{ width: '16px', height: '16px', flexShrink: 0 }}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </motion.svg>
  );
}

const transition = {
  duration: 0.4,
  type: "spring",
  bounce: 0.25,
};

const iconBubbleVariants = {
  collapsed: { scale: 0, opacity: 0 },
  expanded: { scale: 1, opacity: 1 },
};

export default function GooeyInput({
  placeholder = "Search collections...",
  collapsedWidth = 115,
  expandedWidth = 250,
  expandedOffset = 50,
  gooeyBlur = 5,
  value,
  defaultValue = "",
  onValueChange,
  onOpenChange,
  disabled = false,
}) {
  const reactId = useId();
  const safeId = reactId.replace(/:/g, "");
  const filterId = `gooey-filter-${safeId}`;
  const iconLayoutId = `gooey-input-icon-${safeId}`;
  const inputLayoutId = `gooey-input-field-${safeId}`;

  const inputRef = useRef(null);
  const prevExpandedRef = useRef(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const isControlled = value !== undefined;
  const searchText = isControlled ? value : uncontrolledValue;

  const setSearchText = useCallback(
    (next) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  const setExpanded = useCallback(
    (next) => {
      setIsExpanded(next);
      onOpenChange?.(next);
    },
    [onOpenChange]
  );

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    } else if (prevExpandedRef.current) {
      setSearchText("");
    }
    prevExpandedRef.current = isExpanded;
  }, [isExpanded, setSearchText]);

  const buttonVariants = useMemo(
    () => ({
      collapsed: { width: collapsedWidth, marginLeft: 0 },
      expanded: { width: expandedWidth, marginLeft: expandedOffset },
    }),
    [collapsedWidth, expandedWidth, expandedOffset]
  );

  const handleExpand = useCallback(() => {
    if (!disabled) setExpanded(true);
  }, [disabled, setExpanded]);

  const handleChange = useCallback(
    (e) => {
      setSearchText(e.target.value);
    },
    [setSearchText]
  );

  const handleBlur = useCallback(() => {
    if (!searchText) setExpanded(false);
  }, [searchText, setExpanded]);

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <GooeyFilter filterId={filterId} blur={gooeyBlur} />

      <div
        style={{ position: 'relative', display: 'flex', height: '40px', alignItems: 'center', justifyContent: 'center', filter: `url(#${filterId})` }}
      >
        <motion.div
          style={{ display: 'flex', height: '40px', alignItems: 'center', justifyContent: 'center' }}
          variants={buttonVariants}
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          transition={transition}
        >
          <button
            type="button"
            disabled={disabled}
            onClick={handleExpand}
            className="gooey-trigger"
          >
            {!isExpanded ? (
              <SearchIcon layoutId={iconLayoutId} />
            ) : null}
            <motion.input
              layoutId={inputLayoutId}
              ref={inputRef}
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              value={searchText}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={disabled || !isExpanded}
              placeholder={placeholder}
              className={`gooey-input ${isExpanded ? "expanded" : ""}`}
            />
          </button>
        </motion.div>

        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
          <motion.div
            style={{ display: 'flex', width: '40px', height: '40px', alignItems: 'center', justifyContent: 'center' }}
            variants={iconBubbleVariants}
            initial="collapsed"
            animate={isExpanded ? "expanded" : "collapsed"}
            transition={transition}
          >
            <div className="gooey-bubble-surface">
              <SearchIcon layoutId={iconLayoutId} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
