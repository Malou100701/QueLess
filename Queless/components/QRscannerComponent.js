import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import styles from '../style/qr.styles';

export default function QRScannerComponent({ booking }) {
  // Hvad skal der stå i QR-koden?
  // Her bruger vi booking.id, men vi kunne også lave mere info:
  // fx JSON.stringify({ bookingId: booking.id, brandId: booking.brandId })
  const qrValue = booking.id ? String(booking.id) : 'ingen-id';

  return (
    <View style={styles.qrContainer}>
      <QRCode
        value={qrValue}
        size={220}         // størrelse på QR-koden
      />
    </View>
  );
}
