import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Upload, MapPin, Briefcase, Building } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function OwnerProfileScreen() {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    companyName: '',
    cnpj: '',
    address: '',
    zipCode: '',
    phoneNumber: '',
    businessDescription: '',
  });
  
  const [documents, setDocuments] = useState({
    businessLicense: null as DocumentPicker.DocumentPickerAsset | null,
    companyDocument: null as DocumentPicker.DocumentPickerAsset | null,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pickDocument = async (documentType: 'businessLicense' | 'companyDocument') => {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
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
    if (!formData.companyName) newErrors.companyName = 'Nome da empresa é obrigatório';
    if (!formData.cnpj) newErrors.cnpj = 'CNPJ é obrigatório';
    if (!formData.address) newErrors.address = 'Endereço é obrigatório';
    if (!formData.zipCode) newErrors.zipCode = 'CEP é obrigatório';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Telefone é obrigatório';
    
    if (!documents.businessLicense) newErrors.businessLicense = 'Licença comercial é obrigatória';
    if (!documents.companyDocument) newErrors.companyDocument = 'Documento da empresa é obrigatório';
    
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
      
      let businessLicensePath = '';
      let companyDocumentPath = '';
      
      if (documents.businessLicense) {
        businessLicensePath = await uploadDocument(documents.businessLicense, 'business-licenses');
      }
      
      if (documents.companyDocument) {
        companyDocumentPath = await uploadDocument(documents.companyDocument, 'company-documents');
      }
      
      // Update owner profile in database
      const { error } = await supabase
        .from('owner_profiles')
        .insert({
          user_id: user.id,
          full_name: formData.fullName,
          company_name: formData.companyName,
          cnpj: formData.cnpj,
          address: formData.address,
          zip_code: formData.zipCode,
          phone_number: formData.phoneNumber,
          business_description: formData.businessDescription,
          business_license_path: businessLicensePath,
          company_document_path: companyDocumentPath,
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
          <Text style={styles.title}>Perfil do Locador</Text>
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
          
          <Input
            label="Nome da Empresa"
            placeholder="Nome da sua empresa"
            value={formData.companyName}
            onChangeText={(value) => handleInputChange('companyName', value)}
            error={errors.companyName}
            leftIcon={<Building size={20} color={colors.textLight} />}
          />
          
          <Input
            label="CNPJ"
            placeholder="CNPJ da empresa"
            value={formData.cnpj}
            onChangeText={(value) => handleInputChange('cnpj', value)}
            error={errors.cnpj}
            keyboardType="numeric"
          />
          
          <View style={styles.documentSection}>
            <Text style={styles.sectionTitle}>Documentos</Text>
            
            <TouchableOpacity 
              style={[styles.documentPicker, errors.businessLicense && styles.documentPickerError]}
              onPress={() => pickDocument('businessLicense')}
            >
              <Upload size={24} color={colors.primary} />
              <Text style={styles.documentPickerText}>
                {documents.businessLicense ? documents.businessLicense.name : 'Licença Comercial'}
              </Text>
            </TouchableOpacity>
            {errors.businessLicense && <Text style={styles.errorText}>{errors.businessLicense}</Text>}
            
            <TouchableOpacity 
              style={[styles.documentPicker, errors.companyDocument && styles.documentPickerError]}
              onPress={() => pickDocument('companyDocument')}
            >
              <Upload size={24} color={colors.primary} />
              <Text style={styles.documentPickerText}>
                {documents.companyDocument ? documents.companyDocument.name : 'Documento da Empresa'}
              </Text>
            </TouchableOpacity>
            {errors.companyDocument && <Text style={styles.errorText}>{errors.companyDocument}</Text>}
          </View>
          
          <View style={styles.addressSection}>
            <Text style={styles.sectionTitle}>Informações de Contato</Text>
            
            <Input
              label="Endereço"
              placeholder="Endereço da empresa"
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              error={errors.address}
              leftIcon={<MapPin size={20} color={colors.textLight} />}
            />
            
            <Input
              label="CEP"
              placeholder="CEP"
              value={formData.zipCode}
              onChangeText={(value) => handleInputChange('zipCode', value)}
              error={errors.zipCode}
              keyboardType="numeric"
            />
            
            <Input
              label="Telefone"
              placeholder="Telefone de contato"
              value={formData.phoneNumber}
              onChangeText={(value) => handleInputChange('phoneNumber', value)}
              error={errors.phoneNumber}
              keyboardType="phone-pad"
            />
            
            <Input
              label="Descrição do Negócio"
              placeholder="Descreva brevemente seu negócio"
              value={formData.businessDescription}
              onChangeText={(value) => handleInputChange('businessDescription', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={styles.textArea}
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
  textArea: {
    height: 100,
    paddingTop: 12,
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