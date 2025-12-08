import React from 'react';
import BrandDetailContent from '../components/BrandDetailComponent';

export default function BrandDetail({ route }) {
  const { brandId } = route.params; // vi forventer navigation.navigate('BrandDetail', { brandId })
  return <BrandDetailContent brandId={brandId} />;
}