import React from "react";
import { ColorScheme } from "./lib";

const ColorSchemeContext = React.createContext<
  [ColorScheme, (colorScheme: ColorScheme) => unknown]
>(["light", (color) => color]);

export default ColorSchemeContext;
