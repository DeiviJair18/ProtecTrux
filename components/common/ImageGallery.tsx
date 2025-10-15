import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface ImageGalleryProps {
  images: string[];
  maxPreview?: number;
  showCount?: boolean;
}

export function ImageGallery({ 
  images, 
  maxPreview = 3, 
  showCount = true 
}: ImageGalleryProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const previewImages = images.slice(0, maxPreview);
  const remainingCount = images.length - maxPreview;

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev < images.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev > 0 ? prev - 1 : images.length - 1
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.previewContainer}>
        {previewImages.map((imageUrl, index) => (
          <TouchableOpacity
            key={index}
            style={styles.imageWrapper}
            onPress={() => openModal(index)}
          >
            <Image source={{ uri: imageUrl }} style={styles.previewImage} />
            {index === maxPreview - 1 && remainingCount > 0 && (
              <View style={styles.overlay}>
                <ThemedText style={styles.overlayText}>+{remainingCount}</ThemedText>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {showCount && images.length > 1 && (
        <View style={styles.countContainer}>
          <SecurityIcon name="images" size={14} color={SecurityColors.text.secondary} />
          <ThemedText style={styles.countText}>
            {images.length} imagen{images.length > 1 ? 'es' : ''}
          </ThemedText>
        </View>
      )}

      {/* Modal para ver imagen completa */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <SecurityIcon name="close" size={24} color={SecurityColors.background.light} />
            </TouchableOpacity>
            <ThemedText style={styles.modalTitle}>
              {selectedImageIndex + 1} / {images.length}
            </ThemedText>
          </View>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setSelectedImageIndex(index);
            }}
            style={styles.imageScrollView}
          >
            {images.map((imageUrl, index) => (
              <View key={index} style={styles.fullImageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.fullImage} />
              </View>
            ))}
          </ScrollView>

          {images.length > 1 && (
            <View style={styles.navigationContainer}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={prevImage}
                disabled={selectedImageIndex === 0}
              >
                <SecurityIcon 
                  name="chevron-back" 
                  size={24} 
                  color={selectedImageIndex === 0 ? SecurityColors.text.muted : SecurityColors.background.light} 
                />
              </TouchableOpacity>
              
              <View style={styles.dotsContainer}>
                {images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      index === selectedImageIndex && styles.activeDot
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={styles.navButton}
                onPress={nextImage}
                disabled={selectedImageIndex === images.length - 1}
              >
                <SecurityIcon 
                  name="chevron-forward" 
                  size={24} 
                  color={selectedImageIndex === images.length - 1 ? SecurityColors.text.muted : SecurityColors.background.light} 
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  previewContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  imageWrapper: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    backgroundColor: SecurityColors.background.light,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    color: SecurityColors.background.light,
    fontSize: 16,
    fontWeight: 'bold',
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  countText: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    color: SecurityColors.background.light,
    fontSize: 16,
    fontWeight: '600',
  },
  imageScrollView: {
    flex: 1,
  },
  fullImageContainer: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullImage: {
    width: width,
    height: height * 0.7,
    resizeMode: 'contain',
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeDot: {
    backgroundColor: SecurityColors.background.light,
  },
});







