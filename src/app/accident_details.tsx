import { BlurView } from "expo-blur";
import { router } from "expo-router";
import {
  ArrowLeft,
  CircleCheck,
  ClockFading,
  Loader,
  MapPin,
  ThumbsUp,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const index = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [heConfirmed, setHeConfirmed] = useState(false);
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <View className="flex-1 bg-light-background  dark:bg-dark-background">
      {/* Image de description  */}
      <ImageBackground
        source={require("@/assets/images/acident.jpg")}
        resizeMode="cover"
        className="flex-1"
      >
        {/* Icone du retour  */}
        <View className="flex-1 justify-between p-4 pt-12">
          <View className="flex-row items-start justify-between">
            <View className="ml-1 rounded-full overflow-hidden">
              <BlurView intensity={20} tint="light">
                <Pressable
                  style={{
                    opacity: isPressed ? 0.4 : 1,
                  }}
                  onPressIn={() => {
                    setIsPressed(true);
                    router.back();
                  }}
                  onPressOut={() => setIsPressed(false)}
                >
                  <ArrowLeft strokeWidth={1} size={45} color="#fff" />
                </Pressable>
              </BlurView>
            </View>
          </View>
        </View>
        {/* statut du sinalement  */}
        <View className="self-start bg-green-800 px-4 py-2 rounded-xl ml-10">
          <Text className="text-white">Résolu</Text>
        </View>
      </ImageBackground>
      {/* description  */}
      <View className="flex-1/2 m-4">
        <Text className="font-bold text-3xl mb-2 dark:text-dark-text">
          Accident de la route{" "}
        </Text>
        <Text className="mb-2 dark:text-dark-text">Signalé par 10 personne(s), confirmé par 3 personne(s)</Text>
        <View className="flex-row items-center gap-2">
          <MapPin size={15} color={"#6b7280"} />
          <Text className=" dark:text-dark-text">
            Rivera 3 , Bd de Marseille , Cocody
          </Text>
        </View>
        <View className="flex-row items-center gap-2 dark:text-dark-text">
          <ClockFading size={15} color={"#6b7280"} />
          <Text className="dark:text-dark-text">Il y'a 8 min • 1,1km</Text>
        </View>
        <Text className="font-medium text-xl mt-6 dark:text-dark-text">
          Collision entre deux véhicules légers. Circulation bouchée
        </Text>
      </View>
      {/* image  */}
      <View className="px-5 py-4 flex-2">
        <Text className="font-normal text-xl mb-3 dark:text-dark-text">Médias</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          <Image
            source={require("@/assets/images/acident.jpg")}
            className="w-[100px] h-[100px] border border-gray-300 rounded-xl"
          />
          <Image
            source={require("@/assets/images/acident.jpg")}
            className="w-[100px] h-[100px] border border-gray-300 rounded-xl"
          />
          <Image
            source={require("@/assets/images/acident.jpg")}
            className="w-[100px] h-[100px] border border-gray-300 rounded-xl"
          />
          <Image
            source={require("@/assets/images/acident.jpg")}
            className="w-[100px] h-[100px] border border-gray-300 rounded-xl"
          />
          <Image
            source={require("@/assets/images/acident.jpg")}
            className="w-[100px] h-[100px] border border-gray-300 rounded-xl"
          />
        </ScrollView>
      </View>
      {/* satut du signalement  */}
      <View className="flex-1 mb-12">
        <Text className="text-xl font-semibold m-4 dark:text-dark-text">Statut</Text>
        {/* barre  */}
        <View className="flex-row flex-1">
          <View className="w-10 flex-col  gap-8 ml-6">
            <CircleCheck color={"white"} fill={"green"} />
            <Loader color={"#9ca3af"} />
            <Loader color={"#9ca3af"} />
            <Loader color={"#9ca3af"} />
          </View>
          {/* etat  */}
          <View className="flex-1 gap-2">
            <View>
              <Text className="text-xl font-medium dark:text-dark-text">Signalé</Text>
              <Text className="dark:text-dark-text">Aujourd'hui ,11:30 </Text>
            </View>
            <View>
              <Text className="text-xl font-medium dark:text-dark-text">
                En cours de Traitement
              </Text>
              <Text className="dark:text-dark-text">Aujourd'hui ,11:40 </Text>
            </View>
            <View>
              <Text className="text-xl font-medium dark:text-dark-text">Intervention en route</Text>
              <Text className="dark:text-dark-text">Aujourd'hui ,11:50 </Text>
            </View>
            <View>
              <Text className="text-xl font-medium dark:text-dark-text">Incident Résolu</Text>
              <Text className="dark:text-dark-text">Aujourd'hui ,12:50 </Text>
            </View>
          </View>
        </View>
      </View>
      {/* confirmation  */}
      <View className=" flex-row justify-end">
        <Pressable
          onPressIn={() => setHeConfirmed(!heConfirmed)}
          onPressOut={toggleColorScheme}
        >
          {heConfirmed ? (
            <View className="  self-start rounded-xl flex-row gap-2 bg-light-btn mx-10 mb-6 p-4">
              <ThumbsUp color={"green"} fill={"#fff"} />
              <Text className="text-white text-xl">Alerte confirmée </Text>
            </View>
          ) : (
            <View className="  self-start rounded-xl flex-row gap-2 bg-light-btn mx-10 mb-6 p-4">
              <ThumbsUp color={"white"} />
              <Text className="text-white text-xl">
                Je confirme cette alerte{" "}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default index;
