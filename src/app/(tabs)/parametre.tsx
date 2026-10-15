import { ScrollView, Text, View } from "react-native";
import Return from "../components/Return";
export default function Parametre() {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center gap-4 px-5 pb-4 pt-12">
        <Return size={28} />
        <Text className="flex-1 text-2xl font-bold text-green-900">
          Conditions d’utilisation
        </Text>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
      >
        <Text className="mb-6 text-sm text-gray-500">
          Dernière mise à jour : septembre 2026
        </Text>
        <Text className="mb-2 text-lg font-bold text-green-900">
          Bienvenue sur SOTRA GO
        </Text>
        <Text className="mb-6 text-base leading-6 text-gray-800">
          SOTRA GO est une application destinée à faciliter la consultation des
          lignes, parcours et arrêts de bus à Abidjan.
        </Text>
        <Text className="mb-2 text-lg font-bold text-green-900">
          1. Utilisation de l’application
        </Text>
        <Text className="mb-2 text-base leading-6 text-gray-800">
          L’application permet notamment de :
        </Text>
        {[
          "consulter les lignes de bus disponibles ;",
          "rechercher une ligne ;",
          "consulter les différents parcours ;",
          "consulter les arrêts associés aux parcours ;",
          "visualiser les informations relatives aux trajets.",
        ].map((item) => (
          <Text
            key={item}
            className="mb-2 pl-2 text-base leading-6 text-gray-800"
          >
            {"\u2022 "}
            {item}
          </Text>
        ))}
        <Text className="mb-6 text-base leading-6 text-gray-800">
          L’utilisation de SOTRA GO est libre et ne nécessite pas la création
          d’un compte.
        </Text>
        <Text className="mb-2 text-lg font-bold text-green-900">
          2. Exactitude des informations
        </Text>
        <Text className="mb-3 text-base leading-6 text-gray-800">
          Les informations affichées dans l’application sont fournies à titre
          informatif. Les parcours, arrêts et autres informations peuvent
          évoluer ou contenir des erreurs.
        </Text>
        <Text className="mb-6 text-base leading-6 text-gray-800">
          L’utilisateur est invité à vérifier les informations importantes avant
          son déplacement.
        </Text>
        <Text className="mb-2 text-lg font-bold text-green-900">
          3. Utilisation responsable
        </Text>
        <Text className="mb-3 text-base leading-6 text-gray-800">
          L’utilisateur s’engage à utiliser l’application de manière légale et
          responsable.
        </Text>
        <Text className="mb-6 text-base leading-6 text-gray-800">
          Il est interdit de tenter de perturber le fonctionnement de
          l’application, d’accéder sans autorisation à ses services ou
          d’utiliser ses données à des fins malveillantes.
        </Text>
        <Text className="mb-2 text-lg font-bold text-green-900">
          4. Disponibilité du service
        </Text>
        <Text className="mb-6 text-base leading-6 text-gray-800">
          SOTRA GO peut être temporairement indisponible en raison de problèmes
          techniques, de maintenance ou de circonstances indépendantes de notre
          volonté.
        </Text>
        <Text className="mb-2 text-lg font-bold text-green-900">
          5. Évolution de l’application
        </Text>
        <Text className="mb-6 text-base leading-6 text-gray-800">
          Les fonctionnalités et les informations proposées par SOTRA GO peuvent
          être modifiées, améliorées ou supprimées à tout moment.
        </Text>
        <Text className="mb-2 text-lg font-bold text-green-900">
          6. Données personnelles
        </Text>
        <Text className="mb-3 text-base leading-6 text-gray-800">
          SOTRA GO ne nécessite pas la création d’un compte pour être utilisé.
        </Text>
        <Text className="mb-6 text-base leading-6 text-gray-800">
          Toute collecte éventuelle de données personnelles est présentée dans
          notre Politique de confidentialité.
        </Text>
        <Text className="mb-2 text-lg font-bold text-green-900">
          7. Acceptation
        </Text>
        <Text className="mb-6 text-base leading-6 text-gray-800">
          En cliquant sur « Commencer », l’utilisateur reconnaît avoir pris
          connaissance des présentes Conditions d’utilisation et accepte de les
          respecter.
        </Text>
        <Text className="mb-2 text-lg font-bold text-green-900">
          8. Contact
        </Text>
        <Text className="mb-6 text-base leading-6 text-gray-800">
          Pour toute question ou remarque concernant l’application,
          l’utilisateur peut contacter l’équipe de SOTRA GO à l’adresse indiquée
          dans la section À propos / Contact de l’application.
        </Text>
      </ScrollView>
    </View>
  );
}
