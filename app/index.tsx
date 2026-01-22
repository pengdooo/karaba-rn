import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
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

  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webviewRef.current) {
        webviewRef.current.goBack();
        return true;
      }
      return false;
    };

    const backHandler =
      Platform.OS === "android"
        ? BackHandler.addEventListener("hardwareBackPress", onBackPress)
        : null;

    return () => backHandler?.remove();
  }, [canGoBack]);

  return (
    <SafeAreaView
      style={styles.container}
      edges={
        Platform.OS === "android"
          ? ["top", "bottom", "left", "right"]
          : ["left", "right"]
      }
    >
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View style={styles.webviewContainer}>
        <WebView
          ref={webviewRef}
          source={{
            uri: `${process.env.EXPO_PUBLIC_BASE_URL}/inspect/requests`,
          }}
          style={styles.webview}
          decelerationRate={0.998}
          allowsBackForwardNavigationGestures
          mediaPlaybackRequiresUserAction={false} // ✅ 핵심
          allowsInlineMediaPlayback={true}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
            setCanGoForward(navState.canGoForward);
          }}
          onShouldStartLoadWithRequest={(request) => {
            // Vercel Feedback 등의 특정 도메인 차단
            if (request.url.includes("vercel.live")) {
              return false;
            }

            // BASE_URL이 포함되어 있지 않은 외부 링크인 경우 외부 브라우저로 오픈
            if (
              process.env.EXPO_PUBLIC_BASE_URL &&
              !request.url.startsWith(process.env.EXPO_PUBLIC_BASE_URL) &&
              request.url.startsWith("http")
            ) {
              Linking.openURL(request.url);
              return false;
            }
            return true;
          }}
          onMessage={async (event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === "downloadExcel") {
                const file = new FileSystem.File(
                  FileSystem.Paths.document,
                  data.fileName,
                );

                // Base64 데이터를 파일로 저장
                file.write(data.payload, {
                  encoding: "base64",
                });

                // 유저에게 공유/저장창 띄우기
                await Sharing.shareAsync(file.uri);
              }
            } catch (err) {
              console.error("Excel download error:", err);
            }
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
