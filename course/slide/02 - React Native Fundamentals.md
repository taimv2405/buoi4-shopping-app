# Chương 2. React Native Fundamentals

> Nguồn: `02 - React Native Fundamentals.pdf` (176 slide). Slide chỉ có ảnh chụp kết quả/infographic được lược bỏ. Code được định dạng lại; lỗi đánh máy trong slide được sửa và ghi chú `// [sửa]`. Hai ví dụ SectionList rất dài chỉ giữ phần cốt lõi — xem PDF trang được ghi.

## Mục tiêu
Xây dựng màn hình RN có cấu trúc component hợp lý; quản lý dữ liệu/tương tác bằng props, state, event handler; render có điều kiện; render danh sách hiệu quả; quản lý tác vụ theo vòng đời component.
Sau bài học: (1) phân rã giao diện thành cây component; (2) phân biệt props/state, cập nhật state đúng; (3) xử lý tương tác mobile; (4) conditional rendering; (5) chọn cách render danh sách phù hợp; (6) quản lý side effect theo lifecycle.

Nội dung: 2.1 Component & JSX · 2.2 Props & State · 2.3 Xử lý sự kiện · 2.4 Render có điều kiện · 2.5 Render danh sách · 2.6 Lifecycle.

---

## 2.1. Component và JSX
- **Component**: đơn vị giao diện tái sử dụng; thường là hàm JS/TS trả về JSX, có dữ liệu, logic, hình thức riêng; nhỏ như button hoặc lớn như cả màn hình.
- Ví dụ phân rã: màn hình Login → Header, Logo, InputField, PasswordInput, LoginButton, ErrorMessage. Màn hình Todo → Header, TodoInput, TodoList, TodoItem, StatsBar.

**Vì sao tách component** (thay vì dồn hết vào `index.tsx`/`App.tsx`):
| Lợi ích | Ví dụ |
|---|---|
| Tái sử dụng | Button, Card, TodoItem dùng nhiều nơi |
| Dễ đọc | Mỗi component xử lý một phần nhỏ |
| Dễ sửa | Sửa TodoItem không ảnh hưởng App.tsx |
| Dễ kiểm thử | Kiểm tra từng component độc lập |
| Dễ mở rộng | Tổ chức thành module/feature |

**Function Component** (cách phổ biến, kết hợp hooks). Tên component **viết hoa chữ cái đầu** (PascalCase: `CourseCard`, `TodoItem`, `ProfileHeader`); viết thường React có thể hiểu là native tag. File đặt tên tương ứng.
```jsx
import { Text, View } from 'react-native';

function WelcomeMessage() {
  return (
    <View>
      <Text>Welcome to React Native!</Text>
    </View>
  );
}

export default WelcomeMessage;
```
```jsx
function ComponentName() {
  // Logic xử lý
  return (
    // Giao diện JSX
  );
}
```

**JSX** (JavaScript XML): cú pháp gần giống HTML trong JS/TS, nhưng RN dùng Core Components (`View`, `Text`, `Image`, `TextInput`, `Pressable`) thay cho `div`, `h1`, `p`, `input`, `button`.
- JSX phải có **1 thẻ cha (root element)**:
```jsx
// Lỗi: 2 root element
return (
  <Text>Hello</Text>
  <Text>React Native</Text>
);

// Đúng
return (
  <View>
    <Text>Hello</Text>
    <Text>React Native</Text>
  </View>
);
```
- Thẻ tự đóng **phải có `/`** (self-closing, theo quy tắc XML):
```jsx
// Sai
<Image source={require('./logo.png')}>
<TextInput placeholder="Nhập tên">
// Đúng
<Image source={require('./logo.png')} />
<TextInput placeholder="Nhập tên" />
```

**Class component** (code cũ, trước hooks) — chỉ cần nhận diện; React khuyến cáo **không dùng cho project mới**:
```jsx
import React from 'react';
import { Text, View } from 'react-native';

class WelcomeClass extends React.Component {
  render() {
    return (
      <View>
        <Text>Đây là class component</Text>
      </View>
    );
  }
}

export default WelcomeClass;
```

