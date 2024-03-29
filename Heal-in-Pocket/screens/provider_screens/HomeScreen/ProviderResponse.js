import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, TouchableOpacity, Text, ScrollView, TouchableWithoutFeedback, Keyboard} from 'react-native';


import styles from './styles';
import axios from 'axios';
import { UserContext } from "../../../context/userContext.js";
import InputBoxWithLabel from './components/InputBoxWithLabel';
import BigInputBoxWithLabel from './components/BigInputBoxWithLabel';
import ProviderInputBox from './components/ProviderInputBox';
import baseURL from '../../../common/baseURL';

export default function ProviderResponseScreen({route, navigation}) {  
  const { request_id } = route.params;
  const { userId, setUserId } = useContext(UserContext);
  const [name, setName] =  useState("");
  const [dob, setDOB] = useState("");
  const [insurance, setInsurance] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState(''); 

  const [smokingStatus, setSmokingStatus] = useState('');
  const [pregnancyStatus, setPregnancyStatus] = useState('');

  const subjectiveRef = useRef(null);
  const objectiveRef = useRef(null);
  const assessmentRef = useRef(null);


  const [chiefComplaint, setChiefComplaint] = useState("");
  const [medicalHistoryValue, setMedicalHistoryValue] = useState("");

  const [medicationAllergies, setMedicationAllergies] = useState(' [Allergies: ' + ']');
  const [providerName, setProviderName] = useState(''); 
  const [scribeName, setScribeName] = useState('');

  const [temperature, setTemperature] = useState('');
  const [systolic_blood_pressure, setSysBloodPressure] = useState('');
  const [diastolic_blood_pressure, setDiaBloodPressure] = useState('');
  const [pulse, setPulse] = useState('');
  const [oxygen, setOxygen] = useState('');
  const [glucose, setGlucose] = useState('');

  const [patientData, setPatientData] = useState(null);


  const convertTimestamp = (mongodbTimestamp) => {
    const date = new Date(mongodbTimestamp);
    const formatted = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;  
    setFormattedDate(formatted);
    return formatted;
  };

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        // Fetch the request to get the corresponding record ID
        const requestResponse = await axios.get(`${baseURL}request/${request_id}`);
        const recordId = requestResponse.data.request.corresponding_record;
        const recordResponse = await axios.get(`${baseURL}record/${recordId}`);
        const recordData = recordResponse.data.record;  
        const patientId = recordData.owner;
        const patient = await axios.get(`${baseURL}patient/patient/${patientId}`);
        const patientData = patient.data.patient;

        setPatientData(patient.data.patient);
        console.log(patientData);

        /**
         * We don't want to show -1 on the screen (may cause confusion to users)
         * if the value is -1, which means it is a null, then we update our local state as null
         * When the volunteer update(or upload) the record again, all the null value will still be 
         * uploaded as -1 to the database
         */
        //smoking and pregnant
        setSmokingStatus(recordData.smoking_status);     
        setPregnancyStatus(recordData.pregnancy_status)

        //vitals

        setTemperature(recordData.vitals.temperature === -1 ? null : recordData.vitals.temperature);
        setGlucose(recordData.vitals.glucose === -1 ? null : recordData.vitals.glucose);
        setOxygen(recordData.vitals.oxygen === -1 ? null : recordData.vitals.oxygen);
        setPulse(recordData.vitals.pulse === -1 ? null : recordData.vitals.pulse);
        setSysBloodPressure(recordData.vitals.systolic_blood_pressure === -1 ? null : recordData.vitals.systolic_blood_pressure);
        setDiaBloodPressure(recordData.vitals.diastolic_blood_pressure === -1 ? null : recordData.vitals.diastolic_blood_pressure);
        // SOAP
        setAssessment(recordData.soap.assessment);        
        setObjective(recordData.soap.objective);
        setSubjective(recordData.soap.subjective);
        // chronic(med history), medication, allegies, chief_compliant:
        setMedicalHistoryValue(recordData.chronic_condition);
        setMedicationAllergies(recordData.current_medications + "[Allergies: " + recordData.allergies + "]");
        setChiefComplaint(recordData.chief_complaint);
        // Provider and scribe, but not update:
        setProviderName(recordData.provider_name);
        setScribeName(recordData.scribe_name);

        setName(patientData.name);
        setDOB(patientData.date_of_birth);  
        setInsurance(patientData.insurance);
        const formattedDate = convertTimestamp(requestResponse.data.request.updatedAt)
        console.log(formattedDate);

      } catch (error) {
        console.error('Error fetching the corresponding record of this request:', error);
      }
    };
    fetchRecord();
  }, [request_id]); // Only re-run the effect if request_id changes

  const updateRecord = async (data, recordId) => {
    try {
      const response = await axios.put(`${baseURL}record/${recordId}`, data);      
      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was successfully sent to the server and the server returned an error response. 
        console.log('Backend Error:', error.response.data.message);
      } else if (error.request) {
        // The request was sent, but no response was received from the server. This can be due to network issues, server downtime, etc.
        console.log('Network Error:', error.message);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error:', error.message);
      }
    }
  }

  const deleteRequest = async(request_id) => {
    try {
      const response = await axios.delete(`${baseURL}request/${request_id}`);

      if (response.status !== 200) {
          throw new Error(response.data.message || 'Failed to delete.');
      }      
      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was successfully sent to the server and the server returned an error response. 
        console.log('Backend Error:', error.response.data.message);
      } else if (error.request) {
        // The request was sent, but no response was received from the server. This can be due to network issues, server downtime, etc.
        console.log('Network Error:', error.message);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error:', error.message);
      }
    }
  };

  // add the record id to doctor's viewed_records
  const addRecordtoDoctor = async(userId, recordId) => {
    try {
      const response = await axios.patch(`${baseURL}doctor/addViewedRecords/${userId}`, { record_id: recordId });
      console.log("Record added successfully:", response.data);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.error("Backend Error:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Network Error:", error.message);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
    }
  };

