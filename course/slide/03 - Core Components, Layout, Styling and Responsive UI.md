# Chương 3. Core Components, Layout, Styling và Responsive UI

> Nguồn: `03 - Core Components, Layout, Styling and Responsive UI.pdf` (173 slide). Code trong slide nằm dưới dạng ảnh, đã được chép lại bằng cách đọc trực tiếp ảnh. Các ví dụ đầy đủ nằm trên Expo Snack (link giữ nguyên); slide chỉ có ảnh chụp kết quả nên được lược bỏ.
> Phiên bản đề cập trong slide: React Native 0.86/0.87, Expo SDK 57, NativeWind v4.

## Mục tiêu
Xây dựng màn hình RN hoàn chỉnh bằng Core Components, tổ chức layout bằng Yoga/Flexbox, định kiểu bằng StyleSheet và NativeWind, thích ứng nhiều kích thước cửa sổ, theme và nền tảng. UI production phải đúng khi text dài, xoay màn hình, split-screen, tablet/foldable, dark mode, font scaling, edge-to-edge.

Sau bài học:
1. Dùng View, Text, Image/expo-image, TextInput, Pressable, SafeAreaView, StatusBar theo pattern thực tế.
2. Tổ chức style bằng `StyleSheet.create`, style array, typed style props, design tokens.
3. Giải thích box model và cơ chế layout Yoga/Flexbox.
4. Responsive/adaptive layout: compact/medium/expanded, dark mode, safe area, Android edge-to-edge, font scaling, RTL, platform-specific styles.
5. Cài đặt và dùng NativeWind.

Nội dung: 3.1 Core Components · 3.2 Styling System · 3.3 Layout với Yoga & Flexbox · 3.4 Responsive & Adaptive UI · 3.5 NativeWind.

---

## 3.1. Core Components
Core Components là abstraction do RN cung cấp, ánh xạ xuống host/native view của từng nền tảng. Ba câu hỏi cho mỗi component: (1) giải quyết vấn đề gì; (2) style/layout nào tác động; (3) khi nào không nên dùng hoặc nên dùng giải pháp hiện đại hơn.

