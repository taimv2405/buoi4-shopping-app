# Chương 4. Navigation

> Nguồn: `04 - Navigation.pdf` (128 slide). Code ngắn trong slide nằm dưới dạng ảnh, đã được chép lại bằng cách đọc trực tiếp ảnh. Các ví dụ đầy đủ nằm trên Expo Snack / Google Drive (link giữ nguyên); slide chỉ có ảnh chụp kết quả (Android và iOS) nên được lược bỏ.
> Phiên bản đề cập trong slide: React Navigation 7.x, Expo SDK 53+ (Protected Routes).

## Mục tiêu
Thiết kế navigation tree cho một ứng dụng RN thực tế, chọn đúng navigator, tổ chức route có TypeScript type safety và xử lý các luồng đặc biệt như modal, xác thực, deep link, màn hình lồng nhau. Mục tiêu không dừng ở chuyển từ màn hình A sang B, mà hướng tới hệ thống navigation dễ mở rộng, đúng kỳ vọng UX mobile, có history, Back behavior, deep linking và lifecycle được kiểm soát rõ ràng.

Sau bài học:
1. Giải thích navigation state, route, screen, navigator.
2. Phân biệt và lựa chọn phù hợp giữa React Navigation và Expo Router.
3. Xây dựng các Navigators với cấu hình thực tế, responsive layout và Back behavior phù hợp.
4. Truyền route params có TypeScript type safety.
5. Tùy biến header theo route params, local state và hành động người dùng.
6. Cấu hình deep linking cho cold start và warm state.
7. Thiết kế authentication flow với conditional navigation / protected routes.
8. Responsive navigation và routing với Expo Router.

Nội dung: 4.1 Navigation trong mobile app · 4.2 React Navigation và Expo Router · 4.3 Các loại Navigations phổ biến · 4.4 Route params và TypeScript type safety · 4.5 Header customization · 4.6 Deep linking · 4.7 Authentication và Protected Navigation · 4.8 Navigation lifecycle và events · 4.9 Các vấn đề nâng cao · 4.10 Expo Router.

---

## 4.1. Navigation trong mobile app
- **Navigation**: cơ chế quản lý "người dùng đang ở đâu, có thể đi đâu tiếp theo và quay lại bằng cách nào" trong toàn bộ ứng dụng.
- Trên mobile, navigation không chỉ là thay đổi component: còn liên quan đến lịch sử màn hình, nút Back Android, swipe-back iOS, tab bar, drawer, modal, deep link và trạng thái khởi động ứng dụng.
- Thiết kế navigation tốt phải phản ánh **cấu trúc nghiệp vụ** của ứng dụng, không chỉ cấu trúc thư mục source code.
- Hình minh họa (nguồn reactnavigation.org): Stack, Tabs, Modal, Drawer, Deep linking. Chi tiết: https://reactnavigation.org/

### Khái niệm
- **Route**: một mục trong navigation state; thường có `name`, `key` và có thể chứa `params`.
- **Screen**: React component được render cho một route cụ thể; nhận `navigation` và `route` props từ navigator sở hữu nó.
- **Navigator**: quản lý một tập route theo một mô hình nhất định (Stack, Bottom Tabs, Drawer…).
- **NavigationContainer**: giữ navigation tree ở mức gốc, phối hợp deep link, theme, state restoration và các sự kiện thay đổi navigation state.

### Các pattern phổ biến
| Pattern | Quan hệ màn hình | Ví dụ thực tế |
|---|---|---|
| Stack | Màn hình sau nằm trên màn hình trước | Danh sách → Chi tiết → Thanh toán |
| Bottom Tabs | Các đích cấp cao ngang hàng | Home / Search / Notifications / Profile |
| Drawer | Nhiều nhóm chức năng cấp cao | Dashboard / Projects / Reports / Settings |
| Modal | Tác vụ tạm thời hoặc cần tập trung | Create post / Filter / Checkout confirmation |
| Deep Link | Đi trực tiếp từ bên ngoài vào route cụ thể | Push notification → OrderDetails |

### Lưu ý
- Không dùng Stack cho mọi thứ. Các đích cấp cao ngang hàng → Bottom Tabs hoặc Drawer phản ánh mental model tốt hơn.
- Nếu UX yêu cầu màn hình chi tiết **che tab bar**, đặt nó ở **Root Stack bên ngoài Tabs**, không đặt bên trong tab.
- Nút Back phải đưa người dùng về trạng thái có ý nghĩa. Chỉ reset navigation history khi thực sự cần — lịch sử bị thay đổi bất ngờ gây UX khó hiểu.
- Android: nút Back hệ thống là phần quan trọng của navigation; navigator phải quyết định Back sẽ pop stack, đổi tab, đóng drawer hay thoát app.
- iOS: swipe-back và transition theo native convention tạo kỳ vọng rất mạnh. Native Stack tận dụng `UINavigationController` để cung cấp hành vi này tự nhiên hơn.
- Điều hướng tốt không chỉ đúng kỹ thuật mà phải nhất quán với kỳ vọng từng nền tảng, không làm người dùng "mất phương hướng".

---