const handleSubmit = async () => {
  if(assessment === "" || assessment ==="N/A") {
    setErrorMessage("Please fill in Assessent");
  }
  if (confirmSubmit) { 
    let response;
    try{
      response = await axios.get(`${baseURL}request/${request_id}`);
    } catch (error) {
      if (error.response) {
        // The request was successfully sent to the server and the server returned an error response. 
        console.log('Backend Error:', error.response.data.message);
      } else if (error.request) {
        // The request was sent, but no response was received from the server. This can be due to network issues, server downtime, etc.
        console.log('Network Error:', error.message);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error:', error.message);
      }
    }  
    const oldRequest = response.data.request;
    // helper method for parsing the allergies and medication's format
    const parseMedicationAllergies = () => {
      const allergyStart = medicationAllergies.indexOf('[Allergies:');
      const medication = medicationAllergies.substring(0, allergyStart).trim();      
      const allergy = medicationAllergies.substring(allergyStart + 11, medicationAllergies.length - 1).trim(" ");    
      return { medication, allergy };
    };

    const medicationAllergyFormat = parseMedicationAllergies();

    // Update the record here:
    const newRecord = {        
      soap: {
        subjective: subjective || "N/A",
        objective: objective || "N/A",
        assessment: assessment || "N/A",
      },

      chronic_condition: medicalHistoryValue || "N/A",
      allergies: medicationAllergyFormat.allergy || "N/A",
      current_medications: medicationAllergyFormat.medication || 'N/A',
      chief_complaint: chiefComplaint || "N/A",
      smoking_status: smokingStatus || "N/A",
      pregnancy_status: pregnancyStatus || "N/A",


  
      vitals: {
        temperature: temperature || -1,
        systolic_blood_pressure: systolic_blood_pressure || -1,
        diastolic_blood_pressure: diastolic_blood_pressure || -1, 
        pulse: pulse || -1,
        oxygen: oxygen || -1,
        glucose: glucose || -1,
      },
      provider_name: providerName || "N/A",
      scribe_name: scribeName || "N/A"
    };
    const recordId = oldRequest.corresponding_record;
    const updated_record = updateRecord(newRecord, recordId); 

    // add this record id to doctor's viewed_records
    if (updated_record){
      await addRecordtoDoctor(userId, recordId);
    }
    const deletedRequest = deleteRequest(oldRequest.id);
    
    navigation.navigate('Success'); 
  } 
  else {
    // Press first time, input is done, so set it true
    setConfirmSubmit(true);  
  }
  
} 
  const handleOutsidePress = () => {
    if(confirmSubmit) {
      setConfirmSubmit(false);
    }    
  };

  const navigateToPatientProfile = () => {
    if (patientData) {
      navigation.navigate('Patient Profile', { patientData });
    } else {
      console.log('Patient data is not yet loaded.');
    }
  };