**Core Components** (nhóm: Basic Components, User Interface, List Views, Android-specific, iOS-specific… — https://reactnative.dev/docs/components-and-apis):
| Component | Vai trò | Ví dụ |
|---|---|---|
| View | Container, layout, nhóm con | Màn hình, card, row, section |
| Text | Hiển thị văn bản | Tiêu đề, mô tả, nhãn, lỗi |
| Image | Hiển thị ảnh | Avatar, thumbnail, banner |
| TextInput | Nhập dữ liệu | Tên, email, nội dung todo |
| Pressable | Xử lý bấm/chạm | Button tùy biến, TodoItem press |
| ScrollView | Cuộn nội dung ngắn/vừa | Form dài, trang chi tiết |
| FlatList | Danh sách dài | Todo, sản phẩm, bài viết |

Tóm lại: Component = **Giao diện (JSX) + Logic (JS) + Dữ liệu (state, props)**.

---

## 2.2. Props và State

### Props
- Dữ liệu truyền **từ cha sang con**; **one-way data flow** (Parent → Child). Là "tham số" truyền vào thẻ JSX, dùng để tùy biến component (vd `name` cho `Cat`, `source` cho `Image`). Core Components cũng cấu hình bằng props: `style`, `source`, `placeholder`, `onPress`, `onChangeText`…
- Props **bất biến (immutable)** với component nhận. Con không sửa props; muốn đổi dữ liệu → con gọi **callback** từ cha → cha cập nhật state, render lại, truyền props mới. Lý do: single source of truth — cha quản lý dữ liệu, con chỉ hiển thị.
- React docs: *"Don't try to 'change props'. When you need to respond to the user input, you will need to 'set state'."* → props là dữ liệu **nhận để dùng, không nhận để sửa**.

```jsx
// Bước 1: định nghĩa component nhận props
function Greeting(props) {
  return (
    <View>
      <Text>Hello {props.name}</Text>
    </View>
  );
}
// Bước 2: sử dụng (truyền props)
function App() {
  return <Greeting name="IE307" />;
}
```
Nhiều props — **string** truyền trực tiếp `"IT"`; **number/boolean/object** dùng `{}`: `gpa={3.6}`.
```jsx
function StudentCard(props) {
  return (
    <View>
      <Text>Hello {props.name}</Text>
      <Text>Major: {props.major}</Text>
      <Text>GPA: {props.gpa}</Text>
    </View>
  );
}
<StudentCard name="An" major="IT" gpa={3.6} />
```

**Destructuring props** (cách phổ biến, gọn): cặp `{}` bên trong `()`.
```jsx
function StudentCard({ name, major, gpa }) {
  return (
    <View>
      <Text>Hello {name}</Text>      {/* [sửa] slide ghi nhầm props.name */}
      <Text>Major: {major}</Text>
      <Text>GPA: {gpa}</Text>
    </View>
  );
}
```
**Giá trị mặc định**: `function Avatar({ person, size = 100 }) { ... }` — dùng khi prop bị thiếu hoặc `size={undefined}`; **không** áp dụng khi `size={null}` hoặc `size={0}`.

**Callback prop** (props là hàm):
```jsx
function MyButton({ onPress }) {
  return <Button title="Click me" onPress={onPress} />;
}

const App = () => {
  const handlePress = () => {
    Alert.alert('Button Pressed!', 'You have pressed the button!');
  };
  return (
    <View style={styles.container}>
      <MyButton onPress={handlePress} />
    </View>
  );
};
```
App (cha) truyền `handlePress` qua prop `onPress`; MyButton (con) chỉ gọi nó — không biết state đổi ra sao, cha quyết định logic.

**Props với TypeScript** — định nghĩa type giúp IDE gợi ý và phát hiện lỗi sớm:
```tsx
import { StyleSheet, Text, View } from "react-native";

type StudentStatus = "Đang học" | "Bảo lưu" | "Đã tốt nghiệp" | "Đã nghỉ";

type StudentCardProps = {
  name: string;
  major: string;
  year: number;
  status: StudentStatus;
  hasScholarship?: boolean;
};

function StudentCard({ name, major, year, status, hasScholarship = false }: StudentCardProps) {
  return (
    <View style={styles.card}>
      <Text>{name}</Text>
      <Text>Ngành: {major}</Text>
      <Text>Năm: {year}</Text>
      <Text>Trạng thái: {status}</Text>
      <Text>Học bổng: {hasScholarship ? "Có" : "Không"}</Text>
    </View>
  );
}

const App = () => {
  return (
    <View style={styles.container}>
      <StudentCard name="Nguyễn Văn A" major="Công nghệ thông tin" year={2023} status="Đang học" hasScholarship={true} />
      <StudentCard name="Trần Thị B" major="Khoa học dữ liệu" year={2022} status="Đang học" hasScholarship={false} />
    </View>
  );
};
export default App;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  card: { width: "100%", marginBottom: 16 },
});
```

**Children prop** — prop đặc biệt khi component bao bọc nội dung; dùng tạo Card, Container, Section, Modal, Layout:
```tsx
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type CardProps = {
  title: string;
  children: ReactNode;
};

function Card({ title, children }: CardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <Card title="Course Information">
        <Text>React Native from Basic to Advanced</Text>
        <Text>Credits: 4</Text>
        <Text>Duration: 11 sessions</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  card: { padding: 20, borderRadius: 12, backgroundColor: '#f1f5f9' },
  cardTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
});
```

### State
- **Dữ liệu nội bộ** của component, thay đổi theo thời gian hoặc tương tác ("bộ nhớ cá nhân"). Props cấu hình component khi render; state cho dữ liệu thay đổi. Vd: `cartCount`, `isLoggedIn`, `username`, `products` từ API.
- **Declarative UI: `UI = f(state)`** — state đổi → component function chạy lại → React so sánh UI mới/cũ → chỉ cập nhật phần thay đổi.
- **`useState`**: `const [count, setCount] = useState(0);` — `count` giá trị hiện tại, `setCount` hàm cập nhật, `0` initial state. Gọi `setCount` → React **lên lịch** cập nhật và render lại.
- State có thể là mọi kiểu:
```js
const [isOn, setIsOn] = useState(false);
const [name, setName] = useState("");
const [items, setItems] = useState([]);
const [user, setUser] = useState({ name: "An", age: 20 });
```
- **Không cập nhật state trực tiếp** (React không nhận biết, không render lại):
```js
// Sai
user.name = "IE307";
items.push("React Native");
// Đúng
setUser({ ...user, name: "IE307" });
setItems([...items, "React Native"]);
```

**Gọi setState liên tục & Functional Update:**
```js
setCount(count + 1);
setCount(count + 1); // chỉ tăng 1!
```
Trong một lần render `count` là giá trị cố định (snapshot); cả hai lời gọi dùng cùng `count` cũ. React còn **batching** (gom nhiều cập nhật để giảm số lần render).
```js
setCount(prev => prev + 1);
setCount(prev => prev + 1); // tăng 2: prev=0→1, prev=1→2
```
→ Không đọc lại state ngay sau `setState` và kỳ vọng đã đổi. **State mới phụ thuộc state cũ → dùng functional update.**

**Ví dụ controlled TextInput:**
```jsx
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {
  const [name, setName] = useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nhập tên của bạn:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ví dụ: Nguyễn Văn A"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.result}>Xin chào: {name || '...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#ffffff' },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 16 },
  result: { fontSize: 18, fontWeight: '600' },
});
```

**Object/array state — không mutate** (props & state là snapshot bất biến; tạo giá trị mới rồi gọi setter):
```tsx
type Profile = { fullName: string; email: string };
const [profile, setProfile] = useState<Profile>({ fullName: '', email: '' });

// Sai: mutate trực tiếp
profile.fullName = 'Nguyễn Văn A';
// Đúng: tạo object mới
setProfile({ ...profile, fullName: 'Nguyễn Văn A' });
```
```tsx
type Todo = { id: string; title: string; completed: boolean };
const [todos, setTodos] = useState<Todo[]>([]);

const addTodo = (title: string) => {
  const newTodo: Todo = { id: Date.now().toString(), title, completed: false };
  setTodos((prevTodos) => [...prevTodos, newTodo]);          // Thêm: spread
};

const toggleTodo = (id: string) => {
  setTodos((prevTodos) =>
    prevTodos.map((todo) =>                                   // Cập nhật: map
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  );
};

const deleteTodo = (id: string) => {
  setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id)); // Xóa: filter
};
```
→ **Thêm bằng `[...]`, cập nhật bằng `map`, xóa bằng `filter`. Không dùng `push`, `splice` trực tiếp.**

Props & State trong React Native hoạt động tương tự ReactJS.

---

## 2.3. Xử lý sự kiện
Event handling = cách app phản hồi hành động người dùng: bấm, bấm giữ, nhập input, submit bàn phím, cuộn, kéo refresh, chạm item, đổi checkbox/switch/picker…

Event truyền vào component dưới dạng **props**:
```jsx
<Pressable onPress={() => console.log("Đã bấm")}>
  <Text>Bấm tôi</Text>
</Pressable>
```
`Pressable` nhận chạm; `onPress` là event; arrow function là callback.

| Event | Component | Ý nghĩa |
|---|---|---|
| `onPress` | Pressable, Button, TouchableOpacity | Bấm/chạm |
| `onLongPress` | Pressable, TouchableOpacity | Bấm giữ |
| `onChangeText` | TextInput | Nội dung text thay đổi |
| `onSubmitEditing` | TextInput | Submit từ bàn phím |
| `onFocus` / `onBlur` | TextInput | Focus / mất focus |
| `onScroll` | ScrollView, FlatList, SectionList | Cuộn |
| `onRefresh` | FlatList, SectionList, RefreshControl | Kéo để refresh |
| `onEndReached` | FlatList, SectionList | Cuộn gần cuối |

**Lỗi thường gặp:**
```jsx
// Sai: handlePress() chạy ngay khi render
<Pressable onPress={handlePress()}><Text>Bấm tôi</Text></Pressable>
// Đúng
<Pressable onPress={handlePress}><Text>Bấm tôi</Text></Pressable>
// Hoặc
<Pressable onPress={() => handlePress()}><Text>Bấm tôi</Text></Pressable>
// Truyền tham số: dùng arrow function
<Pressable onPress={() => handleDelete("course-01")}><Text>Xóa</Text></Pressable>
```

**Truyền tham số khi render danh sách** — arrow function trì hoãn việc gọi hàm đến khi bấm thật:
```tsx
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

type Course = { id: string; title: string };

const courses: Course[] = [
  { id: "1", title: "Buổi 1 - Setup" },
  { id: "2", title: "Buổi 2 - Components" },
  { id: "3", title: "Buổi 3 - Styling" },
];

export default function App() {
  const handleCoursePress = (course: Course) => {
    Alert.alert("Bạn đã chọn", course.title);
  };
  return (
    <View style={styles.container}>
      {courses.map((course) => (
        <Pressable key={course.id} style={styles.item} onPress={() => handleCoursePress(course)}>
          <Text>{course.title}</Text>
        </Pressable>
      ))}
    </View>
  );
}
```

**Pressable** — hiện đại hơn Button, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback; biết trạng thái tương tác (đang bấm, bấm thường, bấm giữ, vùng bấm mở rộng…). `style` và `children` có thể là **hàm nhận `{pressed}`**:
```jsx
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  const [timesPressed, setTimesPressed] = useState(0);

  let textLog = '';
  if (timesPressed > 1) {
    textLog = timesPressed + 'x onPress';
  } else if (timesPressed > 0) {
    textLog = 'onPress';
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Pressable
          onPress={() => { setTimesPressed(current => current + 1); }}
          style={({ pressed }) => [
            { backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white' },
            styles.wrapperCustom,
          ]}>
          {({ pressed }) => (
            <Text style={styles.text}>{pressed ? 'Pressed!' : 'Press Me'}</Text>
          )}
        </Pressable>
        <View style={styles.logBox}>
          <Text testID="pressable_press_console">{textLog}</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  text: { fontSize: 16 },
  wrapperCustom: { borderRadius: 8, padding: 6 },
  logBox: {
    padding: 20, margin: 10,
    borderWidth: StyleSheet.hairlineWidth, borderColor: '#f0f0f0', backgroundColor: '#f9f9f9',
  },
});

export default App;
```

**onLongPress**: `onLongPress={() => Alert.alert("Pressed!", "Đã bấm giữ")}`. Ứng dụng: bấm thường mở chi tiết; bấm giữ hiện menu xóa/sửa, copy tin nhắn, chọn nhiều phần tử.

**hitSlop** — mở rộng vùng nhận bấm mà không đổi kích thước hiển thị (icon nhỏ khó bấm):
```jsx
<Pressable
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  onPress={() => Alert.alert("Pressed!", "Đã bấm")}
  style={({ pressed }) => [
    { backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white' },
    styles.wrapperCustom,
  ]}>
  <Text>x</Text>
</Pressable>
```

**Controlled TextInput**: giá trị hiển thị do state điều khiển; `onChangeText` cập nhật state; state đổi → render lại (xem ví dụ nhập tên ở 2.2).

**onSubmitEditing** — chạy khi bấm nút submit trên bàn phím:
```jsx
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native'; // [sửa] thêm Text

export default function App() {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    if (!keyword.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập từ khóa');
      return;
    }
    Alert.alert('Tìm kiếm', `Từ khóa: ${keyword}`);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={keyword}
        onChangeText={setKeyword}
        placeholder="Nhập từ khóa tìm kiếm"
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: '#ffffff' },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, fontSize: 16 },
});
```
`returnKeyType="search"` → bàn phím hiện nút submit theo ngữ cảnh tìm kiếm.

---

## 2.4. Render có điều kiện
Hiển thị UI khác nhau theo điều kiện: đang tải, lỗi, danh sách rỗng, đã/chưa đăng nhập, hoàn thành/chưa, form hợp lệ/không, có/không quyền…

**1. Bằng `if`** — nhiều nhánh hoặc return sớm:
```jsx
import { Text, View } from 'react-native';

const Card = ({ loading, error, title }) => {
  let content;
  if (error) {
    content = <Text style={{ fontSize: 24, color: 'red', marginTop: 100 }}>Error</Text>;
  } else if (loading) {
    content = <Text style={{ fontSize: 24, color: 'gray' }}>Loading...</Text>;
  } else {
    content = (
      <View>
        <Text style={{ fontSize: 60 }}>{title}</Text>
      </View>
    );
  }
  return <View style={{ padding: 24 }}>{content}</View>;
};

export default function App() {
  return (
    <View>
      <Card error={true} />
      <Card loading={true} />
      <Card loading={false} title="Title" />
    </View>
  );
}
```

**2. Bằng ternary** `condition ? UI đúng : UI sai` — hai trạng thái rõ ràng:
```jsx
function Card({ isLoggedIn }) {
  return (
    <View>
      {isLoggedIn
        ? <Text style={{ fontSize: 24, color: 'blue' }}>Xin chào người dùng</Text>
        : <Text style={{ fontSize: 24, color: 'red' }}>Vui lòng đăng nhập</Text>}
    </View>
  );
}

export default function App() {
  return (
    <View style={{ marginTop: 100, justifyContent: 'center', alignItems: 'center' }}>
      <Card isLoggedIn={true} />
      <Card isLoggedIn={false} />
    </View>
  );
}
```

**3. Bằng `&&`** — chỉ hiện một phần UI khi điều kiện đúng:
```jsx
import { Button, Text, View } from 'react-native';

const Card = ({ title, buttonTitle }) => (
  <View>
    <Text style={{ fontSize: 40 }}>{title}</Text>
    {buttonTitle && <Button title={buttonTitle} />}
  </View>
);

export default function App() {
  return (
    <View style={{ marginTop: 100 }}>
      <Card title="Title" />
      <Card title="Title with button" buttonTitle="Press me!" />
    </View>
  );
}
```

**Lưu ý:**
```tsx
// Component có thể return null để không hiển thị gì
function ErrorMessage({ message }: { message?: string }) {
  if (!message) { return null; }
  return <Text>{message}</Text>;
}

// Không nên: khi todos.length = 0, React có thể render ra số 0
{todos.length && <Text>Có công việc</Text>}
// Nên viết rõ điều kiện
{todos.length > 0 && <Text>Có công việc</Text>}
{todos.length === 0 && <Text>Chưa có công việc nào</Text>}
```
Tránh lồng nhiều ternary trong JSX — tách thành component trạng thái:
```tsx
function EmptyState() { return <Text>Chưa có dữ liệu</Text>; }
function LoadingState() { return <Text>Đang tải...</Text>; }
function ErrorState({ message }: { message: string }) { return <Text>{message}</Text>; }

if (isLoading) return <LoadingState />;
if (error) return <ErrorState message={error} />;
if (todos.length === 0) return <EmptyState />;
```

---

## 2.5. Render danh sách

### map + key
Danh sách ngắn dùng `map`; mỗi phần tử cần **`key` ổn định** để React nhận diện item thêm/xóa/đổi/di chuyển.
```jsx
const courses = [
  { id: '1', title: 'Buổi 1 - Setup' },
  { id: '2', title: 'Buổi 2 - Components' },
  { id: '3', title: 'Buổi 3 - Styling' },
];
return (
  <View>
    {courses.map((course) => (
      <Text key={course.id}>{course.title}</Text>
    ))}
  </View>
);
```
- Dùng `id` làm key. **Không dùng `index`** nếu danh sách có thể thêm/xóa/sắp xếp (gây lỗi UI, giữ sai state của item). Chỉ dùng index khi danh sách hoàn toàn tĩnh, không có state riêng trong item.

### ScrollView
```jsx
import { ScrollView, StyleSheet, Text } from 'react-native';

const courses = Array.from({ length: 20 }, (_, index) => ({
  id: String(index + 1),
  title: `Buổi ${index + 1} - Bài học`,
}));

export default function App() {
  return (
    <ScrollView style={styles.container}>
      {courses.map((course) => (
        <Text key={course.id} style={styles.item}>{course.title}</Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 40 },
  item: { fontSize: 18, padding: 16, margin: 8, backgroundColor: '#e3f2fd', borderRadius: 8 },
});
```
Danh sách hàng trăm/nghìn item với map trong View/ScrollView → tốn bộ nhớ, cuộn giật, mở màn hình chậm, phản hồi kém (ScrollView **render toàn bộ** nội dung). **Giải pháp: FlatList.**

### FlatList
Chỉ render item đang hiển thị + lân cận (**virtualization**).
```tsx
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

type Photo = { id: string; title: string; image: string };

const photos: Photo[] = Array.from({ length: 100 }, (_, index) => ({
  id: String(index + 1),
  title: `Ảnh ${index + 1}`,
  image: `https://picsum.photos/400/250?random=${index + 1}`,
}));

