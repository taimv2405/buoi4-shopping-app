# Chương 1. Giới thiệu tổng quan (Introduction)

> Nguồn: `01 - Introduction.pdf` (100 slide). Các slide chỉ có ảnh chụp màn hình/infographic tóm tắt được ghi chú `[slide N: ...]`; nội dung của chúng đã có trong phần chữ.

## Mục tiêu bài học
Sau bài học, sinh viên có thể:
1. Giải thích React Native là gì; phân biệt với React Web, Hybrid/PWA, Flutter và Native.
2. Mô tả luồng xử lý cơ bản của app React Native, vai trò các thread và thành phần của New Architecture.
3. Phân biệt và lựa chọn Expo Go, Development Build và React Native CLI.
4. Thiết lập môi trường và tạo project React Native đầu tiên.
5. Sử dụng công cụ debugging cơ bản.
6. Chẩn đoán và xử lý lỗi môi trường, Metro, QR, mạng và emulator thường gặp.

Nội dung: (1) Vì sao cần ứng dụng đa nền tảng · (2) React Native là gì · (3) Kiến trúc React Native · (4) Expo và React Native CLI · (5) Cài đặt môi trường · (6) Tạo project đầu tiên · (7) Debugging cơ bản · (8) Lỗi thường gặp.

---

## 1.1. Vì sao cần ứng dụng đa nền tảng
Đặt vấn đề: xây dựng một ứng dụng di động chạy trên cả Android và iOS?

| | Native Development | Hybrid App / PWA | Cross-Platform Framework |
|---|---|---|---|
| Cách làm | 2 app riêng: Android (Kotlin/Java), iOS (Swift/Objective-C) | HTML/CSS/JS đóng gói qua Ionic, Cordova, Capacitor; UI chạy trong **WebView** | 1 codebase bằng framework trung gian: React Native (JS/TS), Flutter (Dart) |
| Ưu điểm | Hiệu năng cao nhất; UX mượt, chuẩn từng OS; dùng ngay tính năng mới nhất | 1 codebase; chi phí thấp; ra mắt nhanh; tận dụng đội Web | 1 codebase; triển khai nhanh hơn Native; dễ bảo trì, đồng bộ tính năng |
| Nhược điểm | Chi phí cao (2 codebase); thời gian dài; quản lý 2 dự án phức tạp | Hiệu năng thấp; UX kém; truy cập phần cứng hạn chế | Có lúc chưa tối ưu như Native; có thể phải viết thêm mã Native; phụ thuộc framework bên thứ ba |
| Phù hợp | Cần hiệu năng/UX tối đa, đủ thời gian & ngân sách | App đơn giản, nội bộ, cần ra thị trường nhanh | Xu hướng phổ biến — cân bằng hiệu năng, chi phí, tốc độ |

**Kết luận** [slide 13]: không có giải pháp tốt nhất cho mọi dự án — chọn theo yêu cầu, nguồn lực và trải nghiệm người dùng.

## 1.2. React Native là gì
- Framework xây dựng **app mobile native bằng React**. Viết JS/TS cho UI và logic; React Native kết nối phần JS với lớp native của từng OS.
- **Không tạo DOM** như React Web; không phải website nhúng vào app. `View`, `Text`, `Image`, `TextInput`, `Pressable` không phải HTML tag mà là abstraction được ánh xạ sang **native UI component** Android/iOS.

```jsx
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View>
      <Text>Xin chào React Native</Text>
    </View>
  );
}
```
Ba thành phần chính: import component từ `react-native`, khai báo function component `App`, return giao diện bằng JSX. `View` là vùng chứa, `Text` hiển thị chữ.

### React Web vs React Native
**Giống nhau** (cùng tư duy React): Component, JSX, Props, State, Hooks, One-way data flow, Declarative UI, Component composition.

