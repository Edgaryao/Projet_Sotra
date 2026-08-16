import { MapPin, Search } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Publication from "../components/Publication";
import Stories from "../components/Stories";

export default function exploration() {
  const [filtreActif, setFiltreActif] = useState("Toutes");
  const filtres = ["Toutes", "Récentes", "Urgent", "catégories"];
  const [text, setText] = useState("");
  const [breakLine, setbreakLigne] = useState(false);
  const [search, setSearch] = useState(false);

  return (
    <SafeAreaView className="flex-1  bg-light-background">
      {!search && (
        <View className="  flex-row justify-between p-4">
          <View className="flex-row ">
            <MapPin size={20} />
            <Text className="text-xl font-medium">cocody, Abidjan</Text>
          </View>
          <View className="flex-row gap-8">
            <Pressable onPress={() => setSearch(true)}>
              <Search size={35} />
            </Pressable>
          </View>
        </View>
      )}
      {search && (
        <View
          className={
            breakLine
              ? "flex-row mx-6 mb-4 pl-4 pr-3 border-gray-300 bg-white border-2 items-end p-1  rounded-3xl font-inter-semibold text-black"
              : "flex-row mx-6 mb-4 pl-4 pr-3 border-gray-300 bg-white border-2 items-center p-1  rounded-full font-inter-semibold text-black"
          }
        >
          <TextInput
            value={text}
            numberOfLines={4}
            autoFocus
            onBlur={() => setSearch(false)}
            maxLength={300}
            returnKeyType="send"
            // onSubmitEditing={sendMessage}
            multiline={true}
            onChangeText={(text) => {
              setText(text);

              setbreakLigne(text.length > 53);
            }}
            placeholder="Rechercher une alerte..."
            className=" flex-1 p-4 "
          />
          <View className=" p-2 rounded-full">
            <Pressable
              style={{
                opacity: text.length ? 1 : 0.5,
              }}
              disabled={text.length ? false : true}
              onPressIn={() => {
                // sendMessage();
                // setnewMessae(true);
              }}
            >
              <Search size={28} color="#000" />
            </Pressable>
          </View>
        </View>
      )}
      {/* titre alerte et filtre  */}

      <View className="border-b-2  border-gray-300">
        <Text className="font-semibold px-3 text-xl text-black  dark:text-dark-text py-1 ">
          Alertes
        </Text>
        <View className="mx-3 mb-2 flex-row gap-2 justify-evenly">
          {filtres.map((filtre) => {
            const actif = filtreActif === filtre;
            return (
              <Pressable
                key={filtre}
                onPress={() => setFiltreActif(filtre)}
                className={`px-4 py-2 rounded-full ${
                  actif ? "bg-red-600" : "bg-gray-200"
                }`}
              >
                <Text
                  className={`font-semibold ${actif ? "text-white" : "text-gray-700"}`}
                >
                  {filtre}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* card alerte */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingBottom: 20, flexGrow: 1 }}
        className="flex-1"
      >
        <View className="px-3 py-2 border-b-2 border-gray-300">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            <Stories
              imageSource={require("@/assets/images/pub.jpg")}
              profileImageSource={require("@/assets/images/police_secours.jpg")}
              title="Police secours"
            />
            <Stories
              imageSource={require("@/assets/images/pub_gend.jpg")}
              profileImageSource={require("@/assets/images/gendarmerie.jpg")}
              title="Gendarmerie"
            />
            <Stories
              imageSource={require("@/assets/images/pub_gspm.jpg")}
              profileImageSource={require("@/assets/images/gspm.jpg")}
              title="GSPM"
            />
            <Stories
              imageSource={require("@/assets/images/pub_police.jpg")}
              profileImageSource={require("@/assets/images/police.png")}
              title="POLICE"
            />
          </ScrollView>
        </View>
        <Publication
          nameInitial="EY"
          fullName="Edgar Yao"
          date="Aujourd'hui"
          time="14h30"
          title="Accident de la route"
          description="Collision entre 2 véhicules , Circulation bouché"
          image={require("@/assets/images/accident.jpg")}
          nb_confirmed="12,2K"
          nb_signaled={24}
        />
        <Publication
          nameInitial="EY"
          fullName="Edgar Yao"
          date="Aujourd'hui"
          time="14h30"
          title="Accident de la route"
          description="Collision entre 2 véhicules , Circulation bouché"
          image={require("@/assets/images/accident.jpg")}
          nb_confirmed="12,2K"
          nb_signaled={24}
        />
        <Publication
          nameInitial="EY"
          fullName="Edgar Yao"
          date="Aujourd'hui"
          time="14h30"
          title="Accident de la route"
          description="Collision entre 2 véhicules , Circulation bouché"
          image={require("@/assets/images/accident.jpg")}
          nb_confirmed="12,2K"
          nb_signaled={24}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
