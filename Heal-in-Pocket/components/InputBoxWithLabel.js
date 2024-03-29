import React, { forwardRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputBoxWithLabel = ({ label, value, onChangeText, placeholder, width,...props }, ref) => {
  return (
    <View style={[styles.inputContainer,{width:width}]}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        ref={ref}
        style={styles.inputField}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor='#7C7C7C'
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {    
    marginBottom: 10, 
  },
  inputLabel: {
  marginBottom: 5,
  fontSize: 16,
  fontWeight: 'bold',
  },
  inputField: {
    height: 70,
    borderWidth: 2,
    borderColor: '#7C7C7C',
    borderRadius: 10,
    paddingHorizontal: 10,    
    fontSize: 20,
    backgroundColor: '#FFFFFF'
  },
});

// export default InputBoxWithLabel;
export default forwardRef(InputBoxWithLabel);
