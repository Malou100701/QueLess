import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    bg: { flex: 1 },                        // bruges på <ImageBackground>
    container: {
        flex: 1,
        justifyContent: 'flex-start',// ← læg indholdet øverst
        paddingTop: 150,
    },

    // smal, centeret kolonne
    content: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },

    title: { fontSize: 40, marginBottom: 40, color: 'white', width: '80%' },
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


    buttonWrap: {
        width: '50%',
        maxWidth: 360,
        marginTop: 12,
        alignSelf: 'center',
        backgroundColor: '#054395',
        borderRadius: 33.33,
    },

    SignUpLinkWrap: {
        marginTop: 12,
        alignItems: 'center',
    },
    SignUpLinkText: {
        textDecorationLine: 'underline',
        fontSize: 16,
        color: '#000000',
    },

    footerLink: {
        alignItems: 'center',
        marginTop: 300,   // placere den i bunden
    },
});

