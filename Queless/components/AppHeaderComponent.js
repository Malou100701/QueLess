// components/AppHeaderComponent.js
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../style/header.styles';
import BackIcon from '../assets/icons/back.png';
import LogoutIcon from '../assets/icons/logout.png';

export default function AppHeader({
  title,
  uppercase,
  showBack,
  showLogout,
}) {
  const navigation = useNavigation();
  const titleText = uppercase ? title?.toUpperCase() : title;
  const isUppercase = !!uppercase;

   const handleLogout = () => {
    navigation.getParent()?.navigate('Login') || navigation.navigate('Login');
  };
  

  return (
    <View style={styles.container}>
      {/* venstre side – bredde 0 hvis der IKKE er back-knap */}
      <View style={[styles.side, !showBack && { width: 0 }]}>
        {showBack && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={BackIcon} style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>

      <View
        style={[
          styles.titleContainer,
          isUppercase && styles.titleContainerLeft,
        ]}
      >
        {!!titleText && (
          <Text
            style={isUppercase ? styles.titleUppercase : styles.title}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {titleText}
          </Text>
        )}
      </View>

      <View style={styles.sideRight}>
        {showLogout && (
          <TouchableOpacity onPress={handleLogout}>
            <Image source={LogoutIcon} style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
