import React, { useState } from 'react';
import { View, Text, TextInput, Button} from 'react-native';
import styles from './styles.js';

const MyComplaintScreen = () => {
//   const [patientName, setPatientName] = useState('');
  const [complaints, setComplaints] = useState('');

  const handleAddImage = () => {
    console.log('Add image button pressed');
  };
  const handleSubmit = () => {
    console.log('Submit button pressed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>My Complaints Today</Text>
      </View>

      <TextInput
        style= {{height: 100,
            width: '90%',
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            marginBottom: 20}}
        value={complaints}
        onChangeText={(text) => setComplaints(text)}
        placeholder="Enter patient complaints"
        multiline={true}
        numberOfLines={4}
      />
       <View style={styles.buttonContainer}>
        <Button title="Add Image" onPress={handleAddImage} />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </View>
  );
};

export default MyComplaintScreen;
