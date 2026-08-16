import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  Text,
  View,
} from "react-native";
type StoriesProps = {
  imageSource: ImageSourcePropType;
  profileImageSource: ImageSourcePropType;
  title: string;
};
export default function Stories({
  imageSource,
  profileImageSource,
  title,
}: StoriesProps) {
  return (
    <ImageBackground
      resizeMode="cover"
      source={imageSource}
      className="w-[120px] h-[150px] border-2 border-gray-400 rounded-lg overflow-hidden"
    >
      <Image
        source={profileImageSource}
        className="w-[50px] h-[50px] border-4 border-blue-600 rounded-full overflow-hidden"
      />
      <View className="bg-black/60 absolute bottom-0  p-1 w-full">
        <Text className="self-start text-xl font-semibold text-white text-center">
          {title}
        </Text>
      </View>
    </ImageBackground>
  );
}
