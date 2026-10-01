import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function SotraMap() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />

        <style>
          html,
          body,
          #map {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }

          body {
            overflow: hidden;
          }

          /* Style personnalisé pour les marqueurs */
          .custom-marker {
            background-color: #059669;
            border: 3px solid white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          }

          /* Cache les crédits Leaflet pour un look plus pro */
          .leaflet-control-attribution {
            font-size: 10px;
            opacity: 0.6;
          }
        </style>
      </head>

      <body>
        <div id="map"></div>

        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

        <script>
          // Position d'Abidjan (Plateau)
          const map = L.map("map", {
            zoomControl: false, // Désactive les contrôles par défaut
            attributionControl: true,
          }).setView([5.3599, -4.0083], 13);

          // Utilisation d'un style de carte plus moderne
          L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              maxZoom: 19,
              attribution: "&copy; OpenStreetMap"
            }
          ).addTo(map);

          // Ajouter un marqueur exemple pour Abidjan Plateau
          const marker = L.marker([5.3599, -4.0083], {
            icon: L.divIcon({
              className: 'custom-marker',
              iconSize: [20, 20],
            })
          }).addTo(map);

          // Désactiver le zoom double-tap pour éviter les conflits tactiles
          map.doubleClickZoom.disable();
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        style={styles.map}
        originWhitelist={["*"]}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={true}
        bounces={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
