import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useCourseDetail } from '../hooks/useCourseDetail.ts';
import { Platform } from 'react-native';

// ─── STAR RATING ─────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map(star => (
        <AntDesignIcon
          key={star}
          name={star <= Math.round(rating) ? 'star' : 'staro'}
          size={14}
          color="white"
        />
      ))}
    </View>
  );
}

// ─── REPORT MODAL ────────────────────────────────────────────────────────────
function ReportModal({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) {
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
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Zgłoś kurs</Text>
          <Text style={styles.modalSubtitle}>Opisz dlaczego zgłaszasz ten kurs</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Powód zgłoszenia..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
            value={reason}
            onChangeText={setReason}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalBtnCancel} onPress={onClose}>
              <Text style={styles.modalBtnCancelText}>Anuluj</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtnSubmit} onPress={handleSubmit}>
              <Text style={styles.modalBtnSubmitText}>Zgłoś</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
export default function CourseDetailScreen({ route, navigation }: any) {
  const { idCourse } = route.params;
  const { data: course, isLoading, isError } = useCourseDetail(idCourse);

  const [wishlisted, setWishlisted] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);

  const handleReport = (reason: string) => {
    // TODO: POST /api/courses/{idCourse}/report
    console.log('Zgłoszono:', reason);
    Alert.alert('Dziękujemy', 'Zgłoszenie zostało wysłane.');
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="white" size="large" />
      </View>
    );
  }

  if (isError || !course) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Nie udało się załadować kursu.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Wróć</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* HERO IMAGE */}
        <View style={styles.heroWrapper}>
          {course.imageUrl ? (
            <Image source={{ uri: course.imageUrl }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={styles.heroPlaceholder}>
              <AntDesignIcon name="playcircleo" size={60} color="#444" />
            </View>
          )}

          {/* Back button nad zdjęciem */}
          <TouchableOpacity style={styles.backOverlay} onPress={() => navigation.goBack()}>
            <AntDesignIcon name="arrowleft" size={22} color="white" />
          </TouchableOpacity>

          {/* Report button nad zdjęciem */}
          <TouchableOpacity style={styles.reportOverlay} onPress={() => setReportVisible(true)}>
            <AntDesignIcon name="flag" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>

          {/* Kategoria */}
          <View style={styles.categoryChip}>
            <Text style={styles.categoryChipText}>{course.categoryName}</Text>
          </View>

          {/* Tytuł */}
          <Text style={styles.title}>{course.title}</Text>

          {/* Autor */}
          <View style={styles.authorRow}>
            <AntDesignIcon name="user" size={14} color="#888" />
            <Text style={styles.authorText}>{course.authorName}</Text>
          </View>

          {/* Ocena */}
          <View style={styles.ratingRow}>
            <StarRating rating={course.averageRating} />
            <Text style={styles.ratingValue}>
              {course.averageRating > 0 ? course.averageRating.toFixed(1) : '—'}
            </Text>
            <Text style={styles.ratingCount}>
              ({course.ratingsCount} {course.ratingsCount === 1 ? 'ocena' : 'ocen'})
            </Text>
          </View>

          {/* Statystyki */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <AntDesignIcon name="shoppingcart" size={16} color="#888" />
              <Text style={styles.statText}>{course.salesCount} sprzedanych</Text>
            </View>
            <View style={styles.statItem}>
              <AntDesignIcon name="calendar" size={16} color="#888" />
              <Text style={styles.statText}>
                {new Date(course.createdAt).toLocaleDateString('pl-PL')}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Opis */}
          <Text style={styles.sectionTitle}>O kursie</Text>
          <Text style={styles.description}>{course.description}</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Recenzje — placeholder na przyszłość */}
          <Text style={styles.sectionTitle}>Recenzje</Text>
          <View style={styles.reviewsPlaceholder}>
            <AntDesignIcon name="message1" size={32} color="#333" />
            <Text style={styles.reviewsPlaceholderText}>
              Recenzje będą dostępne wkrótce
            </Text>
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* BOTTOM BAR — cena + przyciski */}
      <View style={styles.bottomBar}>
        <Text style={styles.price}>{course.price.toFixed(2)} zł</Text>
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={() => setWishlisted(prev => !prev)}>
          <AntDesignIcon
            name={wishlisted ? 'heart' : 'hearto'}
            size={22}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyBtn}>
          <Text style={styles.buyBtnText}>Kup teraz</Text>
        </TouchableOpacity>
      </View>

      {/* REPORT MODAL */}
      <ReportModal
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        onSubmit={handleReport}
      />
    </>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centered: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 16,
  },
  backBtn: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backBtnText: {
    color: 'white',
    fontSize: 14,
  },

  // Hero
  heroWrapper: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 260,
  },
  heroPlaceholder: {
    width: '100%',
    height: 260,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backOverlay: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 20 : 52,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  reportOverlay: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 20 : 52,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },

  // Content
  content: {
    padding: 20,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
  },
  categoryChipText: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  authorText: {
    color: '#888',
    fontSize: 14,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  ratingValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  ratingCount: {
    color: '#666',
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: '#888',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#1a1a1a',
    marginVertical: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    color: '#bbb',
    fontSize: 14,
    lineHeight: 22,
  },
  reviewsPlaceholder: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 10,
  },
  reviewsPlaceholderText: {
    color: '#444',
    fontSize: 14,
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'android' ? 14 : 34,
    gap: 12,
  },
  price: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
  },
  wishlistBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyBtn: {
    flex: 2,
    height: 46,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyBtnText: {
    color: 'black',
    fontSize: 15,
    fontWeight: '800',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: 'black',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  modalSubtitle: {
    color: '#888',
    fontSize: 13,
    marginBottom: 16,
  },
  modalInput: {
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
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtnCancel: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnCancelText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalBtnSubmit: {
    flex: 2,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnSubmitText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '800',
  },
});