return (
  <View style={{flex:1}}>
    <View style={{
      // position: 'absolute',  
      paddingTop: 0,
      backgroundColor: '#DDE5FD',
      flexDirection: 'row', // This is the row that contains the text column and the button
      justifyContent: 'space-between', // This will place the column on the left and the button on the right
      alignItems: 'center', // Vertically center the contents
      height: 85,
      paddingHorizontal: 10, // Add some horizontal padding
      zIndex: 3,
      elevation: 3,
  }}>
    {/* Column for Name, DOB, and Street Corner Care */}
    <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
      <Text style={{ fontSize: 25, fontWeight: '500' }}>{name}</Text>
      <Text style={{ fontSize: 20, fontWeight: '400' }}>DOB: {dob}</Text>
      <Text style={{ fontSize: 20, fontWeight: '400' }}>
        Street Corner Care {'['} {formattedDate} {']'}
      </Text>
    </View>
    
    {/* Button to navigate to the patient profile page */}
    <TouchableOpacity onPress={navigateToPatientProfile} style={styles.headerButton}>
      <Text style={styles.headerButtonText}>Patient Profile</Text> 
    </TouchableOpacity>
      

    {/* <View> */}

      {/* <View style={{ flexDirection: 'row', paddingLeft:5}}>

        <Text style={{fontSize: 25, fontWeight: '500',width:'100%',}}>{name}</Text>
      </View>               */}
      
      {/* <View style={{ flexDirection: 'row', paddingLeft:5}}>
        <Text style={{fontSize: 20, fontWeight: '400', width: '45%'}}>DOB: {dob}</Text>
      </View> */}

      {/* <View style={{ flexDirection: 'row', paddingLeft:5}}>
        <Text style={{fontSize: 20, fontWeight: '400', width: '100%'}}>Street Corner Care  {'['} {formattedDate} {']'}</Text>
   
      </View>  */}
      {/* </View> */}
    
    

  </View>

    <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={
      {
        alignItems: 'center',      
        justifyContent: 'flex-start',
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingVertical:0,      
        marginTop: 0,
        marginHorizontal:0, 
        // paddingTop: 25
      }}>
    
      <Text style={{fontSize:27}}>Visit Note</Text>

      <BigInputBoxWithLabel
        label='Chief Complaint'
        value={chiefComplaint}
        width="100%"
        onChange={(text) => setChiefComplaint(text)}
      />      

      <View style={{width:'100%'}}>
        <ProviderInputBox 
          label="Subjective"
          value={subjective}
          width="100%"
          placeholder="Click to Enter Your Subjective ..."
          onChangeText={(text) => setSubjective(text)}
          onFocus={handleOutsidePress}
          autoFocus={true}
          returnKeyType={"next"}
          onSubmitEditing={() => objectiveRef.current.focus()}
          ref={subjectiveRef}
        />

        <BigInputBoxWithLabel
          label='Medical History'
          value={medicalHistoryValue}
          width="100%"
          onChange={(text) => setMedicalHistoryValue(text)}
      />

      <BigInputBoxWithLabel
        label='Current Medication/Allergies'
        value={medicationAllergies}
        width="100%"
        onChange={(text) => {
          // This is a bit more complex due to the formatting. If you simply want to edit the medications or allergies separately, consider splitting this into two fields.
          setMedicationAllergies(text);
        }}
      />
      </View>
      <View style={{width:'100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
      <InputBoxWithLabel 
      label={"Smoking Status"}
      value={smokingStatus}
      onChange={(text) => setSmokingStatus(text)}
      placeholder={"N/A"}
      width='48%'
    />

      <InputBoxWithLabel 
      label={"Pregnant Status"}
      value={pregnancyStatus}
      onChange={(text) => setPregnancyStatus(text)}
      placeholder={"N/A"}
      width='48%'
    />
      </View>


      <View style={{width:'100%', flexDirection: 'row', justifyContent: 'space-between',}}>

        <InputBoxWithLabel 
          label={"Temp"}
          value={temperature !== null ? temperature.toString() : ''}
          onChange={(text) => setTemperature(text)}
          unit={"F"}
          width='32%'
        />

        <InputBoxWithLabel 
          label={"Pulse"}
          value={pulse !== null ? pulse.toString() : ''}
          onChange={(text) => setPulse(text)}
          unit={"bpm"}
          width='32%'
        />

        <InputBoxWithLabel 
          label={"Oxygen"}
          value={oxygen !== null ? oxygen.toString() : ''}
          onChange={(text) => setOxygen(text)}
          unit={"%"}
          width='32%'
        />
        </View>

      <View style={{width:'100%', flexDirection: 'row', justifyContent: 'space-between',}}>

        <InputBoxWithLabel 
          label={"BG"}
          value={glucose !== null ? glucose.toString() : ''}
          onChange={(text) => setGlucose(text)}
          unit={"mg/dl"}
          width='32%'
        />

        <InputBoxWithLabel 
          label={"Systolic BP"}
          value={systolic_blood_pressure !== null ? systolic_blood_pressure.toString() : ''}
          onChange={(text) => setSysBloodPressure(text)}
          unit={"mmHg"}
          width='32%'
        />

        <InputBoxWithLabel 
          label={"Diastolic BP"}
          value={diastolic_blood_pressure !== null ? diastolic_blood_pressure.toString() : ''}
          onChange={(text) => setDiaBloodPressure(text)}
          unit={"mmHg"}
          width='32%'
          onFocus={handleOutsidePress}
        />
      </View>


      <View style={{width:'100%'}}>
        <ProviderInputBox 
          label="Objective"
          value={objective}
          width="100%"
          placeholder="Click to Enter Your Objective ..."
          onChangeText={(text) => setObjective(text)}
          onFocus={handleOutsidePress}
          ref={objectiveRef}
          returnKeyType={"next"}
          onSubmitEditing={() => assessmentRef.current.focus()}
        />

        <ProviderInputBox 
          label="Assessment / Future Plan"
          value={assessment}
          width="100%"
          placeholder="Click to Enter Your Assessment/Future Plan ..."
          onChangeText={(text) => setAssessment(text)}
          onFocus={handleOutsidePress}
          ref={assessmentRef}
          returnKeyType={"done"}
        />

        <BigInputBoxWithLabel
        label='Provider Name'
        value={providerName}  // You'll need to manage this state variable similarly as others
        width="100%"
        onChange={(text) => setProviderName(text)}
      />

      <BigInputBoxWithLabel
        label='Scribe Name'
        value={scribeName}  // You'll need to manage this state variable similarly as others
        width="100%"
        onChange={(text) => setScribeName(text)}
      />
      </View>
      


      {errorMessage ? <Text style={{color:'red', fontSize:18, marginBottom:10}}>{errorMessage}</Text> : null}

      <View style={{width:'80%',alignItems:'center',marginTop:10,marginBottom:20}}>
        <TouchableOpacity style={confirmSubmit ? styles.confirmButton : styles.normalButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {confirmSubmit ? 'Submit' : 'Confirm'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* reserve empty space for keyboard: */}
      <View style={{ height: 300 }} />  
    
    </ScrollView>          
  </View>
  );
};