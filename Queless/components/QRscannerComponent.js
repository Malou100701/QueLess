import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import styles from '../style/qr.styles';

export default function QRScannerComponent({ booking }) {
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