### View
- Container nền tảng: hỗ trợ Flexbox/Yoga, style, touch-responder, accessibility; chứa 0..n con; ánh xạ thành host view. (https://reactnative.dev/docs/view · Snack: https://snack.expo.dev/@duyphamnhat/3-1_view1)
- `onLayout`: nhận kích thước/vị trí sau khi layout được tính. **Không** dùng làm cách mặc định để responsive — `useWindowDimensions` phù hợp hơn cho layout cấp màn hình; `onLayout` hữu ích khi component cần biết kích thước thực của chính nó. (Snack: `3-1_view2`)
- `pointerEvents = auto | none | box-none | box-only`: kiểm soát View có nhận sự kiện chạm. Dùng khi làm overlay: lớp trang trí đặt `pointerEvents="none"` để không chặn thao tác bên dưới. (Snack: `3-1_pointerevents`)

### Text
- Text lồng trong Text tham gia **text layout, chảy inline** (hai Text như một dòng); con trong View bố trí bằng Flexbox (hai phần tử layout riêng). (https://reactnative.dev/docs/text · Snack: `3-1_text1`)
- **Raw text phải nằm trong `<Text>`**, không đặt trực tiếp dưới `<View>`.
- Typography qua Text Style Props: `fontSize`, `fontWeight`, `fontFamily`, `lineHeight`, `letterSpacing`, `textAlign`, `textTransform`, `color`, `textDecorationLine`…
- **Không có global CSS typography inheritance** như web (`body { font-family; color }`); đặt `fontFamily`/`color` trên `<View>` không làm các Text con kế thừa. Kế thừa chỉ xảy ra **trong text subtree**:
```jsx
<Text style={{ fontWeight: '700' }}>
  Hello{' '}
  <Text style={{ color: 'red' }}>React Native</Text>
</Text>
// → "Hello React Native" đều đậm; "React Native" màu đỏ (kế thừa fontWeight từ Text cha)
```

### Image và expo-image
- Core `Image` đủ cho nhu cầu cơ bản. App Expo dùng nhiều ảnh remote → `expo-image` tiện hơn: disk/memory cache, placeholder, BlurHash/ThumbHash, `contentFit`, `transition`.
- **RN 0.87 đã deprecate `ImageBackground`** → dùng `View` + `Image` với `position: 'absolute'` khi cần ảnh nền.
- Docs: https://reactnative.dev/docs/image · https://docs.expo.dev/versions/latest/sdk/image/

| Tình huống | Core Image | expo-image |
|---|---|---|
| Ảnh local đơn giản | Ưu tiên, đủ dùng | Rất tốt nhưng thường không cần |
| Nhiều remote image / cần cache | Có native cache, điều khiển hạn chế | Disk/memory cache rõ ràng, `cachePolicy` |
| Placeholder/BlurHash | Có `defaultSource`, không BlurHash | BlurHash / ThumbHash / placeholder |
| Cross-fade khi tải | Một số hỗ trợ platform-specific (`fadeDuration` Android) | `transition` trực tiếp |
| Background image | View + absolute Image (từ RN 0.87) | View + absolute Image |

- Ví dụ background image với BlurHash: Snack `3-1_image`.
- BlurHash nên được **tạo trước ở backend/CDN** khi upload: `Upload → Backend/CDN tạo BlurHash một lần → lưu DB → API trả { imageUrl, blurhash }` → RN hiện BlurHash ngay, ảnh thật tải sau. Không tải ảnh lớn trên client chỉ để tạo BlurHash.

### TextInput
Nguyên tắc UI behavior (https://reactnative.dev/docs/textinput · Snack: `3-1_textinput`):
- **Focus state rõ ràng**: dùng `onFocus`/`onBlur` đổi border, background hoặc label.
- **Padding & touch area hợp lý**: `paddingHorizontal`, `paddingVertical`, chiều cao đủ để dễ chạm và đọc.
- **Placeholder theo theme**: `placeholderTextColor` riêng cho Light/Dark; nhẹ hơn text thật nhưng đủ tương phản.
- **multiline**: thường dùng `minHeight`; Android thêm `textAlignVertical: 'top'`; iOS chủ yếu chỉnh padding.

### Pressable
"Interactive surface" (https://reactnative.dev/docs/pressable · Snack: `3-1_pressable` — nút Continue chỉ bật sau khi người dùng đồng ý):
- Trạng thái pressed / disabled / loading cần visual feedback rõ ràng, nhất quán.
- `style={({ pressed }) => ...}` phản ánh trạng thái nhấn; Android thêm `android_ripple` cho native feedback.
- `hitSlop` tăng vùng chạm nhưng **không dùng để bù cho control quá nhỏ**.
- Dùng `accessibilityRole`, `accessibilityLabel`, `accessibilityState` cho assistive technologies.
- Control quan trọng: touch target khoảng **44–48 logical units**; disabled thể hiện cả bằng behavior lẫn visual.

### Safe Area và System Bars
- **Safe Area**: vùng an toàn không bị system bars hoặc góc bo vật lý che. **System Bars**: Status Bar (pin, giờ) và Navigation Bar / Home Indicator.
- **Core `SafeAreaView` đã deprecated** → dùng `react-native-safe-area-context` (https://appandflow.github.io/react-native-safe-area-context/):
  - App RN thông thường: đặt `SafeAreaProvider` ở root. **Expo Router đã tích hợp sẵn** safe-area support.
  - Edge-to-edge: background có thể phủ toàn màn hình, nhưng text, button, control quan trọng phải tôn trọng safe-area insets.
  - `SafeAreaView` cho trường hợp đơn giản; `useSafeAreaInsets()` khi cần kết hợp inset với spacing/layout tùy biến.
  - Không mặc định bỏ `bottom` khỏi `edges`; chỉ bỏ khi navigator/layout khác đã xử lý bottom inset.
  - **RN 0.87 bỏ `StatusBar.backgroundColor` và `translucent`**; thiết kế mới dựa vào screen background + safe-area; `barStyle` vẫn điều khiển màu icon/text của status bar.
- Snack: `3-1_safearea-systembars`.

### UI Primitives khác
| Component | Dùng khi | Lưu ý |
|---|---|---|
| ActivityIndicator | Loading nhỏ tại một vùng | `color`, `size`, `animating` là props; không phải visual prop nào cũng map từ className |
| Switch | Toggle setting | Controlled: `value` + `onValueChange`; `trackColor`, `thumbColor`, `ios_backgroundColor` là props |
| Modal | Dialog / overlay toàn màn hình | RN 0.86 forward style vào inner container; thường vẫn cần backdrop + content container riêng |
| KeyboardAvoidingView | Giữ form/input tránh bàn phím | `behavior` khác theo platform/layout; có thể cần `keyboardVerticalOffset` |
| RefreshControl | Pull-to-refresh với ScrollView | Gắn qua `refreshControl`; `refreshing` là controlled prop; màu indicator khác API Android/iOS |
| StatusBar / expo-status-bar | Màu icon/text, visibility status bar | RN 0.87 bỏ `backgroundColor`/`translucent`; ưu tiên `barStyle`/`style`, `hidden`, edge-to-edge |

---

## 3.2. Styling System
**Chiến lược:** chọn đúng công cụ, không tuyệt đối hóa thư viện.
| StyleSheet + Design Tokens | NativeWind |
|---|---|
| API của RN, type-safe | Utility-first, dựng UI nhanh |
| Không thêm dependency | State / dark / platform variants |
| Rõ ràng, dễ kiểm soát | Responsive utilities |
| Tốt cho reusable component / design system | CSS variables / theme |
| Dynamic style qua array, props, hooks | Third-party interop qua `cssInterop` |

### Style prop: object, array, precedence
Core Components nhận prop `style`; tên thuộc tính **camelCase**; `style` là object hoặc array; **style xuất hiện sau có precedence cao hơn**.
```jsx
<View
  style={[
    styles.card,
    selected && styles.cardSelected,
    disabled && styles.cardDisabled,
  ]}
/>

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: '#e2e8f0', opacity: 1 },
  cardSelected: { borderColor: '#2563eb' },
  cardDisabled: { opacity: 0.5 },
});
// selected = true, disabled = true → { borderWidth: 1, borderColor: '#2563eb', opacity: 0.5 }
```
Giá trị falsy (`false`, `null`, `undefined`) trong style array được bỏ qua → **không cần** viết `selected ? styles.cardSelected : {}`.

Compose base style + state/variant styles theo thứ tự, thay vì một object lớn chứa nhiều điều kiện:
```jsx
// KHÔNG NÊN
const style = {
  borderWidth: 1,
  borderColor: selected ? '#2563eb' : '#e2e8f0',
  opacity: disabled ? 0.5 : 1,
  backgroundColor: error ? '#fef2f2' : selected ? '#eff6ff' : '#ffffff',
};

// NÊN
<View
  style={[
    styles.card,
    selected && styles.cardSelected,
    error && styles.cardError,
    disabled && styles.cardDisabled,
  ]}
/>
```

### Typed reusable component
Component có default style nhưng cho caller override có kiểm soát (Snack: `3-2_styleprop`):
```tsx
// Default: surface: { backgroundColor: '#ffffff' }
<Surface style={{ backgroundColor: '#eff6ff' }}>  {/* caller override → nền xanh nhạt */}
```
- Type style prop bằng **`StyleProp<ViewStyle>`**, `StyleProp<TextStyle>`, `StyleProp<ImageStyle>` — **không** dùng `style?: any` hay `style?: ViewStyle` (StyleProp nhận đúng mọi dạng style RN chấp nhận: object, array, falsy…).
- Style **không cho phép override** → đặt **sau** style của caller:
```jsx
<View
  style={[
    styles.surface,
    style,                 // của caller
    styles.requiredLayout, // luôn thắng
  ]}
/>
```

### Design tokens
- Chuẩn hóa token cho **spacing, radius, typography, semantic colors** thay vì hard-code hàng trăm mã màu/khoảng cách. Component dùng token theo **ý nghĩa** (`primary`, `text`, `surface`).
- Theme chỉ thay **mapping** token: component vẫn dùng `colors.text`, Light/Dark quyết định giá trị thật.
- Token **không thay** StyleSheet — token cung cấp giá trị, StyleSheet mô tả style/layout; bổ sung cho nhau.
- https://docs.nativebase.io/design-tokens · Snack: `3-2_designtokens` (1. định nghĩa tokens; 2. dùng trong app).

### Box model, sizing, đơn vị
- Giá trị số (`width`, `height`, `padding`, `margin`, `fontSize`) là **logical units** — không viết `"16px"`.
- **Không có margin collapsing** như CSS web.
- `width`, `height`, `minWidth`, `maxWidth`… nhận number hoặc **percentage string** (`'100%'`, phụ thuộc parent).
- `minWidth/maxWidth/minHeight/maxHeight` tạo layout thích ứng thay vì hard-code.
- `aspectRatio`: chỉ định một chiều, RN tính chiều còn lại; tôn trọng min/max.
- `StyleSheet.hairlineWidth`: đường rất mảnh theo density; không giả định cùng giá trị trên mọi thiết bị.
- Một số API mới tương thích CSS (`boxShadow`, `filter`) nhận chuỗi kiểu CSS.
- https://reactnative.dev/docs/height-and-width · Snack: `3-2_boxmodel`

### Shadow
Support khác nhau theo platform/OS (https://reactnative.dev/docs/shadow-props):
| API | Platform / điều kiện | Nên dùng khi |
|---|---|---|
| `boxShadow` | New Architecture; iOS + Android (outset ≥ 9, inset ≥ 10) | Card/surface, cú pháp gần web, spread/inset/nhiều shadow |
| `filter: dropShadow` | New Architecture; Android 12+ | Icon/ảnh có alpha, shadow theo hình dạng thực |
| `shadowColor` | iOS + Android API 28+ | Màu native shadow |
| `shadowOffset` / `shadowOpacity` / `shadowRadius` | iOS | Shadow iOS đơn giản |
| `elevation` | Android 5+ | Material elevation, fallback |

- Snack: `3-2_boxshadow` (https://reactnative.dev/docs/boxshadowvalue), `3-2_dropshadow` (https://reactnative.dev/docs/dropshadowvalue).
- `filter` trên iOS chỉ có `brightness`, `opacity`; Android nhiều hơn (`blur`, `dropShadow` cần Android 12+). `filter` áp dụng cả lên descendants và làm `overflow: hidden` có hiệu lực → kiểm tra clipping. Không giả định mọi hiệu ứng CSS chạy như web.

### Khác biệt quan trọng so với Web
| Web CSS | React Native | Lưu ý |
|---|---|---|
| `flexDirection` mặc định `row` | mặc định **`column`** | Tránh sai main axis |
| `flexShrink` mặc định 1 | mặc định **0** | Con có thể overflow nếu không shrink |
| `alignContent` mặc định `stretch` | mặc định `flex-start` | Wrapped layout khác web |
| CSS cascade / selectors | Không có | Style đi qua props/component |
| px, rem, em, % | number = logical unit; % ở props hỗ trợ | Không copy dimension CSS trực tiếp |
| hover phổ biến | Chủ yếu press; hover chỉ vài input/platform | Thiết kế theo capability |
| negative margin phổ biến | **Không hỗ trợ trên Android** | Không dựa vào trick negative margin |

---

## 3.3. Layout với Yoga và Flexbox
RN dùng **Yoga** tính layout; dev mô tả qua style props: `flex`, `flexDirection`, `justifyContent`, `alignItems`, `gap`, `width`, `height`, `position`…

Luồng trong New Architecture: `React Components → React Shadow Tree → Commit phase: Yoga tính layout (position + size) → Mount phase → Host View Tree → Android/iOS screen`. Yoga được gọi trong commit phase để tính kích thước/vị trí Shadow Nodes trước khi mount. (https://reactnative.dev/docs/flexbox · https://www.yogalayout.dev/docs/about-yoga)

### flexDirection, justifyContent, alignItems
- `flexDirection` xác định **Main Axis**; mặc định `'column'` (main dọc, cross ngang). `'row'` → main ngang, cross dọc.
- `justifyContent` luôn trên **Main Axis**; `alignItems` trên **Cross Axis**.

### flex, flexGrow, flexShrink, flexBasis
- `flex: 1`: cho phép dùng phần không gian còn trống trên main axis.
- `flexGrow`: khả năng giãn khi còn chỗ trống dương.
- `flexShrink`: mức co khi thiếu chỗ (**mặc định 0**, web là 1).
- `flexBasis`: kích thước ban đầu trên main axis trước grow/shrink.
- **`numberOfLines` không tự sửa lỗi layout**: `<Text numberOfLines={2}>` chỉ quyết định render/truncate; container vẫn phải được phép co bằng `flex: 1` hoặc `flexShrink: 1`.
- Row có text dài: không có `flex: 1`/`flexShrink: 1` thì text đòi quá nhiều width và **đẩy action ra khỏi viewport**. Text tràn → kiểm tra layout trước, thường không phải lỗi font. (Snack: `3-3_flexs`; ví dụ flex ratio 1:2:1)

### flexWrap + gap
- `flexWrap` mặc định `nowrap` → row không đủ chỗ sẽ overflow/shrink. `flexWrap: 'wrap'` → con xuống dòng.
- `gap` (và `rowGap`, `columnGap`): khoảng cách giữa các con; **không tạo padding ở mép container** — cạnh ngoài vẫn dùng `padding`.
- Resize/xoay màn hình → Flexbox tự điều chỉnh, không cần tính số cột thủ công (Snack: `3-3_wrapgap`).
- Chip/tag/tập item nhỏ: dùng `flexWrap`. **Danh sách/grid dài: dùng `FlatList` + `numColumns`.**

### position, absolute, overlay, zIndex, absoluteFill
- `position`: mặc định **`'relative'`** (tham gia normal flow). `'absolute'` → **lấy khỏi normal flow**, định vị theo phần tử cha.
- overlay = `position: 'absolute'` + `zIndex`. `zIndex` cao hơn nằm trên.
- `StyleSheet.absoluteFill`: style có sẵn để phủ kín cha.
```jsx
<View style={styles.container}>
  <Text style={styles.paragraph}>Text 1</Text>
  <Text style={[styles.paragraph, { position: 'absolute' }]}>Text 2</Text>
  <Text style={styles.paragraph}>Text 3</Text>
</View>
// Text 2 bị lấy khỏi flow → Text 1 và Text 3 dồn lại sát nhau; Text 2 nằm đè ở vị trí riêng
```
- Dùng `absolute` cho **UI overlay**: badge, notification counter, scrim, decorative layer, hero background, floating icon, FAB. **Không** dựng cả màn hình bằng tọa độ (`top: 143, left: 72`) — dễ vỡ khi đổi kích thước, xoay, font scale, tablet, foldable.
- Ví dụ Hero (Snack: `3-3_positionoverlaystyle`), thứ tự lớp: `zIndex 3` NEW Badge → `zIndex 2` Content (title, description, button) → `zIndex 1` Scrim → mặc định Background Image.
- https://reactnative.dev/docs/layout-props

---

## 3.4. Responsive và Adaptive UI
App chạy trong nhiều môi trường: phone portrait/landscape, tablet, split-screen, foldable, desktop-like window. **Không suy luận "đây là tablet"** — dựa vào không gian và khả năng thực tế: window rộng bao nhiêu, content còn bao nhiêu chỗ, fontScale, safe area, capability platform.
- **Responsive**: cấu trúc UI giữ nguyên; kích thước, wrapping, số cột thay đổi theo không gian.
- **Adaptive**: cấu trúc UI thay đổi theo kích thước/môi trường.

### useWindowDimensions
Ưu tiên `useWindowDimensions()` thay cho `Dimensions` — tự cập nhật `width`, `height`, `scale`, `fontScale` khi window đổi (xoay, split-screen, foldable). Dùng trực tiếp để chọn layout mode; **không cần lưu width vào state riêng**. (https://reactnative.dev/docs/usewindowdimensions)

### Compact / Medium / Expanded
- Là **layout mode theo không gian hiện tại**, không phải phân loại thiết bị. Tablet chạy split-screen vẫn có thể rơi vào Compact.
- Responsive tốt **không chỉ đổi fontSize** — có thể đổi số cột, navigation, sidebar, detail panel, grouping, mật độ thông tin.
- Compact: 1 cột; Medium: 2 cột; Expanded: main content + persistent side panel.
- **Same state, same data, same actions, different layout** — không tạo riêng `PhoneScreen`/`TabletScreen` lặp logic; chỉ tách khi implementation khác biệt đáng kể.
- Row chứa text dài: text container phải được co (`flex: 1` / `flexShrink: 1`); `minWidth: 0` chỉ dùng khi thực sự cần.
- Snack: `3-4_adaptiveui` (Layout Mode Inspector), `3-4_dashboardui` (Dashboard đổi cấu trúc).

### Responsive Grid với FlatList
Danh sách dài dùng `numColumns`, **không** bọc FlatList bằng `flexWrap`. Số cột từ available width (breakpoint của grid, không phải định nghĩa thiết bị):
```js
const columns =
  width >= 1024
    ? 3
    : width >= 640
      ? 2
      : 1;
```
Số cột đổi → FlatList cần remount: đặt `key={`grid-${columns}`}`. (Snack: `3-4_responsivecoursegrid` — 1/2/3 cột)

### PixelRatio, scale, fontScale
- Layout dùng **logical units (dp/points)**; màn hình render bằng physical pixels. `scale` là cầu nối (`width: 120` với scale 3 ≈ 360 physical px). `fontScale` là trục scaling riêng cho chữ (cài đặt Accessibility).
- `PixelRatio` lấy density; `PixelRatio.getPixelSizeForLayoutSize()` đổi layout size → integer physical px — dùng khi hệ thống ngoài RN cần kích thước bitmap thật (vd request thumbnail CDN). **UI layout vẫn dùng logical units**, không tự nhân mọi width với PixelRatio. (https://reactnative.dev/docs/pixelratio)
- Ảnh hiển thị 320 logical units: `Physical Pixels = Layout Size (DP) × Device Pixel Ratio`. Lấy ảnh 320px → mờ trên màn hình mật độ cao. Lấy ảnh gốc 4000×4000 → tốn tải, decode, memory; nhiều ảnh lớn → giật, memory pressure, OOM.
- **Giải pháp**: Dynamic Image CDN (Cloudinary, Imgix, Cloudflare Images) cắt ảnh qua URL `?w=...&h=...`.
- DPR rất đa dạng (1.3x, 1.5x, 2x, 2.625x, 2.75x, 2.88x, 3x, 3.5x…) → mỗi thiết bị xin một kích thước lẻ → CDN phải render/cache từng size, cache hit giảm. **Image Bucketing**: làm tròn lên mốc cố định (bội số 100):
```js
const rawPixelSize = PixelRatio.getPixelSizeForLayoutSize(displaySize);
// Tự động làm tròn lên mốc bội số của 100 (ví dụ: 640 -> 700)
const bucketedSize = Math.ceil(rawPixelSize / 100) * 100;
const url = `${CDN_URL}/image?w=${bucketedSize}&h=${bucketedSize}`;
```
- **fontScale**: breakpoint chỉ theo width (`const isMobile = width < 600;`) vẫn đúng về chiều rộng nhưng UI có thể vỡ khi người dùng bật cỡ chữ lớn. Phải tính cả fontScale. (Snack: `3-4_imagefontscale`)

### Light/Dark theme
- `useColorScheme()` đọc color scheme hiện tại và tự theo dõi thay đổi (người dùng đổi mode, OS đổi theo lịch). **Từ RN 0.87 trả về `'light' | 'dark' | null`** (bỏ `'unspecified'`). `null` có thể xảy ra (Appearance module không khả dụng) → cần **fallback rõ ràng**, thường là Light. (https://reactnative.dev/docs/usecolorscheme)
- Dark mode không phải "đảo trắng thành đen". Không để từng component tự viết `color: isDark ? '#ffffff' : '#000000'` (rải rác, không nhất quán). Theme phải xử lý surface, text chính/phụ, border, button, lỗi, thành công…
- **Semantic color tokens**: component chỉ biết **vai trò** màu: `screen`, `surface`, `text`, `muted`, `border`, `primary`, `onPrimary`, `success`, `danger`. Vd `text` = `'#0f172a'` (Light) / `'#f8fafc'` (Dark); component dùng `color: colors.text`.
- Luồng: `System Appearance → useColorScheme() → light/dark/null → Theme Colors → Semantic Tokens → UI`. (Snack: `3-4_lightdarktheme`)

### Platform-specific styling & files
- Mục tiêu: chia sẻ phần lớn code/state/logic, **không** buộc Android/iOS/Web giống từng pixel; giữ cùng product experience, cho phép khác biệt hợp lý. Chức năng khác nhau đáng kể → đừng nhồi vào một component.
- `Platform.OS` phân biệt `'android'`/`'ios'` (và `'web'` với Expo/RN Web). `Platform.Version`: Android là **API level (number)**, iOS là **version (string)**.
```js
if (Platform.OS === 'android') {
  // Android-specific behavior
}
```
- Nhiều `Platform.OS === 'ios' ? ... : ...` → nên dùng `Platform.select()` hoặc platform-specific files.
```js
Platform.select({
  ios: {...},
  android: {...},
  native: {...},
  default: {...},
})
```
  Ưu tiên key cụ thể (`ios`/`android`) → `native` (chung Android/iOS) → `default` (fallback). `Platform.select()` trả về **bất kỳ giá trị** (style, string, number, config, implementation). (https://reactnative.dev/docs/platform · https://reactnative.dev/docs/platform-specific-code · Snack: `3-4_platform-specificstyling` — Android có ripple)
- **Platform-specific files**: `AppTabs.ios.tsx`, `AppTabs.android.tsx`; `import AppTabs from './AppTabs'` → Metro tự chọn. `.native.` cho code chung Android/iOS khác Web; Expo hỗ trợ thêm `.web.tsx`. Thứ tự resolve:
  - Android: `*.android.js` → `*.native.js` → `*.js`
  - iOS: `*.ios.js` → `*.native.js` → `*.js`
  - Web: `*.web.js` → `*.js`
- Ví dụ "More actions" mở bottom action sheet:
  - iOS → native `ActionSheetIOS` API → OS điều khiển hiển thị → callback nhận `buttonIndex`.
  - Android → RN `Modal` → app tự quản lý visible state, render backdrop, action rows, ripple.
  ```
  src/
    components/
      CourseActions.ios.tsx
      CourseActions.android.tsx
    App.tsx
  ```
  Hai implementation expose **cùng interface**; `App.tsx` chỉ `import CourseActions from './components/CourseActions';`.

### RTL và Logical Spacing
- Ngôn ngữ LTR vs RTL (Ả Rập, Hebrew). Khi đổi hướng, `start`/`end` đổi theo; Yoga dùng layout direction khi tính layout. Mục tiêu: **một layout duy nhất thích ứng**, không phải hai giao diện.
- `direction: 'ltr' | 'rtl'` xác định hướng layout của hierarchy, truyền xuống con:
```js
const isRTL = locale.textDirection === 'rtl';
const effectiveDirection = isRTL ? 'rtl' : 'ltr';
```
```jsx
<View style={[styles.directionRoot, { direction: effectiveDirection }]}>
  {/* toàn bộ UI */}
</View>
```
- **Localization** quyết định nội dung/ngôn ngữ; **layout direction** quyết định bố trí — xử lý cùng nhau nhưng không phải một. `expo-localization`:
```js
const locales = useLocales();
const locale = locales[0];
// Có thể đọc: locale.languageCode, locale.languageTag, locale.textDirection
```
- **Logical properties**: thay `marginLeft/Right`, `paddingLeft/Right` (cạnh vật lý) bằng `marginStart`, `marginEnd`, `paddingStart`, `paddingEnd`… khi ý nghĩa là "đầu/cuối":
```js
// Thay vì
paddingLeft: 24, paddingRight: 24,
// Viết
paddingStart: 24, paddingEnd: 24,

leadingIcon: { marginEnd: 14 }  // LTR: [Icon] -14- Text ; RTL: Text -14- [Icon]

badge: { position: 'absolute', top: 12, end: 12 }  // LTR: end = right ; RTL: end = left
```
- RN 0.87 có thêm CSS-like logical properties: `marginInlineStart/End`, `paddingInlineStart/End`, `insetInlineStart/End`.
- **Text alignment**: Text **không hỗ trợ** `textAlign: 'start' | 'end'` (chỉ `auto`, `left`, `right`, `center`, `justify`). Muốn bám logical start → đặt **`textAlign: 'left'`** (LTR căn trái, RTL hoạt động như start và căn phải); để default không đảm bảo. (https://docs.expo.dev/guides/localization/#text-alignment)
- **Directional icons**: icon không mang hướng (Search, Settings, Home, Favorite, Delete) giữ nguyên; icon điều hướng (Back, Forward, Previous, Next, Chevron) phải theo direction — dùng `I18nManager.isRTL` nếu thư viện icon không tự xử lý.
- `I18nManager.forceRTL(true)`: ép RTL, **chủ yếu để test**; có hiệu lực đầy đủ ở lần khởi động sau và persist. Production xác định direction từ localization, không dùng như theme toggle.
- Snack: `3-4_rtl-awarelayout` (Arabic).

---

## 3.5. NativeWind
Thư viện mã nguồn mở dùng **utility class của Tailwind CSS** cho React Native (https://www.nativewind.dev).
- **Không phải thư viện component** — chỉ styling.
- **Compiler**: trên native, phân tích utility classes và chuẩn bị RN styles lúc build; runtime layer cho style phụ thuộc state, media query, điều kiện động.

### Cài đặt
- Hướng dẫn: https://www.nativewind.dev/docs/getting-started/installation
- File `global.css` báo cảnh báo **"Unknown at rule @tailwind"** — chỉ là cảnh báo của CSS Language Server trong VS Code, **không phải lỗi runtime**. Sửa: cài extension **Tailwind CSS IntelliSense** (Tailwind Labs), rồi *Select Language Mode → Tailwind CSS*.
- **Project dùng expo-router:**
  - `tailwind.config.js`, sửa `content`:
    ```js
    // mặc định
    content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
    // sửa thành
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    ```
  - Chuyển `import "./global.css"` vào `_layout.tsx` với đường dẫn đúng:
    ```tsx
    import { Stack } from "expo-router";
    import "../../global.css";

    export default function RootLayout() {
      return <Stack />;
    }
    ```
- Chạy ví dụ phần này trong môi trường đã cài NativeWind đầy đủ, **không chạy trên Snack**.

### StyleSheet ↔ utility classes
| React Native Style | NativeWind Utility |
|---|---|
| `flex: 1` | `flex-1` |
| `flexDirection: 'row'` | `flex-row` |
| `alignItems: 'center'` | `items-center` |
| `justifyContent: 'space-between'` | `justify-between` |
| padding theo spacing scale | `p-4` |
| gap theo spacing scale | `gap-3` |
| borderRadius theo radius scale | `rounded-2xl` |
| `backgroundColor: '#fff'` | `bg-white` |
| Typography theo theme | `text-xl font-bold` |
| `width: '100%'` | `w-full` |

`p-4`, `gap-3`, `rounded-2xl`, `text-xl` lấy giá trị từ theme; NativeWind v4 trên native có **rem mặc định = 14** → không ánh xạ 1-1 với số trong StyleSheet.

### Interaction states
Thay vì `pressed && ...`, dùng modifier trong className:
```jsx
<Pressable
  className="
    bg-blue-600
    active:bg-blue-700
    active:scale-[0.98]
  "
>
```
| Modifier | Trạng thái | Cơ chế RN |
|---|---|---|
| `active:` | Đang nhấn | `onPressIn` / `onPressOut` |
| `focus:` | Đang focus | `onFocus` / `onBlur` |
| `disabled:` | Bị vô hiệu hóa | `disabled={true}` |
| `group-active:` | Parent đang active | State của parent |
| `group-focus:` | Parent đang focus | State của parent |
| `placeholder:` | Placeholder text | Placeholder của TextInput |
(https://www.nativewind.dev/docs/core-concepts/states)

**Group state** — child phản ứng theo trạng thái parent (vd Course Card: nhấn card đổi màu nền, title, icon, chevron) mà không truyền `pressed` xuống:
```jsx
<Pressable className="group/card">
  <Text
    className="
      text-slate-900
      group-active/card:text-blue-700
    "
  >
```

**Điều kiện hoạt động**: pseudo-class không tạo khả năng tương tác cho component không có. `<View className="active:bg-red-500">` **không** tương đương Pressable. `active:` cần `onPressIn/onPressOut`; `focus:` cần `onFocus/onBlur`; `hover:` cần `onHoverIn/onHoverOut` (hoạt động với Pressable, TextInput; không với View, Text).

**`active:` không phải application state** — chỉ trạng thái tạm thời khi đang giữ ngón tay. Không dùng cho state kéo dài (selected, favorite, completed, expanded, error, loading) — những cái đó là React state:
```jsx
const [selected, setSelected] = useState(false);
className={selected ? 'bg-blue-600' : 'bg-white'}
```
Snack: `3-5_nativewind` (active:, focus:, disabled:, group-active:, placeholder).

### Responsive variants
- Breakpoint variants `sm:`, `md:`, `lg:`, `xl:`, `2xl:` áp dụng theo **window width** trên native; tự cập nhật khi xoay/split-screen.
```jsx
<View className="flex-col md:flex-row">
// width < md → flex-col ; width >= md → flex-row  (md không phải "thiết bị medium")
```
- **Mobile-first**: utility không prefix là mặc định mọi kích thước; prefix override khi window **đạt hoặc lớn hơn** breakpoint:
```jsx
<View className="flex-col gap-4 p-4 md:flex-row md:p-6 lg:gap-6" />
// Mặc định: flex-col, gap-4, p-4 ; ≥ md: flex-row, p-6 ; ≥ lg: flex-row, p-6, gap-6
```
  `md:flex-row` vẫn hiệu lực ở lg, xl, 2xl nếu không bị override. (https://tailwindcss.com/docs/responsive-design)
- NativeWind cảnh báo default breakpoints thiết kế theo web (**sm=640, md=768, lg=1024**…). Breakpoint variant đặt trước hầu hết utility — không chỉ đổi số cột mà cả typography, spacing, width, alignment.
- **Chỉ đổi presentation/style → dùng variants**, không cần:
```jsx
const { width } = useWindowDimensions();
<View style={{ flexDirection: width >= 768 ? 'row' : 'column' }} />
```
- **Width ảnh hưởng logic/thuật toán → vẫn cần `useWindowDimensions()`** (vd `numColumns` của FlatList, quyết định render component):
```js
const { width } = useWindowDimensions();
const columns =
  width >= 1024
    ? 3
    : width >= 768
      ? 2
      : 1;
```
- Không mặc nhiên coi `md:` = Medium, `lg:` = Expanded. Tự định nghĩa breakpoint trong `tailwind.config.js`:
```js
theme: {
  extend: {
    screens: {
      medium: '600px',
      expanded: '900px',
    },
  },
},
```
```jsx
<View className="flex-col medium:flex-row expanded:gap-6">
```
- Snack: `3-5_responsivevariants`.

### Platform variants
NativeWind v4: `ios:`, `android:`, `web:`, `windows:`, `osx:`, `native:` (native: mọi native platform, không áp dụng web). (https://www.nativewind.dev/docs/core-concepts/differences)
```jsx
<Text
  className="
    text-base
    ios:tracking-tight
    android:tracking-normal
  "
>
// thay vì Platform.select({ ios: {...}, android: {...} }) chỉ để đổi vài style
```
| Mức khác biệt | Kỹ thuật |
|---|---|
| Nhỏ về style | Platform variants (`ios:`, `android:`…) |
| Logic/configuration | `Platform.select()` |
| Lớn về cấu trúc/behavior | Platform-specific files (`.ios.tsx`, `.android.tsx`) |

### Dark mode
- Hai cách: **System preference** (theo OS) và **Manual selection** (Light/Dark/System). Dùng RN Appearance ở native, `prefers-color-scheme` ở web; `dark:` tự phản ứng.
```jsx
<View
  className="
    bg-white
    dark:bg-slate-900
  "
>
  <Text
    className="
      text-slate-900
      dark:text-white
    "
  >
    Theme-aware content
  </Text>
</View>
```
- **Khai báo cả light và dark tường minh** (`text-slate-900 dark:text-white`, không chỉ `dark:text-white`) — RN có vấn đề khi style chỉ khai báo điều kiện mà thiếu giá trị nền.
- Manual theme: `colorScheme.set()`; lưu preference riêng (expo-sqlite, `@react-native-async-storage/async-storage`, `react-native-mmkv`) để khôi phục sau restart. (https://www.nativewind.dev/docs/core-concepts/dark-mode)

### Lưu ý: dynamic className
Tailwind **scan source code tĩnh**, không chạy JS, không hiểu string interpolation.
```jsx
// KHÔNG hợp lệ — source chỉ chứa "bg-${color}-500", không có literal "bg-blue-500"
const color = 'blue';
<View className={`bg-${color}-500`} />

// Hợp lệ — class đầy đủ xuất hiện trong source
className={
  active
    ? 'bg-blue-600'
    : 'bg-slate-200'
}
```
Luôn **ánh xạ props tới tên class tĩnh**:
```jsx
function Button({ color, children }) {
  const colorVariants = {
    blue: "bg-blue-600 hover:bg-blue-500 text-white",
    red: "bg-red-500 hover:bg-red-400 text-white",
    yellow: "bg-yellow-300 hover:bg-yellow-400 text-black",
  };
  return <button className={`${colorVariants[color]} ...`}>{children}</button>;
}
```
Nối chuỗi vẫn hợp lệ nếu các class đã viết đầy đủ, tĩnh:
```jsx
const badgeVariants = {
  info: {
    container: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
  },
};

className={`
  rounded-full
  border
  px-3
  py-2
  ${classes.container}
`}
```
Lý do: compiler dùng **static analysis** lúc build; runtime JS chỉ nối các class đã được generate sẵn. (https://tailwindcss.com/docs/detecting-classes-in-source-files · Snack: `3-5_nativewind-variants`)

### Custom component
NativeWind v4 giữ `className` khi đi qua custom component. Cách làm: (1) nhận prop `className`; (2) kết hợp với utility mặc định; (3) chuyển xuống core component. **Inline `style` có ưu tiên cao hơn `className`** (className không có precedence như style array). (https://www.nativewind.dev/docs/guides/custom-components)
```tsx
type AppTextProps = TextProps & {
  className?: string;
};

function AppText({ className = '', ...props }: AppTextProps) {
  return (
    <Text
      className={`
        text-base
        text-slate-900
        dark:text-slate-100
        ${className}
      `}
      {...props}
    />
  );
}

<AppText className="text-xl font-bold">Course title</AppText>
// text-base, text-slate-900, dark:text-slate-100 là mặc định; text-xl, font-bold do cha truyền
```
`className` chỉ tác động component nhận nó. Muốn consumer tùy biến nhiều vùng → **component API design**:
```tsx
type CourseCardProps = {
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

<View className={className}>
  <Text className={titleClassName}>...</Text>
  <Text className={subtitleClassName}>...</Text>
</View>
```

---

## Thảo luận
1. App chạy tốt trên phone, tablet, foldable, split-screen — thiết kế thế nào để không tạo riêng màn hình cho từng loại thiết bị?
2. Card đẹp với dữ liệu mẫu nhưng vỡ khi tên dài hoặc font lớn — thiết kế thế nào?
3. Form đăng ký: bàn phím che input cuối, nút Submit sát navigation bar — tổ chức màn hình thế nào?
4. Catalog 10.000 item, phone 1 cột, cửa sổ rộng 2–4 cột; ScrollView + flexWrap bị lag — thiết kế lại thế nào?
5. Hàng chục màn hình tự viết màu Light/Dark; đổi màu thương hiệu phải sửa nhiều file — tổ chức lại styling thế nào?
6. Nhiều team tự tạo Button, Card, Input, spacing riêng; sau một năm thiếu nhất quán — giải quyết ở cấp hệ thống thế nào?

## Bài tập — Course Dashboard (React Native + NativeWind)
Hoạt động tốt trên cửa sổ hẹp và rộng, hỗ trợ Light/Dark, thể hiện interaction states:
- Dùng SafeAreaView; không dựng giao diện bằng `position: 'absolute'` theo tọa độ. Course Card chịu được title dài mà không đẩy action/chevron ra khỏi màn hình.
- Ô tìm kiếm có placeholder, focus state, Light/Dark.
- Mỗi Course Card là Pressable, có ít nhất `active:` và `group-active:`; giữ card thì background, title, icon đổi màu.
- Mỗi course có nút Favorite hoặc Selected — phải là **React state**, không dùng `active:`.
- Cửa sổ hẹp: một cột; đạt breakpoint thích hợp: Main content + Side panel.
- Mọi thành phần hiển thị hợp lý ở Light và Dark.
- Ít nhất một khác biệt nhỏ iOS/Android bằng NativeWind platform variant.
- Tự xây **static class mapping** ánh xạ `CourseCategory` → NativeWind classes cho category badge.
- Dữ liệu mẫu: https://snack.expo.dev/@duyphamnhat/3_exercisedata · Tham khảo: https://drive.google.com/file/d/1fnvwlcPv0VWki7qruCSB1auaL_QlMgeV/view?usp=sharing
- Nộp trên website môn học.
