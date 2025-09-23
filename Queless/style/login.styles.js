import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    bg: { flex: 1 },                        // bruges på <ImageBackground>
    container: {
        flex: 1,
        alignItems: 'center',        // behold horisontalt centreret
        justifyContent: 'flex-start',// ← læg indholdet øverst
        paddingHorizontal: 24,
        paddingTop: 150,
        marginBottom: 210,
    },
    title: { fontSize: 45, marginBottom: 12, color: 'white', width: '80%' },
    titleBold: { fontWeight: '700' },
    titleItalic: { fontWeight: '600', fontStyle: 'italic' },
    input: {
        backgroundColor: 'rgba(249, 249, 249, 0.7)',
        width: '80%',
        maxWidth: 360,
        borderWidth: 0,
        borderRadius: 33.33,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 20,
    },
    
    button: {
        width: '100%',
        maxWidth: 360,
        paddingVertical: 14,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A84FF',
        marginTop: 12,
    },
});