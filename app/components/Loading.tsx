import { Loader2 } from "lucide-react-native";
import { Animated, SafeAreaView } from "react-native";
import tw from "twrnc";
import { spin } from "../animation";

const Loading: React.FC = () => {
  return (
    <SafeAreaView
      style={tw`bg-white dark:bg-zinc-900 items-center justify-center flex grow p-1 gap-2`}
    >
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Loader2 size={40} color={"lightgray"} />
      </Animated.View>
    </SafeAreaView>
  );
};

export default Loading;