## 4.2. React Navigation và Expo Router
- **React Navigation**: thư viện routing/navigation linh hoạt cho RN. Developer định nghĩa navigator và route bằng code, kiểm soát trực tiếp navigation tree; dùng được cả dynamic lẫn static configuration. (https://reactnavigation.org/)
- **Expo Router**: xây trên hệ sinh thái React Navigation nhưng dùng **file-based routing**. Page files trong `app/` hoặc `src/app/` ánh xạ tự nhiên thành route; `_layout.tsx`, route groups và special files đảm nhiệm cấu trúc/xử lý đặc biệt. (https://docs.expo.dev/router/introduction/)

| Tiêu chí | React Navigation | Expo Router |
|---|---|---|
| Khai báo route | Config-based bằng code | File-based theo thư mục `app/` |
| Kiểm soát navigator | Rất trực tiếp | Thông qua layout files và convention |
| Deep linking | Cấu hình linking object | Tự nhiên cho từng route |
| Typed routes | TypeScript ParamList / static API | Có thể generate typed routes |
| Web / URL | Cấu hình thêm | URL là khái niệm cốt lõi |
| Phù hợp | Dự án cần navigation tree tùy biến sâu | Dự án Expo mới, universal app, file routing |

- Expo hiện khuyến nghị Expo Router cho nhiều project Expo mới (file-based routing, automatic deep linking, typed routes). React Navigation vẫn phù hợp khi cần điều khiển navigation tree trực tiếp bằng code.
- **Không chọn chỉ vì công nghệ mới hơn** — chọn theo route model, yêu cầu web/deep-link, mức độ tùy biến navigator và khả năng bảo trì của team.
- **Với NativeWind**: option object của React Navigation (`headerStyle`, `tabBarStyle`, `drawerStyle`) không phải React component → vẫn dùng style object, không dùng `className`. Muốn dùng NativeWind cho header/tab bar/drawer content → xây **custom component** rồi truyền cho React Navigation.

### Hai cách khai báo cấu hình React Navigation
| Cách cấu hình | Đặc điểm | Trường hợp sử dụng |
|---|---|---|
| Dynamic API | `<Stack.Navigator>` và `<Stack.Screen>` trong JSX | Dễ học, linh hoạt, rất phổ biến trong codebase hiện hữu |
| Static API | Tạo navigator từ object config | Type inference tốt, thuận lợi cho deep linking và cấu hình tĩnh |

> Để quan sát rõ navigator tree trong `App.tsx`, các ví dụ React Navigation về sau dùng **Dynamic API**.

---

## 4.3. Các loại Navigations phổ biến
4.3.1 Native Stack · 4.3.2 Bottom Tab · 4.3.3 Drawer · 4.3.4 Nested Navigators.

### 4.3.1. Stack Navigation
- Mô phỏng một chồng màn hình: push route mới → nằm trên màn hình hiện tại; pop/goBack → màn hình trên cùng bị loại khỏi stack.
- **Native Stack** dùng API native iOS/Android → transition và gesture theo nền tảng, thường mượt hơn Stack viết hoàn toàn bằng JavaScript.
- Phù hợp flow tuyến tính/drill-down: Catalog → ProductDetails → Checkout, ChatList → Conversation, Settings → SubSettings.
- Chi tiết: https://reactnavigation.org/docs/stack-navigator/ · https://reactnavigation.org/docs/native-stack-navigator/

Các navigation method có ý nghĩa khác nhau đối với history:
| Method | Ý nghĩa | Tình huống phù hợp |
|---|---|---|
| `navigate(name, params)` | Đi tới route, có thể cập nhật params, thêm destination… | Đi tới một màn hình logic duy nhất |
| `push(name, params)` | Luôn thêm một route mới lên stack | Mở nhiều detail cùng loại liên tiếp |
| `goBack()` | Quay lại route trước nếu có | Nút Back tùy chỉnh |
| `pop(n)` | Bỏ n route ở đỉnh stack | Thoát nhiều bước trong flow |
| `popToTop()` | Quay về route đầu stack | Kết thúc flow phụ |
| `replace(name, params)` | Thay route hiện tại | Splash → Home hoặc bước không nên quay lại |

Lưu ý:
- Không dùng `push()` theo thói quen cho mọi chuyển màn hình → dễ tạo stack dài với nhiều bản sao cùng route.
- Native Stack hỗ trợ nhiều `presentation`: `card` (mặc định), `modal`, `transparentModal`, `formSheet`… Presentation nên phản ánh **ngữ nghĩa tác vụ**, không chỉ để "trang trí animation".
- Modal dùng cho tác vụ tạm thời hoặc flow phụ cần tập trung (chọn bộ lọc, tạo nội dung, xác nhận thanh toán). Nếu modal thành phần của luồng chính, nhiều bước → cân nhắc stack riêng hoặc route bình thường.
- `getId` xác định identity của route theo params: nếu route cùng name và cùng ID đã tồn tại, `navigate()` có thể đưa route đó về focus thay vì tạo instance mới (React Navigation 7.x).
- `navigation.preload()` render screen ở background trước khi navigate — phù hợp màn hình nặng hoặc cần tải dữ liệu sớm. Screen đang preload **chưa thể** dispatch navigation action, `setOptions` hoặc nghe navigator events cho tới khi thực sự được điều hướng tới.

**Ví dụ** (Snack: https://snack.expo.dev/@duyphamnhat/4-3-1_stacknavigation): người dùng lần lượt mở Home → Product P-101 → Product P-202 bằng `push()`. Stack: `Home (bottom) → P-101 → P-202 (top)`.
- Home dùng `navigate()` để mở Details lần đầu; Details dùng `push()` để tạo thêm instance cùng route khi mở sản phẩm liên quan.
- Checkout cấu hình dạng **modal** để minh họa tác vụ tách biệt về trải nghiệm.

### 4.3.2. Bottom Tab Navigation
- Phù hợp với các đích cấp cao có mức ưu tiên tương đương, người dùng chuyển qua lại thường xuyên (Home, Search, Notifications, Profile).
- Route trong Bottom Tabs được **lazy-initialize** mặc định: screen chỉ mount khi tab được focus lần đầu.
- Trạng thái mỗi tab thường **được giữ lại** khi chuyển tab — khác tư duy "mỗi lần bấm tab là tạo màn hình mới".
- Tab bar tốt: giới hạn số đích chính, label rõ nghĩa, icon có semantic dễ nhận biết. Quá nhiều tab giảm khả năng quét, tăng bấm nhầm.
- Chi tiết: https://reactnavigation.org/docs/bottom-tab-navigator
- `tabBarBadge`: cho số thông báo/trạng thái cần chú ý, nhưng không biến badge thành tín hiệu gây áp lực liên tục.
- `tabBarHideOnKeyboard`: tránh tab bar chiếm chỗ khi nhập liệu trên màn hình nhỏ.
- `backBehavior`: hành vi khi Back được gọi trong tab navigator:

| Giá trị | Hành vi |
|---|---|
| `firstRoute` | Quay về tab đầu tiên được khai báo |
| `initialRoute` | Quay về `initialRouteName` |
| `history` | Quay lại tab đã truy cập gần nhất |
| `fullHistory` | Quay lại theo toàn bộ lịch sử truy cập, giữ cả các lần truy cập lặp |
| `order` | Đi về tab đứng trước trong thứ tự khai báo |
| `none` | Tab navigator không tự xử lý Back |

- `backBehavior="history"`: Tab Navigator ghi nhớ thứ tự tab đã truy cập; khi Back (nút/gesture Android hoặc `navigation.goBack()`) → quay về tab dùng gần nhất thay vì luôn về tab đầu.
- **`tabBarPosition`**: `bottom`, `top`, `left`, `right` → cùng một navigator có thể chuyển thành sidebar trên tablet mà không cần navigation system khác. Ví dụ: bottom tab khi available width < 768 logical units, chuyển sang trái khi tablet/cửa sổ rộng.
- Responsive navigation nên dựa vào **available width** bằng `useWindowDimensions()`, không suy luận theo tên thiết bị "phone/tablet" (phone landscape có width lớn nhưng height rất nhỏ).
- **Native Bottom Tabs** dùng primitive native, hỗ trợ khả năng mới của nền tảng như iOS 26, nhưng API hiện vẫn **unstable** trong 7.x. (https://reactnavigation.org/docs/native-bottom-tab-navigator)
- Cần tab bar tùy biến hoàn toàn bằng NativeWind → xây custom `tabBar` component thay vì truyền `className` vào option object.
- Ví dụ: https://snack.expo.dev/@duyphamnhat/4-3-2_bottomtabnavigation

### 4.3.3. Drawer Navigation
- Phù hợp khi app có nhiều nhóm chức năng cấp cao, khi Bottom Tabs không đủ chỗ biểu diễn rõ các destination, cần navigation sidebar trên màn hình rộng, hoặc cần chứa chức năng phụ truy cập được từ nhiều màn hình (hệ thống quản trị, app doanh nghiệp, productivity app).
- **Không** dùng Drawer để giấu chức năng quan trọng cần truy cập liên tục; trên phone, đích quan trọng hợp với Bottom Tabs hơn.
- Drawer phụ thuộc `react-native-gesture-handler` (gesture) và `react-native-reanimated`/worklets (animation). Chi tiết: https://reactnavigation.org/docs/drawer-navigator
- `drawerType` đổi theo kích thước màn hình: phone → `front`/`slide` (overlay quen thuộc); tablet → `permanent` (layout master-detail hiệu quả hơn).
- `drawerContent`: xây drawer tùy chỉnh với thông tin tài khoản, nhóm menu, footer, nút đăng xuất, liên kết hỗ trợ.
- Custom drawer content dùng `DrawerContentScrollView` (xử lý notch và scrolling tốt hơn ScrollView thường) + `DrawerItemList` để giữ routing chuẩn, bổ sung phần tài khoản và action riêng bằng NativeWind v4.
- Ví dụ (drawerType → `permanent` khi available width đủ lớn): https://snack.expo.dev/@duyphamnhat/4-3-3_drawernavigation

### 4.3.4. Nested Navigators
- **Nested Navigators**: một screen của navigator cha render một navigator con. Cần thiết cho app thực tế nhưng rất dễ bị lạm dụng.
- Pattern phổ biến: **Root Stack** chứa Main Tabs và các màn hình toàn cục (ProductDetails, Modal); mỗi tab có thể chứa Stack riêng khi cần drill-down nội bộ.
- Cấu trúc navigator phản ánh UX: **UI của navigator cha luôn render bên trên navigator con** → vị trí nesting quyết định tab bar/drawer có còn thấy khi đi sâu vào chi tiết.
  - ProductDetails trong Home Stack dưới Tabs → tab bar thường vẫn còn.
  - ProductDetails ở Root Stack bên ngoài Tabs → màn hình mới có thể che tab bar.
- Vì vậy thiết kế navigator tree phải bắt đầu từ **trải nghiệm mong muốn**, không phải "thư mục hiện có trông như thế nào". Chi tiết: https://reactnavigation.org/docs/nesting-navigators

**Kiến trúc nested phổ biến:** `Root Stack → Drawer → Tabs → Per-tab Stack`, tương ứng các cấp: Global navigation · Module navigation · Primary destination navigation · Local drill-down navigation.
> Đây là ví dụ minh họa các cấp navigation, không phải cấu trúc mặc định cho mọi app. Chỉ thêm navigator khi có lý do UX/history rõ ràng.

- **Mỗi Tab có history riêng**: Search → Search Results, chuyển sang Profile → Edit Profile, rồi quay lại Search → Search Stack vẫn ở Search Results; Profile Stack vẫn giữ Profile → Edit Profile.
- Mỗi navigator duy trì navigation state độc lập; Back được xử lý ở navigator hiện tại trước, rồi mới **bubble lên parent** nếu không xử lý được.
- Không phải mọi Drawer item đều là một Screen đơn giản — một destination có thể là cả một navigation subsystem (tương tự cho các navigator khác).

**Điều hướng xuyên nhiều tầng** — luồng Reports → Workspace → SearchTab → Search, ReportsScreen truyền `initialQuery`:
```ts
navigation.navigate('Workspace', {
  screen: 'SearchTab',
  params: {
    screen: 'Search',
    params: {
      initialQuery: 'navigation',
    },
  },
});
```
`NavigatorScreenParams` là utility của React Navigation để type-check các nested route.

**Global Screens** — `CreateTask` đặt ở Root Stack nên mở được từ Home, Projects, Task, BoardReports… mà không duplicate modal trong từng navigator:
```tsx
<RootStack.Screen
  name="CreateTask"
  component={CreateTaskScreen}
  options={{
    presentation: 'modal',
  }}
/>
```

**Screen options resolution:**
- Screen chỉ cấu hình được options của **navigator trực tiếp render nó**. Screen trong HomeStack không thể đặt `tabBarLabel` cho Tab navigator chỉ bằng options của chính nó.
- Header ở Root Stack cần đổi theo tab đang focus → đọc route của child navigator bằng `getFocusedRouteNameFromRoute`, thay vì cố chỉnh header từ screen tầng sâu.
- Hiểu cơ chế này tránh lỗi "đặt option nhưng không có tác dụng". Chi tiết: https://reactnavigation.org/docs/screen#options · https://reactnavigation.org/docs/screen-options

**Lưu ý khác:**
- Navigate đến screen trong navigator con bằng các trường `screen` và `params`; `screen` và các key liên quan là tên **dành riêng** cho nested navigation API.
- TypeScript: `NavigatorScreenParams<T>` mô tả chính xác param của route chứa navigator con.
- Không nest cùng loại navigator nhiều tầng nếu không có lý do UX rõ ràng; nesting sâu làm TypeScript, deep linking, analytics và debugging phức tạp hơn.
- Điều hướng từ screen sâu lên Root Stack → type rõ parent navigation, tránh lạm dụng `getParent()` nhiều tầng trong production. Nguyên tắc: **giảm nesting tới mức tối thiểu** nhưng vẫn diễn tả đúng UX và Back history.
- Ví dụ Drawer + Tabs + Stack: https://snack.expo.dev/@duyphamnhat/4-3-4_nestednavigators

---

## 4.4. Route params và TypeScript type safety
- **Params**: metadata tối thiểu cần để xác định màn hình đích (`productId`, `userId`, `sortMode`, `source`).
- Không truyền toàn bộ object lớn, function, class instance hoặc dữ liệu không serializable. Params serializable giúp state persistence và deep linking đáng tin cậy.
- Pattern tốt: truyền ID qua params, màn hình đích đọc dữ liệu mới nhất từ API, query cache hoặc global store. Chi tiết: https://reactnavigation.org/docs/params

| Nên truyền | Không nên truyền |
|---|---|
| `productId: "P-101"` | Toàn bộ Product object có nhiều field và method |
| `source: "search"` | Function callback `onSave` |
| `filter: "latest"` | Class instance / Date object nếu không serialize rõ ràng |
| `page: 2` | Token bí mật hoặc dữ liệu nhạy cảm |

```ts
// Nên
{
  productId: 'P-101',
  source: 'search'
}

// Không nên
{
  product: entireProductObject,
  onSave: callback,
  databaseConnection: object,
  authToken: secret
}
```

Pattern: `Route (productId) → ProductScreen → API / Query Cache / Store → Latest Product Data`.

**TypeScript:**
- `RootStackParamList` biến tên route và shape của params thành contract TypeScript; `navigation.navigate()` và `route.params` được type-check ngay khi viết code.
- `NativeStackScreenProps<ParamList, RouteName>` type trực tiếp cả `navigation` và `route` props của một screen.
- Codebase lớn: đặt ParamList và helper type trong `navigation/types.ts` thay vì khai báo lặp lại ở từng screen.
- Ví dụ: https://snack.expo.dev/@duyphamnhat/4-4_typedparams

**`setParams()` không phải State Management** — cập nhật params route hiện tại theo kiểu shallow merge:
```ts
// Hợp lý: cập nhật metadata của route
navigation.setParams({
  source: 'search',
});

// Không nên: dùng như nơi lưu trữ state của ứng dụng
navigation.setParams({
  shoppingCart: bigObject,
});
```
Dữ liệu sống lâu hơn một route hoặc được nhiều màn hình dùng → đặt ở server-state/global-state layer, chỉ truyền ID/metadata tối thiểu qua params.

---

## 4.5. Header customization
- `screenOptions` cấu hình mặc định cho toàn navigator; `options` trên Screen ghi đè cho từng route; **function options** có thể dùng `route`/`navigation` để tạo cấu hình động.
- `headerLeft`/`headerRight` cho action quan trọng gắn với màn hình: Back tùy chỉnh, Search, Favorite, Save, Add. Không chứa quá nhiều action — action ít dùng chuyển vào overflow menu hoặc nội dung màn hình.
- Header phụ thuộc state trong screen → `navigation.setOptions()` cập nhật title/action tại runtime.
- `useLayoutEffect` thường phù hợp khi cập nhật header từ state, tránh một frame hiển thị cấu hình cũ trước khi effect chạy.
- Header hoàn toàn tùy biến bằng NativeWind → cung cấp **custom header component**, không cố truyền `className` vào `headerStyle`.
- Native Stack hỗ trợ khả năng theo nền tảng: large title, native search bar, form sheet, native transition — chỉ bật khi phù hợp platform convention.
- Option chỉ có trên iOS không được thành dependency bắt buộc của nghiệp vụ; Android cần fallback phù hợp. Chi tiết: https://reactnavigation.org/docs/header-buttons
- Ví dụ: `title` cấu hình động từ `route.params`; `useLayoutEffect` + `navigation.setOptions()` cập nhật header action theo trạng thái màn hình. Snack: https://snack.expo.dev/@duyphamnhat/4-5_headercustomization

---

## 4.6. Deep linking
- **Deep linking**: URL mở trực tiếp một route cụ thể thay vì chỉ mở màn hình đầu. Ví dụ `rnnav://product/P-500` mở thẳng Product Details.
- Cần xử lý hai trường hợp: **cold start** (app chưa chạy) và **warm state** (app đang chạy). Trong Dynamic API, React Navigation xử lý cả hai qua **`linking` prop**.
- Không tự điều khiển deep link bằng navigation ref nếu linking configuration diễn tả được route — dễ sai, khó đồng bộ với navigation state.
- Chi tiết: https://reactnavigation.org/docs/deep-linking

| Loại link | Ví dụ | Đặc điểm |
|---|---|---|
| Custom scheme | `rnnav://product/P-500` | Dễ cấu hình, phù hợp dev/test; scheme có thể bị app khác đăng ký |
| Universal Link (iOS) | `https://example.com/product/P-500` | Domain được liên kết với app, có fallback web |
| App Link (Android) | `https://example.com/product/P-500` | Domain verification giúp Android mở đúng app |

- Custom scheme khai báo trong `app.json`/`app.config` (vd `"scheme": "rnnav"`). Sau khi đổi scheme phải **rebuild** Development Build hoặc production app.
- **Expo Go không mang custom scheme của project** → dùng URL do `Linking.createURL()` tạo; custom scheme thực tế phải test trên Development Build/standalone app.
- Trong Expo, `Linking.createURL('/')` tạo prefix phù hợp giữa môi trường development và standalone/development build.
- Universal Links / App Links cần cấu hình domain association; phù hợp hơn custom scheme khi cần liên kết HTTPS có fallback web.
- `linking.config` ánh xạ route name → URL path. Dynamic segment `product/:productId` → `route.params.productId`.
- Nested navigators: linking config phải phản ánh đúng cấu trúc route — thêm một lý do tránh nesting quá sâu.
- Kiểm thử cả cold start (app đã bị kill) và warm state (đang chạy/background) — hai tình huống có thể đi qua đường xử lý khác nhau.
- Kiểm thử URL hợp lệ, URL thiếu params, ID không tồn tại, route yêu cầu quyền truy cập → đảm bảo deep link không bỏ qua validation nghiệp vụ.

### Ví dụ: ứng dụng thương mại điện tử (UIT Shop)
Snack: https://snack.expo.dev/@duyphamnhat/4-6_deeplinking

Trong `app.json`:
```json
"scheme": "uitshop",
```
```json
"plugins": [
  "expo-notifications"
]
```
Sau đó tạo Development Build theo thiết bị:
```bash
npx expo prebuild --clean
npx expo run:android   # hoặc: npx expo run:ios
```
Các thiết lập Navigation trong app hoạt động như bình thường (mở OD-2401 từ bên trong app; nếu chưa đăng nhập → màn hình "Cần đăng nhập" → đăng nhập và tiếp tục xem OD-2401).

**Incoming Deep Link (warm)** — app đang mở, link đến từ bên ngoài (app khác, QR scanner, hệ điều hành):
```bash
adb shell am start -W -a android.intent.action.VIEW -d "uitshop://orders/OD-2402?source=qr" com.duyphamnhat.uit
# Warning: Activity not started, intent has been delivered to currently running top-most instance.
# LaunchState: UNKNOWN (0)
# LOG [DeepLink] Incoming URL: uitshop://orders/OD-2402?source=qr
```
Luồng: App đang chạy → External deep link xuất hiện → Intent gửi vào MainActivity hiện tại → RN phát sự kiện URL → RN linking integration nhận URL event → parse URL → update navigation state → OrderDetails OD-2402.

**Cold Start Deep Link** — app hoàn toàn chưa chạy (người dùng bấm link trong email/tin nhắn lúc app đóng):
```bash
adb shell am start -W -a android.intent.action.VIEW -d "uitshop://orders/OD-2401?source=email" com.duyphamnhat.uit
# LaunchState: COLD
# LOG [DeepLink] getInitialURL() called
# LOG [DeepLink] Initial URL: uitshop://orders/OD-2401?source=email
```
Luồng: App chưa tồn tại → URL khởi động app → `getInitialURL()` → React Navigation tạo initial state → OrderDetails OD-2401.
> Trong production, phần này phải kết hợp token thật và authorization phía server; client-side navigation không thay thế kiểm tra quyền server.

**Link không hợp lệ:**
```bash
adb shell am start -W -a android.intent.action.VIEW -d "uitshop://orders/ABC?source=web" com.duyphamnhat.uit
```
- URL match `orders/:orderId` nên React Navigation tạo `orderId = "ABC"`.
- Nhưng validation `/^OD-\d{4}$/` không chấp nhận → "Liên kết không hợp lệ. "ABC" không phải mã đơn hàng hợp lệ."

**Link không tồn tại / không có quyền truy cập:**
```bash
adb shell am start -W -a android.intent.action.VIEW -d "uitshop://orders/OD-9999?source=email" com.duyphamnhat.uit
```
- `OD-9999` hợp lệ về format nhưng database không có → không tìm thấy đơn hàng.
- Production: kết quả từ API, vd `GET /api/orders/OD-9999` → **404 Not Found** hoặc **403 Forbidden**.
- Một số hệ thống cố ý không phân biệt 404 và 403 ở UI để tránh tiết lộ sự tồn tại của tài nguyên.

**Link từ thông báo của ứng dụng:** nút "Tạo thông báo đơn hàng sau 5 giây" → xin quyền thông báo → đưa app xuống background → bấm thông báo mở `uitshop://orders/OD-2401?source=push`. (Ví dụ giả lập thông báo cục bộ; cấp quyền và làm việc với thông báo trình bày ở các chương sau.)

---

## 4.7. Authentication và Protected Navigation
- Hầu hết app yêu cầu xác thực để truy cập dữ liệu người dùng hoặc nội dung riêng tư.
- Deep link trỏ vào route cần đăng nhập → phải xác định có cần lưu **intended destination** để quay lại đúng màn hình sau khi xác thực hay không.
- **Client-side navigation guard chỉ kiểm soát UX**; API vẫn phải xác thực token và authorization cho tài nguyên thật. Chi tiết: https://reactnavigation.org/docs/auth-flow
- Từ **Expo SDK 53**, Expo Router hỗ trợ **Protected Routes** qua `Stack.Protected`, `Tabs.Protected`, `Drawer.Protected` để giới hạn route dựa trên guard ở client. Khi guard thay đổi và route hiện tại không còn được phép → router chuyển về anchor route hoặc route khả dụng.
- Protected Routes **không thay thế** server-side authentication/authorization.
- Ví dụ React Navigation: conditional route groups với **`navigationKey`** để loại bỏ history của luồng cũ khi auth state thay đổi. (Ví dụ Protected Routes của Expo ở mục 4.10.) Snack: https://snack.expo.dev/@duyphamnhat/4-7_authentication

---

## 4.8. Navigation lifecycle và events
- Screen có thể **vẫn mounted khi mất focus** → `useEffect([])` không đồng nghĩa với "mỗi lần người dùng quay lại màn hình".
- `useFocusEffect`: chạy effect khi screen focus, cleanup khi blur hoặc unmount — phù hợp cho subscription, refresh dữ liệu, resource gắn với visibility. Callback nên bọc bằng `useCallback` để tránh chạy lại mỗi render khi đang focus.
- `usePreventRemove`: chặn route bị remove do Back button, gesture hoặc navigation action — phù hợp form/editor còn thay đổi chưa lưu. Callback nhận **action ban đầu**; sau khi người dùng xác nhận, dispatch lại action đó để tiếp tục đúng hành vi thay vì tự đoán màn hình cần quay về.

| API / Event | Trường hợp sử dụng |
|---|---|
| `useFocusEffect` | Fetch/subscribe khi screen focus và cleanup khi blur |
| `useIsFocused` | Render UI hoặc logic phụ thuộc trạng thái focus hiện tại |
| `focus` / `blur` events | Khi cần event listener cụ thể |
| `transitionEnd` | Hoãn tác vụ nặng tới khi transition của stack kết thúc |
| `usePreventRemove` | Chặn rời screen khi còn thay đổi chưa lưu |

Chi tiết: https://reactnavigation.org/docs/navigation-lifecycle/ · Ví dụ: https://snack.expo.dev/@duyphamnhat/4-8_navigation-lifecycle-events (ảnh chụp trên cả Android và iOS):
- **Dashboard**: dữ liệu được tải trước; sau ~6 giây realtime event xuất hiện. Dashboard chỉ giữ kết nối realtime khi người dùng thực sự đang xem màn hình (đếm "Số lần focus").
- **transitionEnd**: tác vụ nặng như rich editor, chart engine, computation được trì hoãn tới sau transition để tránh cạnh tranh tài nguyên với animation ("Editor tools: Đã khởi tạo sau transition").
- **usePreventRemove**: sửa ghi chú chưa lưu rồi bấm Back → hộp thoại "Bỏ thay đổi?" (Ở lại / Bỏ thay đổi).
- Sửa note chưa lưu rồi bấm "Mở hướng dẫn định dạng" → EditNote chỉ chuyển **focused → unfocused**, chưa bị removed (vẫn mounted) → `usePreventRemove` không cảnh báo, local state của editor vẫn được giữ.

---

## 4.9. Các vấn đề nâng cao
**Modal và reset:**
- Modal route nên đặt ở root khi nhiều khu vực trong app có thể mở nó → tránh duplicate modal screen ở nhiều stack con.
- `navigation.reset()` / `CommonActions.reset()` viết lại navigation history; tài liệu React Navigation cảnh báo việc này thường tạo UX khó hiểu và có thể không đồng bộ với browser history trên web.
- Ưu tiên flow tự nhiên; chỉ reset khi thay đổi ngữ cảnh thật sự (onboarding hoàn tất, auth boundary thay đổi theo kiến trúc route).

**State persistence:**
- Khôi phục vị trí người dùng sau khi app restart, nhưng phải **ưu tiên deep link** nếu app được mở từ URL bên ngoài.
- Chỉ bật khi có giá trị UX rõ ràng — khôi phục màn hình cũ sau nhiều ngày có thể gây nhầm nếu dữ liệu/quyền đã thay đổi.
- Cần **version key** và chiến lược invalidate state khi navigation structure thay đổi giữa các bản phát hành.

**Analytics:**
- Screen tracking thường dùng `onReady` và `onStateChange` của `NavigationContainer` để xác định route hiện tại.
- Dùng route semantic ổn định thay vì title hiển thị (title có thể được dịch hoặc đổi theo params).
- Không gửi dữ liệu nhạy cảm trong route name/params lên analytics nếu không có chính sách rõ ràng.

**Performance:**
- Native Stack dùng native APIs cho transition; Bottom Tabs lazy-initialize route; `react-native-screens` tối ưu view hierarchy theo navigator và cấu hình.
- Navigation không bù được cho screen render quá nặng (mount danh sách lớn, parse dữ liệu nặng, computation đồng bộ → transition vẫn bị ảnh hưởng).
- `navigation.preload()` mount screen trước để giảm độ trễ cảm nhận; trong Stack, screen preload chưa thể dispatch action hoặc `setOptions` cho tới khi được navigate tới.

**Accessibility:**
- Custom button thay icon phải có accessibility label rõ nghĩa — icon không label khiến người dùng screen reader không biết chức năng.
- Touch target của header button/custom tab đủ lớn; `hitSlop` hữu ích khi icon nhỏ nhưng vùng tương tác cần rộng.
- Không dựa duy nhất vào màu để biểu thị tab active hoặc trạng thái route; label và icon state vẫn phải dễ nhận biết.

**Responsive:**
- Dùng `useWindowDimensions()` và available width để chuyển Bottom Tabs → sidebar, hoặc Drawer → permanent drawer.
- Một navigation tree có thể **giữ nguyên route semantics** trong khi UI navigation thay đổi theo không gian màn hình — tốt hơn tạo hai bộ route độc lập cho phone và tablet.
- Kiểm thử portrait, landscape, split-screen và cửa sổ tablet để phát hiện navigation UI bị chật hoặc che nội dung.

**Một số lựa chọn kiến trúc thực tế:**
| Yêu cầu UX | Cấu trúc gợi ý |
|---|---|
| 3–5 đích cấp cao + detail che tab bar | Root Stack → Main Tabs; Detail nằm ở Root Stack |
| Nhiều module quản trị + tablet | Adaptive Drawer, permanent trên màn hình rộng |
| Mỗi tab có drill-down riêng | Tabs → Stack riêng cho từng tab |
| Tác vụ tạm thời toàn app | Modal screen ở Root Stack |
| URL phải mở trực tiếp mọi trang | Expo Router hoặc React Navigation với linking config đầy đủ |

---

## 4.10. Expo Router
- Không tổ chức routing trong `App.tsx`. Route được suy ra từ file system trong `app/` hoặc `src/app/`; `_layout.tsx` khai báo Stack, Tabs hoặc Drawer cho từng nhánh.
- Vẫn dùng primitive navigation của RN/React Navigation bên dưới, nhưng cung cấp abstraction file-based ở tầng cao hơn. Chi tiết: https://docs.expo.dev/router/introduction/
- Mỗi route có URL path tự nhiên → deep linking bật cho toàn bộ route tree, không cần tự viết linking config từng screen.
- **Typed Routes** sinh TypeScript types cho `Link` và router APIs; vẫn được Expo đánh dấu **beta**, project cấu hình thủ công cần bật `experiments.typedRoutes`.
- App cần Android, iOS và web với shareable URL → file-based routing giảm đáng kể cấu hình deep link thủ công.

Không có lựa chọn duy nhất tốt cho mọi dự án; tiêu chí là phù hợp route model và nguồn lực hiện có:
| Tình huống | Lựa chọn nên cân nhắc trước |
|---|---|
| Codebase React Navigation hiện có | Tiếp tục React Navigation nếu architecture đang rõ và ổn định |
| Expo app mới, route có URL rõ ràng | Expo Router để tận dụng file routing và deep link |
| Navigation tree tùy biến theo runtime | React Navigation dynamic configuration thường trực tiếp hơn |
| Universal app cần web + native parity | Expo Router có nhiều lợi thế về URL và file-based routing |

### Ví dụ cấu trúc thư mục
```
src/
└── app/
    ├── (tabs)/
    │   ├── _layout.tsx
    │   ├── index.tsx
    │   ├── profile.tsx
    │   └── search.tsx
    ├── product/
    │   └── [id].tsx
    ├── _layout.tsx
    ├── +not-found.tsx
    └── sign-in.tsx
```
- `src/app/_layout.tsx`: Root Layout, khai báo Stack chính và điều khiển route được phép truy cập theo trạng thái đăng nhập bằng `Stack.Protected`.
- `src/app/(tabs)/`: **Route Group** chứa màn hình chính sau đăng nhập; `(tabs)` chỉ để tổ chức cấu trúc, **không xuất hiện trong URL**. `_layout.tsx` bên trong cấu hình Tab Navigator; `index.tsx`, `search.tsx`, `profile.tsx` lần lượt là Home, Search, Profile.
- `src/app/product/[id].tsx`: **Dynamic Route** cho chi tiết sản phẩm; `[id]` nhận giá trị động từ URL, vd `/product/P-101`.
- `src/app/sign-in.tsx`: màn hình đăng nhập, thuộc nhóm route cho người dùng chưa xác thực.
- `src/app/+not-found.tsx`: route đặc biệt khi URL không khớp màn hình nào.
- Mã nguồn ví dụ: https://drive.google.com/drive/folders/19oNhgHVxKqnauD5VrOomy-nfZ_0pxYFs?usp=sharing

---

## Tổng kết
- **Navigation Architecture**: navigation tree, navigator, route, screen; Stack, Tabs, Drawer, Modal; thiết kế theo nghiệp vụ và kỳ vọng UX.
- **React Navigation & Expo Router**: Dynamic API vs Static API; config-based vs file-based routing; chọn công cụ phù hợp dự án.
- **Type-safe Route Params**: định nghĩa ParamList với TypeScript; truyền params an toàn; chỉ truyền dữ liệu cần thiết (vd ID).
- **Authentication & Protected Routes**: conditional navigation; protected routes (Expo Router); xử lý luồng đặc biệt (login, logout).
- **Header Customization**: tùy biến header theo route params; hiển thị hành động theo ngữ cảnh; đồng bộ với theme và state.
- **Deep Linking**: xử lý cold start & warm state; cấu hình linking object; tích hợp push notification và URL.
- **Navigation Lifecycle & Events**: focus/blur, mount/unmount; xử lý unsaved changes (`usePreventRemove`); theo dõi navigation state.
- **Responsive Navigation**: thích ứng theo kích thước màn hình; Bottom Tabs ↔ Drawer/Sidebar; trải nghiệm nhất quán trên phone, tablet, web.

---

## Thảo luận
1. Người dùng đang nhập thông tin thanh toán thì bấm một push notification về đơn hàng cũ. Mở notification ngay có thể mất dữ liệu checkout; chặn notification thì UX khó chịu. Thiết kế luồng xử lý thế nào?
2. Một người nhận link tới đơn hàng/tài liệu riêng tư. Khi mở link họ chưa đăng nhập; sau khi đăng nhập có thể không có quyền truy cập. App nên xử lý theo trình tự nào?
3. Người dùng đang xem Product A, bấm link từ Messenger mở Product B trong cùng app. App nên thêm Product B vào history, thay thế Product A hay quay về một Product B đã tồn tại trong stack?
4. App mua sắm: Search → Product A → Product B → Product C → Cart. Back từ Cart nên về Product C, Search hay Home? Quyết định dựa trên tiêu chí nào?

---

## Bài tập
Xây dựng hệ thống navigation cho một ứng dụng bán hàng, chọn một trong hai hướng: **Cách 1: React Navigation** hoặc **Cách 2: Expo Router**. Hai cách phải đạt cùng hành vi và trải nghiệm, chỉ khác cách tổ chức route.

Ứng dụng gồm: Home, Search, Profile, Edit Profile, Product Details, Create Review. Yêu cầu:
- Home, Search, Profile là các destination chính.
- Profile → Edit Profile là drill-down flow.
- Product Details mở **bên ngoài primary navigation** (không còn Bottom Tabs khi xem chi tiết).
- Create Review là **modal toàn cục**, mở được từ nhiều màn hình.
- Home/Search dùng danh sách từ dữ liệu mẫu.
- Product Details nhận `productId` và `source`, không truyền toàn bộ Product object.
- Từ Product Details có thể mở sản phẩm liên quan; Back phải quay lại đúng sản phẩm trước đó.
- Header của Product Details thay đổi theo sản phẩm hiện tại.
- Edit Profile cảnh báo khi rời màn hình lúc còn thay đổi chưa lưu.
- Cửa sổ rộng: primary navigation chuyển từ Bottom Tabs sang sidebar/rail phù hợp nhưng **không đổi route semantics**.

Dữ liệu mẫu:
```ts
export const products = [
  { id: 'P-101', name: 'React Native Handbook', price: 249000 },
  { id: 'P-102', name: 'TypeScript in Practice', price: 199000 },
  { id: 'P-103', name: 'Mobile UI Design', price: 289000 },
  { id: 'P-104', name: 'JavaScript Patterns', price: 219000 },
  { id: 'P-105', name: 'Clean Architecture', price: 319000 },
  { id: 'P-106', name: 'API Design Guide', price: 179000 },
  { id: 'P-107', name: 'React Performance', price: 269000 },
  { id: 'P-108', name: 'UX for Mobile Apps', price: 229000 },
  { id: 'P-109', name: 'Testing React Native', price: 259000 },
  { id: 'P-110', name: 'Modern Navigation', price: 189000 },
  { id: 'P-111', name: 'State Management', price: 239000 },
  { id: 'P-112', name: 'Cross-platform Apps', price: 299000 },
];
```
- Tham khảo cách làm: https://drive.google.com/file/d/1uwFUFYw9Kpm2lUojZnX2GCLszPq_Iquo/view?usp=sharing
- Nộp bài trên website môn học.