export default function App() {
  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50, marginTop: 10, backgroundColor: "#fff" },
  card: { marginBottom: 20, backgroundColor: "#f5f5f5", borderRadius: 10, overflow: "hidden" },
  image: { width: "100%", height: 220 },
  title: { padding: 12, fontSize: 18, fontWeight: "600" },
});
```
- `data` (bắt buộc): dữ liệu đầu vào. `keyExtractor`: cách lấy key. `renderItem` (bắt buộc): hiển thị từng item — nhận `{ item, index, separators }`.
- Item phức tạp → tách component riêng:
```tsx
<FlatList
  data={photos}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <PhotoItem photo={item} />}
/>

type Props = { photo: Photo };
export default function PhotoItem({ photo }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: photo.image }} style={styles.image} />
      <Text style={styles.title}>{photo.title}</Text>
    </View>
  );
}
```
**Props thường dùng:**
```jsx
ListEmptyComponent={<Text>Chưa có hình ảnh nào!</Text>}                      // khi rỗng
ListHeaderComponent={<Text style={styles.title}>Danh sách hình ảnh</Text>}   // đầu danh sách: tiêu đề, bộ lọc, tìm kiếm, banner
ListFooterComponent={<Text>Đã hiển thị hết danh sách!</Text>}                // cuối: loading thêm, "không còn dữ liệu"
ItemSeparatorComponent={() => <View style={styles.separator} />}             // phân cách giữa item (bỏ marginBottom item)
contentContainerStyle={styles.listContent}                                   // style phần nội dung bên trong
// separator: { height: 5, marginVertical: 10, backgroundColor: "red" }
// listContent: { padding: 24, paddingBottom: 40 }
```
`style` áp dụng cho chính FlatList; `contentContainerStyle` cho phần nội dung bên trong.

**Pull to refresh** — `refreshing` (hiện vòng xoay) + `onRefresh` (hàm gọi khi kéo xuống):
```jsx
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const initialData = Array.from({ length: 20 }, (_, index) => ({
  id: String(index + 1),
  title: `Bài viết ${index + 1}`,
}));

