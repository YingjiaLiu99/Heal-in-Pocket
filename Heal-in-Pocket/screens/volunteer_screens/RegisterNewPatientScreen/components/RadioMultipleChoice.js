import React from 'react';
import { TouchableHighlight, View, StyleSheet, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const RadioMutipleChoice = ({ options, onSelectionChange, upperLabel }) => {
  const [selected, setSelected] = React.useState(null);

  const handleSelect = (value) => {
    setSelected(value);
    onSelectionChange(value);
  };

  const Dot = ({ value, choiceLabel }) => (
    <TouchableHighlight onPress={() => handleSelect(value)} underlayColor="none">
      <View style={styles.dotContainer}>
        <Svg height="50" width="50">          
          <Circle cx="25" cy="25" r="20" stroke="black" strokeWidth="2.5" fill="none"/>
          {selected === value && <Circle cx="25" cy="25" r="12" fill="black" />}
        </Svg>
        <Text style={styles.choiceLabel}>{choiceLabel}</Text>
      </View>
    </TouchableHighlight>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.upperLabel}>{upperLabel}</Text>
      <View style={styles.choicesContainer}>
        {options.map(option => <Dot key={option.value} {...option} />)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start', // Changed to start content at the beginning of the container
        padding: 10    
      },
      choicesContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'flex-start', // Changed to align items to the left
      },  
      dotContainer: {
        alignItems: 'flex-start', // Changed to align items to the left
        justifyContent: 'center',
        marginHorizontal: 15
      },
      upperLabel: {
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left' // Align text to the left
      },
      choiceLabel: {
        textAlign: 'left', // Align text to the left
        marginTop: 5,
      },   
});

export default RadioMutipleChoice;