**Bảng ánh xạ:**
| React Web | React Native |
|---|---|
| `div` | `View` |
| `p`, `span`, `h1` | `Text` |
| `img` | `Image` |
| `input` | `TextInput` |
| `button` | `Button`, `Pressable` |
| CSS file | `StyleSheet`, object style |
| Browser | Android/iOS runtime |
| React Router | React Navigation / Expo Router |
| LocalStorage | AsyncStorage, MMKV, SecureStore |

**Khác nhau:**
1. **Môi trường chạy**: Web: `React Code → Browser → DOM → HTML/CSS`. RN: `React Native Code → JavaScript Runtime → React Native → Android/iOS Native UI`. RN không có DOM, không có CSS file, không dùng thẻ HTML.
2. **Component & Styling**: RN dùng component gốc (`<View>`, `<Text>`), style bằng object/StyleSheet. Giá trị số **không cần đơn vị px** (`padding: 24`, `fontSize: 16`). Không phải mọi thuộc tính CSS web đều dùng được.

```css
/* React Web */
.container { display: flex; justify-content: center; align-items: center; }
```
```html
<div className="container">
  <h1>Hello</h1>
  <button>Click</button>
</div>
```
```jsx
// React Native
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

<View style={styles.container}>
  <Text style={styles.title}>Hello</Text>
  <Pressable style={styles.button}>
    <Text>Click</Text>
  </Pressable>
</View>
```

3. **Navigation:**
| Tiêu chí | React Web | React Native |
|---|---|---|
| Thư viện chính | React Router DOM v6+ | React Navigation v7+, Expo Router |
| Cách hoạt động | URL-based (Browser History API) | Component-based + Native navigation |
| Cách routing | `<Routes>`, `<Route>`, file-based | Config-based hoặc File-based |
| Chuyển màn hình | Thay đổi URL → render component | `navigation.navigate()`, `push()`, `goBack()`, gesture-driven |
| Loại Navigator | Nested Routes, Layout Routes, Outlet | Stack, Bottom Tabs, Drawer, Material Top Tabs, Native Stack |
| Deep Linking | Tự nhiên (URL trực tiếp) | Cần cấu hình |
| Gesture & Animation | Cơ bản (không gesture) | Rất mạnh (Gesture Handler + Reanimated) |
| Hiệu suất | Tốt với code splitting | Tối ưu native (Fabric + TurboModule), preloading (v7) |
| Quản lý trạng thái | `useSearchParams`, `useLoaderData` | Navigation state, params, listeners |
| Luồng xác thực | Protected Routes + Loader | Nested Navigators (Auth Stack + App Stack) |

```jsx
// React Web
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```
```tsx
// React Native — App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Cách navigate (trong component bất kỳ):
import { useNavigation } from '@react-navigation/native';
const navigation = useNavigation();
navigation.navigate('Profile');
```

### So sánh React Native, Flutter, Native
| Tiêu chí | React Native | Flutter | Native Android/iOS |
|---|---|---|---|
| Ngôn ngữ | JavaScript/TypeScript | Dart | Kotlin/Java, Swift/Objective-C |
| Tư duy UI | React component | Widget tree | Native UI theo nền tảng |
| Nền tảng | Android/iOS | Android/iOS/Web/Desktop | Riêng từng nền tảng |
| Tái sử dụng mã | Cao giữa Android/iOS | Cao giữa nhiều nền tảng | Thấp |
| Hiệu năng | Tốt, gần native nếu tối ưu đúng | Tốt, do kiểm soát rendering riêng | Tối ưu nhất nếu làm đúng |
| Tốc độ phát triển | Nhanh | Nhanh | Chậm hơn nếu làm 2 app |
| Khả năng native | Viết native module | Platform channel/plugin | Trực tiếp |
| Phù hợp | App business, startup, MVP, đa nền tảng | App UI cần custom cao | App native-heavy, performance-critical |