export default function App() {
  const [data, setData] = useState(initialData);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // Giả lập gọi API
    setTimeout(() => {
      const newData = Array.from({ length: 20 }, (_, index) => ({
        id: String(index + 1),
        title: `Bài viết ${index + 1} (${new Date().toLocaleTimeString()})`,
      }));
      setData(newData);
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 16, backgroundColor: "#fff" },
  item: { backgroundColor: "#f1f5f9", padding: 16, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: "600" },
});
```
Thực tế thay `setTimeout` bằng gọi API:
```js
const handleRefresh = async () => {
  setRefreshing(true);
  const response = await fetch("https://example.com/api/posts");
  const result = await response.json();
  setData(result);
  setRefreshing(false);
};
```

**Infinite scroll** — tự tải thêm khi cuộn gần cuối:
- `onEndReached`: callback khi cuộn gần cuối → gọi API trang tiếp, nối vào state.
- `onEndReachedThreshold`: khoảng cách (tỉ lệ chiều cao danh sách) để kích hoạt; `0.5` = còn nửa màn hình thì bắt đầu tải.
- Quy trình: tải trang 1 → hiển thị → cuộn gần cuối → `onEndReached` → tải trang tiếp → nối dữ liệu → lặp đến khi hết.

Ví dụ thư viện ảnh (PDF trang 98–104, sắp xếp lại):
```tsx
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ListRenderItem, Pressable, StyleSheet, Text, View } from 'react-native';

type Photo = { id: string; author: string; width: number; height: number; url: string; download_url: string };
type LoadMode = 'initial' | 'more' | 'refresh';

const PAGE_SIZE = 10;
const API_URL = 'https://picsum.photos/v2/list';

type PhotoItemProps = { photo: Photo };

