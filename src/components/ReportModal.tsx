import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export default function ReportModal({ visible, onClose, onSubmit }: Props) {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      Alert.alert('Błąd', 'Wpisz powód zgłoszenia.');
      return;
    }
    onSubmit(reason.trim());
    setReason('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Zgłoś kurs</Text>
          <Text style={styles.subtitle}>Opisz dlaczego zgłaszasz ten kurs</Text>
          <TextInput
            style={styles.input}
            placeholder="Powód zgłoszenia..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
            value={reason}
            onChangeText={setReason}
          />
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Anuluj</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit}>
              <Text style={styles.btnSubmitText}>Zgłoś</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  box: {
    backgroundColor: 'black',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: '#888',
    fontSize: 13,
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 14,
    color: 'white',
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  btnCancel: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCancelText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  btnSubmit: {
    flex: 2,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSubmitText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '800',
  },
});
