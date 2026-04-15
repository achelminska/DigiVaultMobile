import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useSellerCourses, useToggleVisibility } from '../hooks/useSeller';
import { SellerDashboardScreenProps } from '../types/navigation';
import { SellerCourse } from '../types/seller';
import { colors } from '../config/theme';

const COLUMNS = 2;
const GAP = 12;
const PADDING = 20;
const CARD_WIDTH = (Dimensions.get('window').width - PADDING * 2 - GAP) / COLUMNS;

function SellerCourseCard({
  item,
  onEdit,
  onToggleVisibility,
}: {
  item: SellerCourse;
  onEdit: () => void;
  onToggleVisibility: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onEdit}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={styles.cardImagePlaceholder}>
          <AntDesignIcon name="playcircleo" size={28} color={colors.iconFaint} />
        </View>
      )}

      <View style={styles.cardBadges}>
        {!item.isActive && (
          <View style={styles.badgeBlocked}>
            <AntDesignIcon name="warning" size={9} color="#FF4444" />
          </View>
        )}
        <TouchableOpacity
          style={[styles.badgeVisibility, item.isVisible ? styles.badgeVisible : styles.badgeHidden]}
          onPress={onToggleVisibility}
          disabled={!item.isActive}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <AntDesignIcon
            name={item.isVisible ? 'eye' : 'eyeo'}
            size={11}
            color={item.isVisible ? colors.black : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardCategory} numberOfLines={1}>{item.categoryName}</Text>

        <View style={styles.cardStatsRow}>
          <AntDesignIcon name="shoppingcart" size={10} color={colors.textFaint} />
          <Text style={styles.cardStat}>{item.salesCount}</Text>
          <AntDesignIcon name="star" size={10} color={colors.textFaint} style={{ marginLeft: 6 }} />
          <Text style={styles.cardStat}>
            {item.averageRating > 0 ? item.averageRating.toFixed(1) : '—'}
          </Text>
        </View>

        <Text style={styles.cardPrice}>{item.price.toFixed(2)} PLN</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function SellerDashboardScreen({ navigation }: SellerDashboardScreenProps) {
  const { data, isLoading, isError, refetch } = useSellerCourses();
  const { mutate: toggleVisibility } = useToggleVisibility();

  const courses = data?.items ?? [];

  const renderItem = ({ item }: { item: SellerCourse }) => (
    <SellerCourseCard
      item={item}
      onEdit={() => navigation.navigate('SellerCourseForm', { idCourse: item.idCourse })}
      onToggleVisibility={() =>
        toggleVisibility({ idCourse: item.idCourse, isVisible: !item.isVisible })
      }
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <AntDesignIcon name="arrowleft" size={20} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Moje kursy</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('SellerCourseForm', {})}
        >
          <AntDesignIcon name="plus" size={20} color={colors.black} />
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.white} size="large" />
        </View>
      )}

      {isError && (
        <View style={styles.centered}>
          <AntDesignIcon name="exclamationcircleo" size={48} color={colors.textFaint} />
          <Text style={styles.emptyTitle}>Coś poszło nie tak</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Spróbuj ponownie</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading && !isError && (
        <FlatList
          data={courses}
          keyExtractor={item => item.idCourse.toString()}
          renderItem={renderItem}
          numColumns={COLUMNS}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[styles.list, courses.length === 0 && styles.listEmpty]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            courses.length > 0 ? (
              <Text style={styles.countLabel}>
                {courses.length} {courses.length === 1 ? 'kurs' : courses.length < 5 ? 'kursy' : 'kursów'}
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <AntDesignIcon name="playcircleo" size={64} color={colors.textFaint} />
              <Text style={styles.emptyTitle}>Brak kursów</Text>
              <Text style={styles.emptyText}>Zacznij od stworzenia pierwszego kursu</Text>
              <TouchableOpacity
                style={styles.createBtn}
                onPress={() => navigation.navigate('SellerCourseForm', {})}
              >
                <Text style={styles.createBtnText}>Stwórz swój pierwszy kurs</Text>
              </TouchableOpacity>
            </View>
          }
          ListFooterComponent={<View style={{ height: 40 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 20 : 60,
    paddingHorizontal: PADDING,
    paddingBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    flex: 1,
    marginLeft: 16,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  retryText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  createBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.white,
    marginTop: 4,
  },
  createBtnText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: PADDING,
    paddingTop: 4,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  countLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 16,
  },
  row: {
    gap: GAP,
    marginBottom: GAP,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.card,
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 110,
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 110,
    backgroundColor: colors.imagePlaceholder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBadges: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  badgeBlocked: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: 'rgba(255,68,68,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeVisibility: {
    width: 22,
    height: 22,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeVisible: {
    backgroundColor: colors.white,
  },
  badgeHidden: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  cardBody: {
    padding: 10,
    gap: 3,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  cardCategory: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  cardStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  cardStat: {
    color: colors.textFaint,
    fontSize: 11,
  },
  cardPrice: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 5,
  },
});