// Tách item thành component riêng và dùng memo để hạn chế render lại ảnh không đổi.
const PhotoItem = memo(({ photo }: PhotoItemProps) => {
  // Dùng ảnh kích thước vừa phải thay vì ảnh gốc quá lớn.
  const imageUrl = `https://picsum.photos/id/${photo.id}/700/450`;
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" accessibilityLabel={`Ảnh của ${photo.author}`} />
      <View style={styles.cardContent}>
        <Text style={styles.author} numberOfLines={1}>{photo.author}</Text>
        <Text style={styles.photoSize}>{photo.width} × {photo.height}</Text>
      </View>
    </View>
  );
});

export default function ImageInfiniteScrollScreen() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Trang tiếp theo cần tải. Dùng useRef vì đổi giá trị này không cần render lại.
  const nextPageRef = useRef(1);
  // Ngăn gửi nhiều request cùng lúc (cuộn nhanh có thể kích hoạt onEndReached khi request trước chưa xong).
  const isFetchingRef = useRef(false);
  // Lưu trạng thái còn trang tiếp theo hay không.
  const hasMoreRef = useRef(true);

  const loadPhotos = useCallback(async (pageNumber: number, mode: LoadMode) => {
    if (isFetchingRef.current) return;                     // đang có request khác
    if (mode === 'more' && !hasMoreRef.current) return;    // server hết dữ liệu

    isFetchingRef.current = true;
    setError(null);
    if (mode === 'initial') setInitialLoading(true);
    if (mode === 'more') setLoadingMore(true);
    if (mode === 'refresh') setRefreshing(true);

    try {
      const response = await fetch(`${API_URL}?page=${pageNumber}&limit=${PAGE_SIZE}`);
      if (!response.ok) throw new Error(`Không thể tải dữ liệu: HTTP ${response.status}`);
      const newPhotos: Photo[] = await response.json();

      if (mode === 'initial' || mode === 'refresh') {
        setPhotos(newPhotos);                              // thay thế dữ liệu cũ
      } else {
        setPhotos(currentPhotos => {                       // nối vào cuối, tránh trùng
          const existingIds = new Set(currentPhotos.map(photo => photo.id));
          const uniquePhotos = newPhotos.filter(photo => !existingIds.has(photo.id));
          return [...currentPhotos, ...uniquePhotos];
        });
      }

      // Trả về ít hơn PAGE_SIZE → xem như hết trang.
      const canLoadMore = newPhotos.length === PAGE_SIZE;
      hasMoreRef.current = canLoadMore;
      setHasMore(canLoadMore);
      // Chỉ chuyển trang sau khi request thành công.
      nextPageRef.current = pageNumber + 1;
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Đã xảy ra lỗi không xác định';
      setError(message);
    } finally {
      isFetchingRef.current = false;
      setInitialLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

  // Tải trang đầu khi mount.
  useEffect(() => { void loadPhotos(1, 'initial'); }, [loadPhotos]);

  const handleLoadMore = useCallback(() => { void loadPhotos(nextPageRef.current, 'more'); }, [loadPhotos]);
  const handleRefresh = useCallback(() => { void loadPhotos(1, 'refresh'); }, [loadPhotos]);
  const handleRetry = useCallback(() => {
    if (photos.length === 0) { void loadPhotos(1, 'initial'); return; }
    void loadPhotos(nextPageRef.current, 'more');
  }, [loadPhotos, photos.length]);

  const renderItem: ListRenderItem<Photo> = useCallback(({ item }) => <PhotoItem photo={item} />, []);
  const keyExtractor = useCallback((item: Photo) => item.id, []);

  // Footer phía dưới danh sách.
  const renderFooter = useCallback(() => {
    if (loadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" />
          <Text style={styles.footerText}>Đang tải thêm ảnh...</Text>
        </View>
      );
    }
    if (error && photos.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </Pressable>
        </View>
      );
    }
    if (!hasMore && photos.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>Đã xem hết danh sách!</Text>
        </View>
      );
    }
    return <View style={styles.footerSpace} />;
  }, [error, handleRetry, hasMore, loadingMore, photos.length]);

  if (initialLoading && photos.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>Đang tải danh sách ảnh...</Text>
      </View>
    );
  }
  if (error && photos.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Không thể tải ảnh</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Tải lại</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Thư viện ảnh</Text>
      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={renderFooter}
        initialNumToRender={4}
        maxToRenderPerBatch={5}
        windowSize={7}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f3f4f6', marginTop: 50 },
  title: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, fontSize: 24, fontWeight: '700', color: '#111827', backgroundColor: '#ffffff' },
  listContent: { padding: 12 },
  card: { flex: 1, margin: 5, backgroundColor: '#ffffff', borderRadius: 10, overflow: 'hidden' },
  image: { width: '100%', aspectRatio: 1 },
  cardContent: { paddingHorizontal: 12, paddingVertical: 10 },
  author: { fontSize: 16, fontWeight: '600', color: '#111827' },
  photoSize: { marginTop: 4, fontSize: 13, color: '#6b7280' },
  center: { flex: 1, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' },
  statusText: { marginTop: 12, fontSize: 15, color: '#4b5563' },
  errorTitle: { marginBottom: 8, fontSize: 20, fontWeight: '700', color: '#dc2626' },
  errorText: { textAlign: 'center', fontSize: 14, color: '#dc2626' },
  retryButton: { marginTop: 12, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, backgroundColor: '#2563eb' },
  retryButtonText: { fontSize: 14, fontWeight: '600', color: '#ffffff' },
  footer: { minHeight: 80, alignItems: 'center', justifyContent: 'center' },
  footerText: { marginTop: 8, fontSize: 14, color: '#6b7280' },
  footerSpace: { height: 30 },
});
```
**Tham số hiệu năng FlatList:**
- `initialNumToRender`: số item render lần đầu (cao → mở chậm; thấp → thấy khoảng trống khi cuộn nhanh).
- `maxToRenderPerBatch`: số item tối đa mỗi batch (lớn → ít trống khi cuộn nhanh nhưng JS thread bận hơn).
- `windowSize`: vùng item giữ quanh viewport (lớn → mượt hơn, tốn bộ nhớ; nhỏ → tiết kiệm, item xuất hiện chậm).
- Tối ưu bằng `React.memo`, `useCallback`… tùy bài toán.

### SectionList
Danh sách **chia nhóm**; mỗi nhóm có tiêu đề (ngày, tháng, loại sản phẩm, chữ cái đầu, trạng thái đơn), mảng dữ liệu, header/footer riêng. Vd: danh bạ (A: An, Anh; B: Bình, Bảo), thư viện ảnh (Hôm nay, Hôm qua), đơn hàng (Đang xử lý, Đang giao, Đã hoàn thành).

Dữ liệu API phẳng cần chuyển thành `sections`:
```js
const photos = [
  { id: '1', date: '2026-07-14', url: '...' },
  { id: '2', date: '2026-07-14', url: '...' },
  { id: '3', date: '2026-07-13', url: '...' },
];

