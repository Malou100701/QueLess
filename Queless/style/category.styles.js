// style/category.styles.js
import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

export default StyleSheet.create({
    container: {
        marginTop: spacing.sm,
    },

    // wrapper til alle kategori-kort
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: spacing.sm,
        justifyContent: 'space-between',
    },

    // enkelt kort (2 pr. række)
    card: {
        width: '48%',          // to kort pr. række
        marginBottom: 12,
        borderRadius: 16,
        overflow: 'hidden',
        aspectRatio: 3 / 4,
        backgroundColor: colors.surface,
    },

    image: {
        width: '100%',
        height: '100%',
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.25)',
    },

    titleContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 8,
        alignItems: 'center',
    },

    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
});
