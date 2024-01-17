import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";
import randomColor from "randomcolor";
import ColorSchemeContext from "../ColorSchemeContext";

type Props = {
  title: string;
};

const LetterIcon: React.FC<Props> = ({ title }) => {
  const [colorScheme] = React.useContext(ColorSchemeContext);
  const bgColor = randomColor({
    format: "rgb",
    luminosity: colorScheme === "dark" ? "dark" : "bright",
    seed: title.split("")[0],
  });
  const rgbValues = bgColor.match(/\d+/g)?.map((value) => parseInt(value));
  console.log(bgColor);

  // Ensure we have three valid RGB values
  if (!rgbValues) {
    throw new Error("Invalid RGB background color format");
  }

  // Calculate the luminance of the background color using the RGB values
  const luminance =
    0.299 * rgbValues[0] + 0.587 * rgbValues[1] + 0.114 * rgbValues[2];

  // Determine the contrast ratios between the background color and black and white text
  const contrastRatioBlack = (luminance + 0.05) / 0.05;
  const contrastRatioWhite = (1.0 - luminance + 0.05) / 0.05;

  const textColor =
    contrastRatioBlack > contrastRatioWhite ? "zinc-900" : "zinc-50";

  console.log(
    "tw:",
    tw`bg-[${bgColor}] rounded-full flex justify-center items-center p-1 w-7 h-7 text-${textColor}`
  );
  return (
    <View
      style={tw`bg-[${bgColor}] rounded-full flex justify-center items-center p-1 w-7 h-7 text-${textColor}`}
    >
      <Text>{title.split("")[0]}</Text>
    </View>
  );
};

export default LetterIcon;