const sections = [
  { key: '2026-07-14', title: 'Hôm nay', data: [{ id: '1', url: '...' }, { id: '2', url: '...' }] },
  { key: '2026-07-13', title: 'Hôm qua', data: [{ id: '3', url: '...' }] },
];
```
**FlatList nhận `data`; SectionList nhận mảng `sections`.** Mỗi section **bắt buộc có `data`**; có thể định nghĩa riêng `key`, `renderItem`, `keyExtractor`, separator.
```jsx
<SectionList
  sections={sections}
  renderItem={({ item }) => <Text>{item.name}</Text>}
  renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
  keyExtractor={item => item.id}
/>
```
`renderItem` nhận `item`, `index` (**vị trí trong section**, không phải toàn cục), `section`, `separators`.

| Prop | Chức năng |
|---|---|
| `sections` | Dữ liệu gồm nhiều section |
| `renderItem` | Render item mặc định |
| `renderSectionHeader` / `renderSectionFooter` | Đầu / cuối mỗi section |
| `keyExtractor` | Key duy nhất cho item |
| `stickySectionHeadersEnabled` | Giữ header khi cuộn (**nên đặt rõ** — mặc định Android/iOS khác nhau) |
| `ItemSeparatorComponent` | Ngăn cách giữa các item |
| `SectionSeparatorComponent` | Ngăn cách ở ranh giới section |
| `ListHeaderComponent` / `ListFooterComponent` | Đầu / cuối toàn danh sách |
| `ListEmptyComponent` | Khi không có dữ liệu |
| `refreshing`, `onRefresh` | Pull-to-refresh |
| `onEndReached` | Tải thêm khi gần cuối |
| `extraData` | Buộc cập nhật khi dữ liệu phụ (ngoài sections) thay đổi |
| `onViewableItemsChanged` | Theo dõi item đang hiển thị |

**Ví dụ thư viện ảnh nhóm theo ngày** (PDF trang 110–118) — ý chính:
- Types: `Photo {id, author, width, height}`, `PhotoSection {key, title, dateKey, data: Photo[]}`, `PhotoSectionMeta = Omit<PhotoSection, 'data'>`.
- `INITIAL_SECTIONS` (Hôm nay / Hôm qua / 12 tháng 7, mỗi nhóm 3 ảnh id 0–8), `OLDER_PAGES` (11 tháng 7, 10 tháng 7) để giả lập load more; `wait(ms)` giả lập API; `cloneSections` copy immutable.
- `mergePhotoSections(current, incoming)`: dùng `Map` key→index và `Set` id đã có để gộp section cùng key, bỏ ảnh trùng, section mới thì push.
- `PhotoCard = memo(...)`: thumbnail `https://picsum.photos/id/${id}/360/240` (không tải ảnh gốc 5000×3333), nút ★/☆ yêu thích với `accessibilityRole="button"`, `style={({pressed}) => [...]}`.
- State: `sections`, `favoriteIds: Set<string>`, `refreshing`, `loadingMore`, `hasMore`; refs `nextPageRef`, `isLoadingMoreRef`; `totalPhotos` bằng `useMemo`.
- `toggleFavorite`: **tạo `new Set(currentIds)` mới** để reference thay đổi (không sửa Set cũ).
- `renderSectionHeader` hiện `section.title` + `${section.data.length} ảnh`.
- Vì trạng thái yêu thích nằm ngoài `sections` → truyền `extraData={favoriteIds}`.
```tsx
<SectionList<Photo, PhotoSectionMeta>
  sections={sections}
  renderItem={renderItem}
  renderSectionHeader={renderSectionHeader}
  keyExtractor={keyExtractor}
  extraData={favoriteIds}
  stickySectionHeadersEnabled
  ItemSeparatorComponent={ItemSeparator}
  SectionSeparatorComponent={SectionSeparator}
  ListHeaderComponent={/* "Thư viện ảnh" + `${totalPhotos} ảnh · ${favoriteIds.size} yêu thích` */}
  ListFooterComponent={renderFooter}
  ListEmptyComponent={EmptyList}
  refreshing={refreshing}
  onRefresh={handleRefresh}
  onEndReached={handleLoadMore}
  onEndReachedThreshold={0.4}
  initialNumToRender={8}
  maxToRenderPerBatch={8}
  windowSize={7}
  contentContainerStyle={styles.listContent}
  showsVerticalScrollIndicator={false}
/>
```

**Vấn đề nâng cao trong SectionList:**

1. **Dữ liệu không đồng nhất** — mỗi section có thể ghi đè `renderItem`, `keyExtractor`, `ItemSeparatorComponent`:
```tsx
const sections = [
  { key: 'photos', title: 'Ảnh', data: photoItems, renderItem: ({ item }: any) => <PhotoCard photo={item} /> },
  { key: 'notifications', title: 'Thông báo', data: notificationItems, renderItem: ({ item }: any) => <NotificationCard notification={item} /> },
];

// Hoặc discriminated union (dễ kiểm soát TypeScript hơn)
type FeedItem =
  | { id: string; type: 'photo'; imageUrl: string }
  | { id: string; type: 'notice'; message: string };

const renderItem = ({ item }: { item: FeedItem }) => {
  switch (item.type) {
    case 'photo':
      return <Image source={{ uri: item.imageUrl }} style={{ width: 100, height: 100 }} />;
    case 'notice':
      return <Text>{item.message}</Text>;
  }
};
```

2. **Thu gọn/mở rộng section** — SectionList không tự quản lý collapse; giữ dữ liệu gốc riêng, không xóa item khỏi section gốc:
```tsx
const [collapsedKeys, setCollapsedKeys] = useState<Set<string>>(() => new Set());

const toggleSection = (sectionKey: string) => {
  setCollapsedKeys(current => {
    const next = new Set(current);
    if (next.has(sectionKey)) { next.delete(sectionKey); } else { next.add(sectionKey); }
    return next;
  });
};

const visibleSections = useMemo(() => {
  return originalSections.map(section => ({
    ...section,
    data: collapsedKeys.has(section.key) ? [] : section.data,
  }));
}, [collapsedKeys, originalSections]);

const renderSectionHeader = ({ section }) => (
  <Pressable onPress={() => toggleSection(section.key)}>
    <Text>{section.title} {collapsedKeys.has(section.key) ? '▼' : '▲'}</Text>
  </Pressable>
);
```

3. **State bên trong item có thể mất** — do virtualization, item xa viewport có thể bị unmount, state cục bộ về mặc định. Đưa state cần giữ lên dữ liệu item hoặc store/cha:
```tsx
// Không nên
function PhotoItem() {
  const [selected, setSelected] = useState(false);
}
// Nên
const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
<PhotoItem selected={selectedIds.has(item.id)} onToggle={toggleSelected} />
```