**Chọn cái nào?**
- **React Native**: đội đã quen JS/TS hoặc React Web; thời gian, chi phí thấp.
- **Flutter**: cần animation đẹp, custom UI phức tạp (game mini, design-heavy), UI đồng nhất nhiều nền tảng, sẵn sàng học Dart.
- **Native**: cần hiệu năng tối đa, xử lý sâu phần cứng, phụ thuộc SDK native phức tạp, có đội Android/iOS chuyên biệt.
- Môn học dùng **React Native** vì tương thích hệ sinh thái Web, phát triển nhanh, tập trung tư duy mobile.

## 1.3. Kiến trúc React Native
**Khi mở app:** Người dùng mở app → Android/iOS khởi động native app → JavaScript bundle được load → React component được render → React Native tạo native views → Native UI hiển thị.

**Khi tương tác:** Người dùng chạm → Native layer nhận sự kiện → sự kiện chuyển đến JavaScript → `onPress` chạy → State thay đổi → React render lại component → Native UI cập nhật.

### JavaScript Thread
Nơi chạy phần lớn code JS/TS: component function, hooks, state update, props handling, event handlers, business logic, xử lý kết quả API, điều hướng, format dữ liệu, render logic… Đây là nơi React app "sống", API calls thực hiện, touch events xử lý và các cập nhật tới native views được **batch** rồi gửi sang native.

JS thread **xử lý một việc tại một thời điểm** → có thể bị **block** bởi: vòng lặp lớn; render danh sách dài không tối ưu; parse JSON lớn; tính toán nặng trong component; nhiều `console.log` trong vòng lặp; animation phụ thuộc JS thread. Khi bị block, touch events và render UI bị nghẽn → app đóng băng/phản hồi chậm.

```js
// Vòng lặp lớn chặn JS thread
const handlePress = () => {
  for (let i = 0; i < 1000000000; i++) {
    // Logic xử lý
  }
  setCount(count + 1);
};

const handleCalculate = () => {
  let total = 0;
  for (let i = 0; i < 1000000000; i++) {
    total += i;
  }
  setResult(total);
};
```
```jsx
// Render danh sách dài bằng ScrollView (nên dùng FlatList)
<ScrollView>
  {items.map(item => (
    <Text key={item.id}>{item.name}</Text>
  ))}
</ScrollView>
```
```js
// Parse JSON lớn
const loadData = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();
  setItems(data);
};

// Dùng nhiều console.log
items.forEach(item => {
  console.log(item);
});

// Animation phụ thuộc nhiều vào JavaScript
Animated.timing(position, {
  toValue: 100,
  duration: 300,
  useNativeDriver: false,
}).start();
```
```jsx
// Tính toán nặng trực tiếp trong component (chạy lại mỗi lần render)
export default function ProductListScreen({ products }) {
  const expensiveResult = products
    .filter(product => product.price > 100)
    .map(product => ({
      ...product,
      label: `${product.name} - ${product.price}`,
    }))
    .sort((a, b) => b.price - a.price);

  return (
    <FlatList
      data={expensiveResult}
      renderItem={({ item }) => <Text>{item.label}</Text>}
    />
  );
}
```

### Native Thread (UI Thread / Main Thread)
Luồng chính do OS tạo khi app khởi chạy; quản lý UI, xử lý vuốt/chạm, vẽ thành phần native. Liên quan: hiển thị view Android/iOS, gesture mức native, Camera, Location/GPS, Push notification, File system, Bluetooth, Biometric, native animation, native module…

### Bridge Architecture (kiến trúc cũ)
JS và Native giao tiếp qua **Bridge** — "người phiên dịch". Giao tiếp **2 chiều** nhưng **bất đồng bộ**:
1. **JS → Native**: gửi yêu cầu thay đổi UI / gọi API hệ thống. Vd `<Text>Hello</Text>`: JS serialize lệnh thành JSON, gửi qua Bridge; Native deserialize và vẽ `UITextView` (iOS) / `TextView` (Android).
2. **Native → JS**: gửi sự kiện phần cứng/người dùng. Vd chạm nút: OS ghi nhận → đóng gói JSON → gửi qua Bridge → JS chạy `onPress()`.

