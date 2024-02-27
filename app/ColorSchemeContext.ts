import React from "react";
import { ColorScheme } from "./lib";

const ColorSchemeContext = React.createContext<
  [ColorScheme, "light" | "dark", (colorScheme: ColorScheme) => unknown]
>(["light", "light", (color) => color]);

export default ColorSchemeContext;
