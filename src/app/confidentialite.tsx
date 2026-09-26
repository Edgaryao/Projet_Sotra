import { ScrollView, Text, View } from "react-native";
import Return from "./components/Return";

export default function ConfidentialitePage() {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center gap-4 px-5 pb-4 pt-12">
        <Return size={28} />
        <Text className="flex-1 text-2xl font-bold text-green-900">
          Politique de confidentialité
        </Text>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
      >
        <Text className="mb-6 text-sm text-gray-500">
          Dernière mise à jour : septembre 2026
        </Text>
        <Text className="mb-3 text-base leading-6 text-gray-800">
          SOTRA GO accorde de l’importance à la protection de la vie privée de
          ses utilisateurs. Cette politique explique quelles informations sont
          collectées et comment elles sont utilisées lors de l’utilisation de
          l’application.
        </Text>
        <Text className="mb-2 text-lg font-bold text-green-900">
          1. Aucune inscription obligatoire
        </Text>
        <Text className="mb-6 text-base leading-6 text-gray-800">
          SOTRA GO ne nécessite pas la création d’un compte, ni la fourniture
          d’un nom, d’une adresse e-mail ou d’un mot de passe pour utiliser les
          fonctionnalités principales de l’application.
        </Text>
        <Text className="mb-2 text-lg font-bold text-green-900">
          2. Données collectées
        </Text>
        <Text className="mb-3 text-base leading-6 text-gray-800">
          Dans sa version actuelle, SOTRA GO permet principalement de consulter
          les informations relatives aux lignes, parcours et arrêts de bus.
        </Text>
        <Text className="mb-6 text-base leading-6 text-gray-800">
          L’application ne collecte pas volontairement de données personnelles
          permettant d’identifier directement l’utilisateur.
        </Text>
        <Text className="mb-2 text-lg font-bold text-green-900">
          3. Données de localisation
        </Text>
        <Text className="mb-3 text-base leading-6 text-gray-800">
          SOTRA GO peut éventuellement utiliser la localisation de l’appareil
          pour proposer des fonctionnalités liées aux arrêts ou aux trajets à
          proximité.
        </Text>
        <Text className="mb-3 text-base leading-6 text-gray-800">
          Lorsque cette fonctionnalité est utilisée, l’autorisation de
          l’utilisateur est demandée par le système du téléphone.
        </Text>
        <Text className="mb-6 text-base leading-6 text-gray-800">
          La localisation n’est pas utilisée pour identifier personnellement
          l’utilisateur.
        </Text>
        <Text className="mb-2 text-lg font-bold text-green-900">
          4. Utilisation des données
        </Text>
        <Text className="mb-2 text-base leading-6 text-gray-800">
          Les informations utilisées par SOTRA GO servent principalement à :
        </Text>
        {[
          "afficher les lignes de bus ;",
          "rechercher des lignes et des parcours ;",
          "afficher les arrêts ;",
          "faciliter la consultation des trajets.",
        ].map((item) => (
          <Text
            key={item}
            className="mb-2 pl-2 text-base leading-6 text-gray-800"
          >
            {"\u2022 "}
            {item}
          </Text>
        ))}
        <Text className="mb-2 mt-4 text-lg font-bold text-green-900">
          5. Conservation et partage des données
        </Text>
        <Text className="mb-3 text-base leading-6 text-gray-800">
          SOTRA GO ne vend pas les données personnelles de ses utilisateurs.
        </Text>
        <Text className="mb-6 text-base leading-6 text-gray-800">
          Les données nécessaires au fonctionnement de l’application peuvent
          être stockées sur les services techniques utilisés par l’application,
          notamment son infrastructure de base de données.
        </Text>
        <Text className="mb-2 text-lg font-bold text-green-900">
          6. Services externes
        </Text>
        <Text className="mb-6 text-base leading-6 text-gray-800">
          L’application peut utiliser des services ou technologies externes
          nécessaires à son fonctionnement.
        </Text>
        <Text className="mb-2 text-lg font-bold text-green-900">
          7. Sécurité
        </Text>
        <Text className="mb-3 text-base leading-6 text-gray-800">
          Des mesures raisonnables sont mises en place afin de protéger les
          informations utilisées par l’application contre les accès non
          autorisés, la perte ou la modification.
        </Text>
        <Text className="mb-6 text-base leading-6 text-gray-800">
          Cependant, aucun système informatique ne peut garantir une sécurité
          absolue.
        </Text>
        <Text className="mb-2 text-lg font-bold text-green-900">
          8. Évolution de la politique
        </Text>
        <Text className="mb-3 text-base leading-6 text-gray-800">
          Cette politique de confidentialité peut être mise à jour afin de tenir
          compte de l’évolution des fonctionnalités de SOTRA GO ou des
          obligations applicables.
        </Text>
        <Text className="mb-6 text-base leading-6 text-gray-800">
          La date de dernière mise à jour sera indiquée en haut de cette page.
        </Text>
        <Text className="mb-2 text-lg font-bold text-green-900">
          9. Contact
        </Text>
        <Text className="mb-6 text-base leading-6 text-gray-800">
          Pour toute question concernant cette politique de confidentialité ou
          la protection des données, l’utilisateur peut contacter l’équipe de
          SOTRA GO à l’adresse indiquée dans la section À propos / Contact de
          l’application.
        </Text>
        <Text className="mb-2 text-lg font-bold text-green-900">
          10. Acceptation
        </Text>
        <Text className="mb-6 text-base leading-6 text-gray-800">
          En cliquant sur « Commencer », l’utilisateur reconnaît avoir pris
          connaissance de cette Politique de confidentialité.
        </Text>
      </ScrollView>
    </View>
  );
}