**Vấn đề:**
- **Bất đồng bộ**: JS không gọi trực tiếp và lấy kết quả ngay; dữ liệu phải xếp hàng qua Bridge.
- **Nghẽn cổ chai**: serialize/deserialize JSON cả 2 chiều; dữ liệu lớn (cuộn danh sách hàng trăm ảnh) → giật lag, màn hình trắng.
- **Không thực thi đồng bộ**: phải dùng Callback/Promise.

### New Architecture
Kiến trúc mới (rendering, native modules, giao tiếp JS-Native). **Từ RN 0.76 bật mặc định** trong project mới.
`JavaScript ⇄ JavaScript Interface (JSI) ⇄ Native` — cùng Fabric / TurboModules / Codegen.
- **JSI** thay Bridge bất đồng bộ: JS giữ tham chiếu tới đối tượng C++ và ngược lại → gọi trực tiếp phương thức, **không tốn chi phí serialization**.
- **Fabric**: renderer UI mới. `React Component Tree → Fabric Renderer → Native View Tree → Android/iOS Screen`. Dev thường không thao tác trực tiếp.
- **TurboModules**: cơ chế native module mới (JS gọi camera, location, biometric, file system…); **lazy-load** khi cần, type/interface rõ hơn khi kết hợp Codegen.

| Native module | Chức năng |
|---|---|
| Camera | Chụp ảnh, quay video |
| Location | Lấy vị trí GPS |
| Notification | Nhận/gửi thông báo |
| Biometric | Vân tay, Face ID |
| File system | Đọc/ghi file cục bộ |

- **Codegen**: sinh code kết nối JS-Native từ interface đã khai báo — "hợp đồng kỹ thuật" (hàm, kiểu tham số, kiểu trả về), type-safe.
  ```ts
  // Ví dụ tư duy về interface giữa JS và Native
  interface DeviceInfoModule {
    getBatteryLevel(): Promise<number>;
    getDeviceName(): Promise<string>;
  }
  ```
- **Hermes**: JavaScript engine tối ưu cho RN (cải thiện khởi động, bộ nhớ). `JS/TS source → build/transpile to JS bundle → Hermes engine → App logic runs on device`.
- **Concurrent React support**: hỗ trợ tốt hơn khả năng concurrent của React.

**Tóm tắt:**
| Khái niệm | Cách hiểu | Cần nhớ |
|---|---|---|
| JavaScript Thread | Nơi chạy logic JS/TS | Không xử lý tác vụ quá nặng trong UI/event handler |
| Native Thread | Nơi native UI và API thiết bị hoạt động | Camera/GPS/notification cần native module |
| Bridge | Cầu nối JS-Native kiến trúc cũ | Overhead nếu truyền quá nhiều dữ liệu |
| New Architecture | Kiến trúc mới | Hướng phát triển chính của RN hiện đại |
| Fabric | Renderer UI mới | Cách native UI được tạo/cập nhật |
| TurboModules | Native module mới | Gọi native module hiệu quả hơn |
| Codegen | Sinh code kết nối JS-Native | Interface rõ ràng, type-safe |
| Hermes | JavaScript engine | Chạy JS trong app RN |

