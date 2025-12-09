import { ScrollView, Text, View } from 'react-native';
import styles from '../style/home.styles';
import ImageSliderContent from './ImageSliderComponent';
import CategoryComponent from './CategoryComponent';
import AppHeader from './AppHeaderComponent';

export default function HomeContent() {

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <AppHeader 
        title="Hjem"
        uppercase={true}
        showLogout={true} 
      />

      <View style={styles.sliderSection}>
        <Text style={styles.smallerTitles}>UDFORSK</Text>

        {/* ImageSliderContent er en separat komponent, som selv henter/indeholder data til billed-slideren. */}
        <ImageSliderContent /> 
      </View>

      <View>
        <Text style={styles.smallerTitles}>KATEGORIER</Text>

        {/* CategoryComponent er en separat komponent, som selv henter/indeholder information om de forskellige kategorier, der skal vises. */}
        <CategoryComponent />
      </View>

    </ScrollView>
  );
}
