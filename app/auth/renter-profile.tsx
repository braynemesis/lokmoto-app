import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Upload, MapPin, Briefcase, Chrome as Home, DoorOpenIcon, DoorOpen } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function RenterProfileScreen() {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    profession: '',
    maritalStatus: '',
    address: '',
    zipCode: '',
    gateType: '',
    rentalPurpose: '',
  });
  
  const [documents, setDocuments] = useState({
    driverLicense: null as DocumentPicker.DocumentPickerAsset | null,
    proofOfResidence: null as DocumentPicker.DocumentPickerAsset | null,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pickDocument = async (documentType: 'driverLicense' | 'proofOfResidence') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) {
        return;
      }
      
      setDocuments(prev => ({
        ...prev,
        [documentType]: result.assets[0],
      }));
      
      // Clear error if document was selected
      if (errors[documentType]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[documentType];
          return newErrors;
        });
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Erro', 'Não foi possível selecionar o documento.');
    }
  };

  const findAddressByCep = async (cep: string) => {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    return data;
  };

  const handleInputChange = async (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (field === 'zipCode') {
      const address = await findAddressByCep(value);
      setFormData(prev => ({
        ...prev,
        address: `${address.logradouro}, ${address.complemento} - ${address.bairro} - ${address.localidade} - ${address.uf}`,
      }));
    }
    
    // Clear error if field has value
    if (value && errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName) newErrors.fullName = 'Nome completo é obrigatório';
    if (!formData.profession) newErrors.profession = 'Profissão é obrigatória';
    if (!formData.maritalStatus) newErrors.maritalStatus = 'Estado civil é obrigatório';
    if (!formData.address) newErrors.address = 'Endereço é obrigatório';
    if (!formData.zipCode) newErrors.zipCode = 'CEP é obrigatório';
    if (!formData.gateType) newErrors.gateType = 'Tipo de portão é obrigatório';
    if (!formData.rentalPurpose) newErrors.rentalPurpose = 'Finalidade da locação é obrigatória';
    
    if (!documents.driverLicense) newErrors.driverLicense = 'CNH digital é obrigatória';
    if (!documents.proofOfResidence) newErrors.proofOfResidence = 'Comprovante de residência é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    setLoading(true);
    
    try {
      if (!user) throw new Error('Usuário não autenticado');
      
      // Upload documents to Supabase Storage
      const uploadDocument = async (document: DocumentPicker.DocumentPickerAsset, path: string) => {
        const response = await fetch(document.uri);
        const blob = await response.blob();
        
        const fileExt = document.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${path}/${fileName}`;
        
        const { error } = await supabase.storage
          .from('documents')
          .upload(filePath, blob);
          
        if (error) throw error;
        
        return filePath;
      };
      
      let driverLicensePath = '';
      let proofOfResidencePath = '';
      
      if (documents.driverLicense) {
        driverLicensePath = await uploadDocument(documents.driverLicense, 'driver-licenses');
      }
      
      if (documents.proofOfResidence) {
        proofOfResidencePath = await uploadDocument(documents.proofOfResidence, 'proof-of-residence');
      }
      
      // Update renter profile in database
      const { error } = await supabase
        .from('renter_profiles')
        .insert({
          user_id: user.id,
          full_name: formData.fullName,
          profession: formData.profession,
          marital_status: formData.maritalStatus,
          address: formData.address,
          zip_code: formData.zipCode,
          gate_type: formData.gateType,
          rental_purpose: formData.rentalPurpose,
          driver_license_path: driverLicensePath,
          proof_of_residence_path: proofOfResidencePath,
          status: 'pending',
        });
        
      if (error) throw error;
      
      // Update user profile
      await updateUserProfile({
        fullName: formData.fullName,
        profileComplete: true,
      });
      
      Alert.alert(
        'Perfil Enviado',
        'Seus documentos foram enviados com sucesso e estão em análise. Você será notificado quando seu cadastro for aprovado.',
        [{ text: 'OK', onPress: () => router.push('/auth/contract') }]
      );
    } catch (error: any) {
      console.error('Error submitting profile:', error);
      Alert.alert('Erro', error.message || 'Ocorreu um erro ao enviar seu perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.title}>Perfil do Locatário</Text>
          <Text style={styles.subtitle}>Complete seu cadastro para continuar</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nome Completo"
            placeholder="Seu nome completo"
            value={formData.fullName}
            onChangeText={(value) => handleInputChange('fullName', value)}
            error={errors.fullName}
          />
          
          <View style={styles.documentSection}>
            <Text style={styles.sectionTitle}>Documentos</Text>
            
            <TouchableOpacity 
              style={[styles.documentPicker, errors.driverLicense && styles.documentPickerError]}
              onPress={() => pickDocument('driverLicense')}
            >
              <Upload size={24} color={colors.primary} />
              <Text style={styles.documentPickerText}>
                {documents.driverLicense ? documents.driverLicense.name : 'CNH Digital'}
              </Text>
            </TouchableOpacity>
            {errors.driverLicense && <Text style={styles.errorText}>{errors.driverLicense}</Text>}
            
            <TouchableOpacity 
              style={[styles.documentPicker, errors.proofOfResidence && styles.documentPickerError]}
              onPress={() => pickDocument('proofOfResidence')}
            >
              <Upload size={24} color={colors.primary} />
              <Text style={styles.documentPickerText}>
                {documents.proofOfResidence ? documents.proofOfResidence.name : 'Comprovante de Residência'}
              </Text>
            </TouchableOpacity>
            {errors.proofOfResidence && <Text style={styles.errorText}>{errors.proofOfResidence}</Text>}
          </View>
          
          <Input
            label="Profissão"
            placeholder="Sua profissão"
            value={formData.profession}
            onChangeText={(value) => handleInputChange('profession', value)}
            error={errors.profession}
            leftIcon={<Briefcase size={20} color={colors.textLight} />}
          />
          
          <Input
            label="Estado Civil"
            placeholder="Seu estado civil"
            value={formData.maritalStatus}
            onChangeText={(value) => handleInputChange('maritalStatus', value)}
            error={errors.maritalStatus}
          />
          
          <View style={styles.addressSection}>
            <Text style={styles.sectionTitle}>Informações sobre Estacionamento</Text>
            
            <Input
              label="CEP"
              placeholder="Seu CEP"
              value={formData.zipCode}
              onChangeText={(value) => handleInputChange('zipCode', value)}
              error={errors.zipCode}
              keyboardType="numeric"
            />

            <Input
              label="Endereço"
              editable={false}
              selectTextOnFocus={false}
              placeholder="Seu endereço completo"
              value={formData.address}
              error={errors.address}
              leftIcon={<MapPin size={20} color={colors.textLight} />}
            />
            
            
            <Input
              label="Tipo de Portão"
              placeholder="Ex: Manual, Automático, etc."
              value={formData.gateType}
              onChangeText={(value) => handleInputChange('gateType', value)}
              error={errors.gateType}
              leftIcon={<DoorOpenIcon size={20} color={colors.textLight} />}
            />
            
            <Input
              label="Finalidade da Locação"
              placeholder="Ex: Transporte casa/trabalho, apps, lazer"
              value={formData.rentalPurpose}
              onChangeText={(value) => handleInputChange('rentalPurpose', value)}
              error={errors.rentalPurpose}
            />
          </View>
          
          <Button
            title="Enviar Documentos"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: colors.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textLight,
  },
  form: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: colors.textDark,
    marginBottom: 12,
  },
  documentSection: {
    marginBottom: 24,
  },
  documentPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  documentPickerError: {
    borderColor: colors.danger,
  },
  documentPickerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textDark,
    marginLeft: 12,
    flex: 1,
  },
  addressSection: {
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 10,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.danger,
    marginTop: -8,
    marginBottom: 12,
  },
});