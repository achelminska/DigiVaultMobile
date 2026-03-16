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
import { colors } from '../config/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export default function ReportModal({ visible, onClose, onSubmit }: Props) {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      Alert.alert('Error', 'Please enter a reason.');
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
          <Text style={styles.title}>Report course</Text>
          <Text style={styles.subtitle}>Describe why you are reporting this course</Text>
          <TextInput
            style={styles.input}
            placeholder="Reason for reporting..."
            placeholderTextColor={colors.textFaint}
            multiline
            numberOfLines={4}
            value={reason}
            onChangeText={setReason}
          />
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit}>
              <Text style={styles.btnSubmitText}>Report</Text>
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
    backgroundColor: colors.overlayDark,
    justifyContent: 'flex-end',
  },
  box: {
    backgroundColor: colors.black,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.black,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    color: colors.textPrimary,
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
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCancelText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  btnSubmit: {
    flex: 2,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSubmitText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '800',
  },
});