4. **Cuộn đến section** — `scrollToLocation`:
```tsx
const sectionListRef = useRef<SectionList<Photo>>(null);

// Cuộn đến section index 2, item đầu tiên
sectionListRef.current?.scrollToLocation({
  sectionIndex: 2,
  itemIndex: 0,
  animated: true,
  viewPosition: 0,   // 0 trên, 0.5 giữa, 1 dưới
  viewOffset: 50,    // bù cho sticky header
});

<SectionList ref={sectionListRef} sections={sections} renderItem={renderItem} />
```
Mục tiêu nằm ngoài render window → cần `getItemLayout` hoặc xử lý `onScrollToIndexFailed`. Với FlatList item cao cố định:
```js
getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
```
SectionList phức tạp hơn (phải tính ListHeader, SectionHeader, Item, ItemSeparator, SectionFooter, SectionSeparator). Chỉ dùng khi chiều cao cố định, tính chính xác được.

5. **Nhiều cột** — SectionList không có `numColumns` (FlatList có nhưng chỉ grid cùng chiều cao, không masonry). Giải pháp: mỗi item là một **hàng** chứa nhiều phần tử:
```tsx
type PhotoRow = { id: string; photos: Photo[] };

function createPhotoRows(photos: Photo[], numberOfColumns = 2): PhotoRow[] {
  const rows: PhotoRow[] = [];
  for (let index = 0; index < photos.length; index += numberOfColumns) {
    const rowPhotos = photos.slice(index, index + numberOfColumns);
    rows.push({ id: rowPhotos.map(photo => photo.id).join('-'), photos: rowPhotos });
  }
  return rows;
}

const renderRow = ({ item }: { item: PhotoRow }) => (
  <View style={{ flexDirection: 'row' }}>
    {item.photos.map(photo => (
      <View key={photo.id} style={{ flex: 1, margin: 4 }}>
        <Image source={{ uri: `https://picsum.photos/id/${photo.id}/300/300` }} style={{ width: '100%', aspectRatio: 1 }} />
      </View>
    ))}
    {item.photos.length === 1 && <View style={{ flex: 1, margin: 4 }} />}
  </View>
);
```

6. **Theo dõi item đang hiển thị** — `viewabilityConfig` (điều kiện, vd % item lộ ra) + `onViewableItemsChanged` (callback khi tập item hiển thị đổi). Giữ **cấu hình ổn định** (useRef), không tạo object mới mỗi render. Ứng dụng: đánh dấu đã xem, đo impression quảng cáo, theo dõi section hiện tại, tự phát/dừng video.
```tsx
const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60, minimumViewTime: 500 }).current;

const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
  console.log(viewableItems.map((token: any) => ({
    id: token.item.id,
    section: token.section?.key,
    isViewable: token.isViewable,
  })));
}).current;

<SectionList
  sections={sections}
  renderItem={renderItem}
  viewabilityConfig={viewabilityConfig}
  onViewableItemsChanged={onViewableItemsChanged}
/>
```

**Ví dụ tổng hợp nâng cao** (PDF trang 128–138): gộp tất cả vấn đề trên — grid 2 cột (`PhotoRowItem`), dữ liệu không đồng nhất (`NoticeItem` + union `GalleryItem`), collapse section (`collapsedSectionKeys`), chọn ảnh (`selectedPhotoIds`) và yêu thích (`favoriteIds`) dưới dạng `Set` ở cha, `extraData` gồm cả 3 set, nút nhảy tới section (`scrollToSection` tự mở section đang thu gọn rồi cuộn bằng `requestAnimationFrame`), `getItemLayout` tính từ chiều cao cố định (`LIST_HEADER_HEIGHT = 164`, `SECTION_HEADER_HEIGHT = 52`, `PHOTO_ROW_HEIGHT = 214`, `NOTICE_ROW_HEIGHT = 104`, `SECTION_FOOTER_HEIGHT = 8`), `onScrollToIndexFailed` fallback cuộn ước lượng rồi thử lại, `onViewableItemsChanged` cập nhật "Đang thấy: section · ID" (so sánh mảng để tránh setState thừa).

**Nguyên tắc cần nhớ:**
- Dùng SectionList khi dữ liệu thật sự có nhóm.
- Key ổn định cho section và item.
- Cập nhật dữ liệu immutable.
- Dùng `extraData` cho state nằm ngoài `sections`.
- Không lưu state quan trọng chỉ trong item.
- Dùng thumbnail cho danh sách ảnh.
- Ngăn request trùng khi infinite scroll.
- Dùng `memo` và callback ổn định cho item phức tạp.
- Đo hiệu năng trên **release build và thiết bị thật**.

**Lỗi thường gặp:**
```jsx
// Quên key — Sai
{courses.map((course) => <Text>{course.title}</Text>)}
// Đúng
{courses.map((course) => <Text key={course.id}>{course.title}</Text>)}

// Dùng index làm key cho danh sách động — Không nên
{todos.map((todo, index) => <TodoItem key={index} todo={todo} />)}
// Nên
{todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)}

// Bọc FlatList/SectionList trong ScrollView cùng chiều cuộn — Không nên (mất tối ưu, gây cảnh báo)
<ScrollView>
  <FlatList data={courses} renderItem={renderItem} />
</ScrollView>
// Nên để FlatList tự cuộn; cần header/footer thì dùng ListHeaderComponent/ListFooterComponent
<FlatList data={courses} ListHeaderComponent={<Header />} renderItem={renderItem} />
```

---

## 2.6. Lifecycle
Vòng đời component: **Mount** (thêm vào cây giao diện) → **Update** (props/state thay đổi) → **Unmount** (bị loại khỏi cây).

Bốn khái niệm liên quan:
- **Component lifecycle**: mount, update, unmount.
- **Render lifecycle**: trigger render → render component → commit kết quả.
- **Effect lifecycle**: bắt đầu đồng bộ và dừng đồng bộ.
- **React Native lifecycle**: foreground/background của app; focus/unfocus của screen.

Effect **chỉ chạy sau khi commit**, không chạy trong quá trình render.

### Ba giai đoạn
```jsx
// Mount: visible false → true thì Child được mount
function Parent() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button title="Hiện component" onPress={() => setVisible(true)} />
      {visible && <Child />}
    </>
  );
}

// Update: setName('Bình') → Profile nhận props mới, có thể render lại
function Parent() {
  const [name, setName] = useState('An');
  return <Profile name={name} />;
}

