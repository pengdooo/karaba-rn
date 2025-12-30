import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function Index() {
  const webviewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const handleBack = () => {
    if (webviewRef.current) webviewRef.current.goBack();
  };

  const handleForward = () => {
    if (webviewRef.current) webviewRef.current.goForward();
  };

  const handleReload = () => {
    if (webviewRef.current) webviewRef.current.reload();
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View style={styles.webviewContainer}>
        <WebView
          ref={webviewRef}
          source={{ uri: "http://172.30.1.92:3000/inspect/requests" }}
          style={styles.webview}
          decelerationRate={0.998}
          allowsBackForwardNavigationGestures
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
            setCanGoForward(navState.canGoForward);
          }}
        />
      </View>
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={handleBack}
          disabled={!canGoBack}
          style={styles.navButton}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color={canGoBack ? "black" : "#ccc"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleReload} style={styles.navButton}>
          <Ionicons name="reload" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleForward}
          disabled={!canGoForward}
          style={styles.navButton}
        >
          <Ionicons
            name="chevron-forward"
            size={28}
            color={canGoForward ? "black" : "#ccc"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  navButton: {
    padding: 10,
  },
});
