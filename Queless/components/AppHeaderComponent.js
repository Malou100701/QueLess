// components/AppHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../style/header.styles';

import BackIcon from '../assets/icons/back.png';
import LogoutIcon from '../assets/icons/logout.png';

export default function AppHeader({
  title,
  showBack = false,    // kun true på sider som fx Category
  showLogout = true,
  uppercase = false,
}) {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogout = () => {
    navigation.getParent()?.navigate('Login') || navigation.navigate('Login');
  };

  const displayTitle = uppercase ? title.toUpperCase() : title;

  return (
    <View style={styles.container}>
      {/* Venstre side: evt. back + titel */}
      <View style={styles.leftRow}>
        {showBack && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Image source={BackIcon} style={styles.icon} />
          </TouchableOpacity>
        )}

        <Text
          style={[
            styles.title,
            uppercase && styles.titleUppercase,
          ]}
          numberOfLines={1}
        >
          {displayTitle}
        </Text>
      </View>

      {/* Højre side: logout */}
      {showLogout && (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Image source={LogoutIcon} style={styles.icon} />
        </TouchableOpacity>
      )}
    </View>
  );
}
