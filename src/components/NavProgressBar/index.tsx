"use client";
import React, { useEffect, useState } from "react";
import css from "./index.module.css";

const NavProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress < 100) {
      setProgress(progress + 10);
    }
  }, [progress]);

  return (
    <div className={css.nprogressbar}>
      <div className={css.nprogresspeg} style={{ width: `${progress}%` }}></div>
    </div>
  );
};

export default NavProgressBar;
