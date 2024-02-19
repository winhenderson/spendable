import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";
import randomColor from "randomcolor";
import ColorSchemeContext from "../ColorSchemeContext";

type Props = {
  title: string;
  colorOverride?: string;
  blurred?: boolean;
};

const LetterIcon: React.FC<Props> = ({
  title,
  colorOverride,
  blurred = false,
}) => {
  const [colorScheme] = React.useContext(ColorSchemeContext);
  const bgColor =
    colorOverride ??
    randomColor({
      luminosity: colorScheme === "dark" ? "dark" : "bright",
      seed: title.split("")[0],
    });

  const textColor = getContrast(bgColor);

  return (
    <View
      style={tw`bg-[${bgColor}]${
        blurred ? "/50" : ""
      } rounded-full flex justify-center items-center p-1 w-7 h-7`}
    >
      <Text style={tw`text-${textColor}${blurred ? "/50" : ""} font-semibold`}>
        {title.split("")[0]}
      </Text>
    </View>
  );
};

function getContrast(hexcolor: string) {
  if (hexcolor.slice(0, 1) === "#") {
    hexcolor = hexcolor.slice(1);
  }

  if (hexcolor.length === 3) {
    hexcolor = hexcolor
      .split("")
      .map(function (hex) {
        return hex + hex;
      })
      .join("");
  }

  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? "zinc-900" : "zinc-50";
}

export default LetterIcon;
