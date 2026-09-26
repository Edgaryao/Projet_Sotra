import { ChevronRight } from "lucide-react-native";
import { Image, ImageSourcePropType, Text, View } from "react-native";

type CourseCardProps = {
  readonly image: ImageSourcePropType;
  readonly titre: string;
  readonly lecon: string;
};

const CourseCard = ({ image, titre, lecon }: CourseCardProps) => {
  return (
    <View className="h-[120px] w-full flex-row overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <Image source={image} className="h-full w-[120px]" resizeMode="cover" />
      <View className="min-w-0 flex-1 justify-center p-3">
        <Text className="text-2xl font-bold text-black" numberOfLines={2}>
          {titre}
        </Text>
        <Text className="mt-1 text-gray-500" numberOfLines={2}>
          {lecon}
        </Text>
      </View>
      <View className="w-12 items-center justify-center">
        <ChevronRight size={24} color="#4b5563" />
      </View>
    </View>
  );
};

export default CourseCard;
