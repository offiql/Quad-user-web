import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import React from 'react';

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontSize: 12,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  value: {
    fontSize: 12,
  },
  medicineTable: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#000',
  },
  medicineRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  medicineHeader: {
    fontWeight: 'bold',
    width: '33%',
  },
  medicineColumn: {
    width: '33%',
  },
  advice: {
    marginTop: 5,
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#000',
    borderTopStyle: 'solid',
    paddingTop: 10,
  },
  signature: {
    marginTop: 20,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

// Define props interface
interface PrescriptionPDFProps {
  formData: {
    firstName: string;
    lastName: string;
    complaints: string[];
    clinicalFindings: string;
    diagnosis: string;
    medicines: Array<{
      id: number;
      name: string;
      dosage: string;
      duration: string;
    }>;
    advice: string[];
    additionalNotes: string;
    doctorName?: string;
    clinicName?: string;
    date?: string;
  };
}

export const PrescriptionPDF: React.FC<PrescriptionPDFProps> = ({ formData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{formData.clinicName}</Text>
        <Text style={styles.subtitle}>{`QUAD HEALTH REPORT`}</Text>
        <Text>{formData.date}</Text>
      </View>

      {/* Patient Info */}
      <View style={styles.section}>
        <Text style={styles.label}>Patient Name:</Text>
        <Text style={styles.value}>{`${formData.firstName} ${formData.lastName}`}</Text>
      </View>

      {/* Chief Complaints */}
      <View style={styles.section}>
        <Text style={styles.label}>Chief Complaints:</Text>
        <Text style={styles.value}>{formData.complaints.join(', ')}</Text>
      </View>

      {/* Clinical Findings */}
      <View style={styles.section}>
        <Text style={styles.label}>Clinical Findings:</Text>
        <Text style={styles.value}>{formData.clinicalFindings}</Text>
      </View>

      {/* Diagnosis */}
      <View style={styles.section}>
        <Text style={styles.label}>Diagnosis:</Text>
        <Text style={styles.value}>{formData.diagnosis}</Text>
      </View>

      {/* Medicines Table */}
      <View style={styles.section}>
        <Text style={styles.label}>Prescribed Medicines:</Text>
        <View style={styles.medicineTable}>
          <View style={styles.medicineRow}>
            <Text style={styles.medicineHeader}>Medicine</Text>
            <Text style={styles.medicineHeader}>Dosage</Text>
            <Text style={styles.medicineHeader}>Duration</Text>
          </View>
          {formData.medicines.map((medicine) => (
            <View key={medicine.id} style={styles.medicineRow}>
              <Text style={styles.medicineColumn}>{medicine.name}</Text>
              <Text style={styles.medicineColumn}>{medicine.dosage}</Text>
              <Text style={styles.medicineColumn}>{medicine.duration}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Advice */}
      <View style={styles.section}>
        <Text style={styles.label}>Advice:</Text>
        {formData.advice.map((advice, index) => (
          <Text key={index} style={styles.advice}>{`• ${advice}`}</Text>
        ))}
      </View>

      {/* Additional Notes */}
      <View style={styles.section}>
        <Text style={styles.label}>Additional Notes:</Text>
        <Text style={styles.value}>{formData.additionalNotes}</Text>
      </View>

      {/* Footer */}
      {/* <View style={styles.footer}>
        <Text style={styles.signature}>Dr. {formData.doctorName}</Text>
        <Text style={styles.value}>Signature</Text>
      </View> */}

    </Page>
  </Document>
);