// Unmount: setVisible(false) → Child bị unmount
{visible && <Child />}
```
Unmount là lúc **dọn dẹp**: timer, event listener, subscription, socket, request chưa xong, theo dõi vị trí, audio/video, native resource…

### Render & commit
**Trigger** — component render khi: lần đầu; state đổi; props đổi; context đổi; cha render lại mà con không được tối ưu bỏ qua. `setCount(current => current + 1)` không đổi `count` ngay tại dòng đó, chỉ **lên lịch** render mới.

**Render phase** — React gọi function component; toàn bộ thân hàm là logic render, **phải thuần (pure)**:
1. Cùng props/state/context → cùng JSX.
2. Không side effect (không sửa biến có sẵn, không tương tác môi trường ngoài).

Tại sao phải thuần:
- React so sánh cây ảo (Virtual Tree); `UI = f(State, Props)` tính nhanh. Side effect trong render (gọi API, đổi biến toàn cục) sẽ chạy lại không kiểm soát mỗi lần re-render.
- Tránh lặp vô tận (set state trong body render → render mới ngay).
- Để `React.memo`, `useMemo`, `useCallback` bỏ qua render đúng (giả định đầu vào không đổi → UI không đổi).
- Từ React 18 / New Architecture (Fabric), React có thể **tạm dừng**, **hủy**, **render ngầm**; render không thuần → side effect chạy dở dang → bug, memory leak.

```jsx
function MyComponent({ count }) {
  globalCounter = count + 1;              // SAI: sửa biến ngoài phạm vi render
  fetchData();                            // SAI: gọi API trong body
  const [value, setValue] = useState(0);
  setValue(count);                        // SAI: set state trong body → lặp vô tận
  myRef.current.focus();                  // SAI: thao tác trực tiếp Native Ref/Tree
  return <Text>{count}</Text>;
}
```
Side effect đặt ở đâu:
- Thao tác theo thời gian / fetch API / lắng nghe sự kiện → **`useEffect`** hoặc `useLayoutEffect`.
- Hành động người dùng (nhấn, vuốt, gõ) → **event handler** (`onPress`, `onChangeText`…).

**Commit phase** — React commit thay đổi cần thiết vào native UI (count 1→2 chỉ cập nhật phần tương ứng, không dựng lại toàn màn hình), sau đó mới chạy Effect.
`State thay đổi → Render component → Commit native UI → Chạy Effect`

### Hooks & useEffect
Trước React 16.8 phải dùng Class Component cho lifecycle (logic rời rạc, khó tái sử dụng). **Hooks** là hàm đặc biệt để "móc" vào state, lifecycle, context, refs… trong Function Component.

**`useEffect(setup, dependencies?)`** — đồng bộ component với hệ thống bên ngoài (API, timer, subscription, local storage, analytics, native module…).
- `setup`: logic effect, có thể trả về **cleanup**. Sau commit React chạy setup. Sau mỗi commit mà dependencies đổi: chạy cleanup (giá trị cũ) → setup (giá trị mới). Khi unmount: chạy cleanup lần cuối.
```jsx
useEffect(() => {
  // Setup
  console.log('effect run');
  return () => {
    // Cleanup
    console.log('cleanup');
  };
}, [dependencies]);
```
```jsx
import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';

const Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('setup', count);
    return () => { console.log('cleanup', count); };
  }, [count]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>{count}</Text>
      <Button title="+" onPress={() => setCount(current => current + 1)} />
    </View>
  );
};
export default Counter;
```
Lần đầu in `setup 0`; bấm + → `cleanup 0` rồi `setup 1`… Cleanup dùng giá trị cũ → không leak, không double subscribe, không dùng dữ liệu cũ. Unmount → cleanup lần cuối (clear interval, unsubscribe socket, remove listener).

| Giai đoạn | useEffect |
|---|---|
| Mount | setup |
| Update (deps đổi) | cleanup (cũ) → setup (mới) |
| Unmount | cleanup |

| Class | Hooks |
|---|---|
| `componentDidMount` | setup (lần đầu) |
| `componentDidUpdate` | setup (deps đổi) |
| `componentWillUnmount` | cleanup |

Hooks gom logic một chỗ. Mỗi effect có vòng đời riêng.

- `dependencies`: mọi giá trị reactive dùng trong setup (props, state, biến/hàm khai báo trong thân component); số phần tử cố định, viết inline `[dep1, dep2]`; so sánh bằng `Object.is`.

| Cách truyền | Effect chạy khi |
|---|---|
| `useEffect(() => {...})` — không truyền | Sau **mỗi** commit |
| `useEffect(() => {...}, [])` — mảng rỗng | **Một lần** sau mount |
| `useEffect(() => {...}, [a, b, c])` | Sau mount + mỗi khi a/b/c đổi |

### Tác vụ theo giai đoạn
- **Mount** (initial render: mở app, bật Modal, push màn hình, chuyển trang): gọi API ban đầu; đăng ký listener thiết bị (Accelerometer, Gyroscope, `Keyboard.addListener`, NetInfo, GPS); WebSocket, Push Notification; khởi tạo timer/interval.
- **Update** (state/props/context đổi): gọi API lọc/tìm kiếm; lưu tạm xuống AsyncStorage/MMKV/SQLite khi nhập liệu; animation; tính lại giá trị phụ thuộc.
- **Unmount** (đóng modal, chuyển trang, ẩn theo điều kiện): hủy listener (bàn phím, GPS, cảm biến, nút Back); `clearInterval`, `clearTimeout`, đóng WebSocket, hủy push listener; hủy request dở dang bằng **`AbortController`** (tránh memory leak / set state trên component đã hủy).

**Lưu ý Stack Navigation:** Web chuyển route A→B thì A unmount ngay. RN Stack: push B thì **A không unmount** (vẫn nằm trong stack) → cleanup của A **chưa chạy**. Bắt sự kiện vào/ra màn hình dùng:
- `useFocusEffect`: chạy khi màn hình focus, dọn dẹp khi blur.
- `useIsFocused`: kiểm tra màn hình có đang active.

---

## Thảo luận
1. Vì sao không gọi `handlePress()` trực tiếp trong `onPress`?
2. Conditional rendering dùng trong trạng thái nào? Vì sao danh sách cần key?
3. Vì sao không dùng index làm key cho danh sách thay đổi?
4. Cuộn rất nhanh thấy vùng trắng trước khi item xuất hiện — nguyên nhân?
5. State nào lưu trong item, state nào đưa lên cha/global store?
6. Yếu tố quan trọng nhất khi xây danh sách lớn: tốc độ render, bộ nhớ, trải nghiệm cuộn hay tính đơn giản?
7. Làm sao để component con yêu cầu cha cập nhật state?

## Bài tập — Mini Todo List App
- Hiển thị tiêu đề và mô tả buổi học.
- Nhập tên công việc vào TextInput; bấm **Thêm** để thêm.
- Danh sách hiển thị bằng **FlatList**.
- Bấm item để đổi trạng thái hoàn thành/chưa; bấm **Xóa** để xóa.
- Thông báo khi danh sách rỗng.
- Thống kê tổng số và số công việc đã hoàn thành.
- Tách code thành nhiều component rõ ràng.
- Nộp trên website môn học.