## 1.4. Expo và React Native CLI
- **Expo** (https://expo.dev/): framework/toolchain production-grade trên nền RN — tạo project nhanh, chạy nhanh bằng Expo Go, cài native API phổ biến dễ, Development Build, EAS Build/Submit/Update, quản lý cấu hình app, file-based routing.
- **Expo Go**: app trên điện thoại, quét QR để chạy project. Là *playground build sẵn* cho học tập/phát triển, **không phải app production**. Thêm native library / đổi cấu hình native → cần **Development Build**.

| Expo Go phù hợp | Không phù hợp |
|---|---|
| Demo nhanh trên thiết bị thật | App cần native module tùy chỉnh |
| Chưa cần native module custom | Cấu hình native riêng phức tạp |
| Chưa cần build APK/AAB/IPA | App production có package riêng |
| Giảm lỗi setup | Tích hợp SDK native ngoài phạm vi Expo Go |

- **Development Build**: bản app native riêng của project; dùng khi cần thư viện native không có trong Expo Go, cấu hình icon/scheme/permissions/native config, test gần production, cài lên máy tester.
- **EAS Build**: dịch vụ build Android/iOS của Expo Application Services, thay vì tự xử lý Gradle/Xcode/signing.

| Loại build | Mục đích |
|---|---|
| Development build | Dùng khi phát triển, có dev menu, kết nối Metro |
| Preview/internal build | Gửi tester cài thử, chưa lên store |
| Production build | Phát hành Google Play/App Store |

- **React Native CLI**: gần native hơn; project có sẵn `android/` và `ios/`, chỉnh trực tiếp Gradle, Podfile, Kotlin/Java, Swift/ObjC.

| Tiêu chí | Expo | React Native CLI |
|---|---|---|
| Setup ban đầu | Dễ, nhanh | Khó, phụ thuộc native toolchain |
| Người mới học | Rất phù hợp | Dễ gặp lỗi môi trường |
| Chạy trên điện thoại | Quét QR bằng Expo Go | Cần build/install native app |
| API có sẵn | Có | Cài thủ công |
| Tùy chỉnh Native | Qua prebuild/dev build | Trực tiếp android/ios |
| Build production | EAS Build | Gradle/Xcode hoặc EAS |

## 1.5. Cài đặt môi trường
| Công cụ | Bắt buộc? | Vai trò |
|---|---|---|
| Node.js LTS | Có | Chạy JS tooling, npm/npx, Expo CLI qua npx |
| Git | Khuyến nghị | Quản lý source, tải một số dependency |
| VS Code (hoặc tương đương) | Có | Editor/IDE |
| Expo Go | Có nếu chạy thiết bị thật | Mở app Expo bằng QR |
| Android Studio | Có nếu chạy emulator | Android SDK, emulator, platform tools |
| Xcode | Chỉ macOS/iOS | iOS Simulator, build iOS |

1. **Node.js & npm**: `node -v`, `npm -v`. Dùng bản LTS. Lỗi "node is not recognized" → cài Node.js, mở lại terminal. https://nodejs.org/en/download. Trên Windows đặt project ở đường dẫn **ngắn, không dấu tiếng Việt, không ký tự đặc biệt**.
2. **Git**: `git -v`. https://git-scm.com/install/
3. **VS Code** (https://code.visualstudio.com/download) + extension:

| Extension | Mục đích |
|---|---|
| ESLint | Phát hiện lỗi code, style rule |
| Prettier | Tự động format |
| React Native Tools | Hỗ trợ workflow RN |
| ES7+ React/Redux/React-Native snippets | Gõ nhanh component, import, hooks |
| Error Lens | Hiện lỗi trên dòng code |
| GitLens | Theo dõi thay đổi Git |
| Material Icon Theme | Phân biệt file/thư mục |

4. **Expo Go** (Google Play: `host.exp.exponent` / App Store: id982107779). Máy tính và điện thoại **cùng Wi-Fi**.

| Trường hợp | Cách chạy khuyến nghị |
|---|---|
| Android | Cài Expo Go, quét QR |
| iPhone | Cài Expo Go, dùng camera mở QR |
| Wi-Fi chặn LAN | Tunnel hoặc emulator |
| Laptop yếu | Ưu tiên điện thoại thật |

5. **Android Studio & Emulator** (https://developer.android.com/studio; hướng dẫn: https://reactnative.dev/docs/set-up-your-environment): cung cấp Android SDK, SDK Platform, Build-Tools, Emulator, platform-tools. Tạo máy ảo: *More Actions → Virtual Device Manager → Create virtual device… → chọn thiết bị → Next → thiết lập → Finish*.
6. **Kiểm tra emulator**: `adb devices`. Nếu `adb` không chạy → platform-tools chưa có trong PATH.

## 1.6. Tạo project React Native đầu tiên
```bash
npx create-expo-app@latest ReactNativeCourse
cd ReactNativeCourse
npx expo start
```
- Windows: tạo ở ổ khác C (vd `D:\ReactNativeCourse`); tránh thư mục có dấu hoặc đồng bộ cloud (OneDrive) nếu gặp lỗi quyền file.
- Ưu tiên SDK Expo mới nhất (có thể không chạy trên thiết bị cũ).
- Chạy thành công: terminal hiện QR + phím tắt. Nhấn **`a`** để chạy Android Emulator; hoặc quét QR bằng Expo Go trên máy thật. **SDK của project và của Expo Go phải giống nhau.**
- Lưu ý (tại thời điểm slide): Expo Go cho **SDK 57** chưa có trên Play Store/App Store. Android: tải APK tại https://expo.dev/go?sdkVersion=57&platform=android&device=true. iOS máy thật: phải tạo Expo Go tùy chỉnh bằng `eas go` (cần Apple Developer + TestFlight, hiện TestFlight đã full) → dùng SDK 54 cho iPhone thật.

**Cấu trúc project** (https://docs.expo.dev/get-started/start-developing/#file-structure):
- `src/app/`: hệ thống điều hướng, **định tuyến dựa trên cấu trúc tệp**. Có 2 route `src/app/index.tsx`, `src/app/explore.tsx`; `src/app/_layout.tsx` thiết lập tab navigator bằng component `AppTabs` theo từng nền tảng.
- `assets/`: hình ảnh, icon, splash, tài nguyên tĩnh.
- `app.json`: cấu hình app (tên, slug, icon, splash, orientation, package info).
- Sửa `index.tsx` và lưu → app tự cập nhật nhờ **Fast Refresh**.
- Dừng server `Ctrl/Cmd + C`; reset project: `npm run reset-project`; rồi chạy lại.

**Ví dụ 1 — Pressable + console.log:**
```jsx
import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function Index() {
  const handlePress = () => {
    console.log('User has pressed the button');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello React Native</Text>
      <Text style={styles.subtitle}>Lecture 1 - First App</Text>
      <Pressable style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Click me</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 24 },
  button: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, backgroundColor: '#2563eb' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
```

**Ví dụ 2 — Counter App với useState:**
```jsx
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function Index() {
  const [count, setCount] = useState(0);

  const increaseCount = () => { setCount(count + 1); };
  const decreaseCount = () => { setCount(count - 1); };
  const resetCount = () => { setCount(0); };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello React Native</Text>
      <Text style={styles.subtitle}>Counter App</Text>
      <Text style={styles.count}>{count}</Text>
      <View style={styles.buttonGroup}>
        <Pressable style={styles.button} onPress={increaseCount}>
          <Text style={styles.buttonText}>Increase</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={decreaseCount}>
          <Text style={styles.buttonText}>Decrease</Text>
        </Pressable>
      </View>
      <Pressable style={styles.resetButton} onPress={resetCount}>
        <Text style={styles.buttonText}>Reset</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 24 },
  count: { fontSize: 48, fontWeight: '700', marginBottom: 24 },
  buttonGroup: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  button: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, backgroundColor: '#2563eb' },
  resetButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, backgroundColor: '#64748b' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
```

## 1.7. Debugging cơ bản
Mục tiêu: đọc lỗi, xem log, reload, mở Dev Menu, nhận biết LogBox, biết React Native DevTools. Kỹ thuật: `console.log`, Dev Menu, LogBox, React Native DevTools. Trong production/release build các công cụ này bị tắt.

**console.log:**
```js
const increaseCount = () => {
  console.log('Tăng count. Giá trị hiện tại:', count);
  setCount(count + 1);
};
```
| Nên log | Không nên |
|---|---|
| Giá trị state quan trọng | Log trong vòng lặp lớn |
| Kết quả API khi debug | Dữ liệu nhạy cảm (token/password) |
| Điểm bắt đầu/kết thúc hàm | Log liên tục trong production |

**Dev Menu:**
| Môi trường | Cách mở |
|---|---|
| Android Emulator | `Ctrl + M` / `Cmd + M` hoặc biểu tượng Tools |
| iOS Simulator | `Cmd + D` (macOS) |
| Thiết bị thật | Lắc điện thoại hoặc shortcut Expo CLI |
| Expo terminal | Xem phím tắt hiển thị trong terminal |

**LogBox** — hiển thị lỗi/cảnh báo ngay trong app (thông báo, file liên quan, stack trace):
| Lỗi/Warning | Nguyên nhân | Cách xử lý |
|---|---|---|
| Text strings must be rendered within a `<Text>` component | Đặt chữ trực tiếp trong View/Pressable | Bọc chữ bằng `Text` |
| Cannot read property ... of undefined | Truy cập thuộc tính biến undefined | Kiểm tra dữ liệu trước khi dùng |
| Each child in a list should have a unique "key" prop | Render list thiếu key | Thêm `key`/`keyExtractor` |
| Module not found | Import sai / chưa cài package | Kiểm tra đường dẫn, cài dependency |

**React Native DevTools** — debug phía React/JS (native layer vẫn cần Android Studio/Xcode):
| Tab | Vai trò |
|---|---|
| Components | Cây component, props/state |
| Console | Log và lỗi JS |
| Sources | Debug source JS |
| Profiler | Quan sát render mức React |

## 1.8. Lỗi thường gặp
- **`'node' is not recognized...`**: chưa cài Node.js hoặc terminal chưa nhận PATH → cài Node LTS, thêm PATH, mở lại terminal, kiểm tra `node -v`, `npm -v`.
- **`npx create-expo-app@latest` failed**: kiểm tra internet; không tạo ở thư mục có dấu/ký tự đặc biệt; `npm cache clean --force`.
- **Điện thoại không mở được QR:**

| Nguyên nhân | Cách xử lý |
|---|---|
| Khác Wi-Fi | Kết nối cùng mạng |
| Mạng trường/công ty chặn LAN | Tunnel, đổi mạng, hotspot, emulator |
| Firewall/VPN | Tắt VPN hoặc cấu hình firewall |
| Expo Go cũ | Cập nhật Expo Go |

- **Emulator không mở/quá chậm**: bật virtualization trong BIOS/UEFI; cài đúng emulator & system image; đóng app nặng; máy yếu → dùng điện thoại thật.
- **App trắng màn hình**: xem LogBox; xem terminal `npx expo start`; kiểm tra `index.tsx` có return UI; kiểm tra import; clear cache.
- **Text không nằm trong Text:**
```jsx
// Sai
<View>
  Xin chào
</View>

// Đúng
<View>
  <Text>Xin chào</Text>
</View>
```

## Thảo luận
1. React Native có phù hợp làm app ngân hàng không? Vì sao?
2. Cross-platform có luôn tiết kiệm chi phí không?
3. Tại sao app RN có thể lag nếu JS thread bị block?
4. Vì sao cần phân biệt server/browser environment với mobile/native environment?
5. Khi nào Expo Go không còn đủ cho dự án?
6. Vì sao RN cần giao tiếp với mã native?
7. Emulator và thiết bị thật khác nhau thế nào khi kiểm thử?
8. App bị màn hình trắng, nên kiểm tra gì trước?

## Bài tập (buổi 1)
1. Thiết lập môi trường RN. Android: SDK 57 (máy thật & emulator). iOS: SDK 54 cho máy thật, emulator dùng SDK 57.
2. Xây dựng **Hello React Native App**: tiêu đề "Hello React Native", phụ đề "Buổi 1 - Introduction", hiển thị MSSV - họ tên sinh viên. Kết quả: chạy được trên Expo Go hoặc Emulator. Nộp trên website môn học.
