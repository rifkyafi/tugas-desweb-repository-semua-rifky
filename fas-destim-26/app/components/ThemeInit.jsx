"use client";

import { useEffect } from "react";

export default function ThemeInit() {
  useEffect(() => {
    try {
      var simpan = localStorage.getItem("fas-theme");
      var malam;
      if (simpan === "day" || simpan === "night") {
        malam = simpan === "night";
      } else {
        var jam = new Date().getHours();
        malam = !(jam >= 6 && jam < 18);
      }
      document.documentElement.classList.toggle("dark", malam);
    } catch (e) {}
  }, []);

  return null;
}
