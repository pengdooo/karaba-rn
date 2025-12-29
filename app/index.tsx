import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function Index() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <WebView
        source={{ uri: "https://karaba-three.vercel.app/inspect/requests" }}
        style={styles.webview}
        allowsBackForwardNavigationGestures
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
});
