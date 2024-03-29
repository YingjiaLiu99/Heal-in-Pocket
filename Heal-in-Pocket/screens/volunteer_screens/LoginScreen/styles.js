import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',      
      justifyContent: 'flex-start',
      flexDirection: 'column',
      paddingHorizontal: 20,
      paddingVertical:0,      
      marginTop: 0,
      marginHorizontal:0
    },
    
    titleText: {
      alignItems: 'center',      
      fontSize: 35,
      fontWeight: 400  
    },
    error: {
      color: 'red',
      marginBottom: 20
    },   

    forgotPassword: {
      fontSize: 15,
      color: '#333232',      
      textDecorationLine: 'underline'
    },
    resend: {
      fontSize: 15,
      color: '#333232',      
      textDecorationLine: 'underline',
      textAlign: 'right'
    },

    button: {
      height: 70,
      width: '100%',
      marginVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#395BCD',
      paddingVertical: 5,
      paddingHorizontal: 5,
      borderRadius: 20
    },
    buttonText: {
      color: '#fff',
      fontSize: 22
    },

    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },

  });

  export default styles;