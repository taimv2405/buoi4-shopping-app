import { Alert, Platform } from 'react-native';

// react-native-web's Alert is a no-op, so fall back to browser dialogs on web.

export function showMessage(title: string, message: string, onOk?: () => void) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${message}`);
    onOk?.();
    return;
  }
  Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);
}

export function confirmDiscard(onDiscard: () => void) {
  const title = 'Discard changes?';
  const message = 'You have unsaved changes. Are you sure you want to leave this screen?';
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n${message}`)) onDiscard();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Stay', style: 'cancel' },
    { text: 'Discard', style: 'destructive', onPress: onDiscard },
  ]);
}
