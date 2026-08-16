import { router } from "expo-router";
import { ThumbsUp } from "lucide-react-native";
import { useState } from "react";
import {
    Image,
    ImageSourcePropType,
    Pressable,
    Text,
    View,
} from "react-native";

type Publication = {
  nameInitial: string;
  fullName: string;
  date: string;
  time: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
  nb_confirmed: string;
  nb_signaled: number;
};
export default function Publication({
  nameInitial,
  fullName,
  date,
  time,
  title,
  description,
  image,
  nb_confirmed,
  nb_signaled,
}: Publication) {
  const [heConfirmedPublication, setHeConfirmedPublication] = useState(false);

  return (
    <View className="bg-gray-100 border-2 border-gray-300 mx-3 mt-2 rounded-lg overflow-hidden flex-1 shadow-lg">
      <View className="p-4">
        {/* cercle profil */}
        <View className="flex-row gap-4 items-center mb-4">
          <View className="bg-red-600 p-2 rounded-full">
            <Text className="text-white font-semibold text-2xl">
              {nameInitial}
            </Text>
          </View>
          {/* Nom et date */}
          <View className="flex-1">
            <Text className="text-xl font-semibold">{fullName} </Text>
            <Text>
              {date} à {time}{" "}
            </Text>
          </View>
        </View>
        {/* Titre et description  */}
        <View className="mb-4">
          <Text className="font-semibold text-2xl mb-2">{title}</Text>
          <Text className="text-gray-800 text-xl">{description}</Text>
        </View>
      </View>
      {/* Image */}
      <Image source={image} className="w-full h-48" resizeMode="cover" />

      <View className="p-4">
        {/* Bouton  */}
        <View className="flex-row justify-between">
          <Pressable
            onPress={() => setHeConfirmedPublication(!heConfirmedPublication)}
            className="flex-row gap-2 items-center text-white p-2 rounded-lg"
          >
            <ThumbsUp
              color={heConfirmedPublication ? "blue" : "black"}
              // fill={isConfirmed ? "blue" : "white"}
            />
            {heConfirmedPublication ? (
              <Text className="text-blue-600 font-semibold">{""} Confirmé</Text>
            ) : (
              <Text className="font-semibold">Je confirme</Text>
            )}
          </Pressable>
          <Pressable
            onPress={() => {
              router.push("/accident_details");
            }}
            className="bg-gray-300 text-gray-700 w-1/4 p-2 rounded-lg"
          >
            <Text className="font-semibold text-center">Details</Text>
          </Pressable>
        </View>
        <View className="flex-row justify-between mt-4">
          <Text className="text-gray-500 ml-4 font-semibold">
            {nb_confirmed} confirmation(s)
          </Text>
          <Text className="text-gray-500 ml-4 font-semibold">
            {nb_signaled} signalement(s)
          </Text>
        </View>
      </View>
    </View>
  );
}
