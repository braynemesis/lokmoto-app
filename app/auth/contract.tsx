import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, FileText, Download, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function ContractScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [signed, setSigned] = useState(false);

  const handleSignContract = async () => {
    setLoading(true);
    
    try {
      // if (!user) throw new Error('Usuário não autenticado');
      
      // const { error } = await supabase
      //   .from('contracts')
      //   .insert({
      //     user_id: user.id,
      //     status: 'signed',
      //     signed_at: new Date().toISOString(),
      //   });
        
      // if (error) throw error;
      
      setSigned(true);
      
      setTimeout(() => {
        Alert.alert(
          'Contrato Assinado',
          'Seu contrato foi assinado com sucesso! Agora você pode prosseguir para a retirada da moto.',
          [{ text: 'OK', onPress: () => router.push('/(tabs)') }]
        );
      }, 1500);
    } catch (error: any) {
      console.error('Error signing contract:', error);
      Alert.alert('Erro', error.message || 'Ocorreu um erro ao assinar o contrato. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadContract = () => {
    Alert.alert('Download', 'Contrato salvo em seus documentos.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.title}>Assinatura do Contrato</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoBox}>
          <FileText size={24} color={colors.primary} />
          <Text style={styles.infoText}>
            Para finalizar seu cadastro, é necessário assinar o contrato digital. 
            Leia atentamente antes de assinar.
          </Text>
        </View>
        
        <View style={styles.contractContainer}>
          <Text style={styles.contractTitle}>CONTRATO DE LOCAÇÃO DE MOTOCICLETA</Text>
          
          <ScrollView style={styles.contractScroll}>
            <Text style={styles.contractText}>
              CONTRATO DE LOCAÇÃO DE MOTOCICLETA QUE ENTRE SI CELEBRAM AS PARTES QUALIFICADAS ABAIXO.
              {'\n\n'}
              <Text style={styles.contractBold}>CLÁUSULA PRIMEIRA - DAS PARTES</Text>
              {'\n\n'}
              LOCADOR: [Nome da Empresa], pessoa jurídica de direito privado, inscrita no CNPJ sob o nº [CNPJ], com sede na [Endereço], doravante denominada simplesmente LOCADORA.
              {'\n\n'}
              LOCATÁRIO: [Nome do Cliente], pessoa física, portador do RG nº [RG] e CPF nº [CPF], residente e domiciliado na [Endereço], doravante denominado simplesmente LOCATÁRIO.
              {'\n\n'}
              <Text style={styles.contractBold}>CLÁUSULA SEGUNDA - DO OBJETO</Text>
              {'\n\n'}
              O presente contrato tem por objeto a locação da motocicleta de propriedade da LOCADORA, com as seguintes características:
              {'\n\n'}
              Marca: [Marca]
              {'\n'}
              Modelo: [Modelo]
              {'\n'}
              Ano: [Ano]
              {'\n'}
              Cor: [Cor]
              {'\n'}
              Placa: [Placa]
              {'\n'}
              Chassi: [Chassi]
              {'\n'}
              Renavam: [Renavam]
              {'\n\n'}
              <Text style={styles.contractBold}>CLÁUSULA TERCEIRA - DO PRAZO</Text>
              {'\n\n'}
              A locação terá início em [Data Início] e término em [Data Término], podendo ser prorrogada mediante acordo entre as partes.
              {'\n\n'}
              <Text style={styles.contractBold}>CLÁUSULA QUARTA - DO VALOR E FORMA DE PAGAMENTO</Text>
              {'\n\n'}
              O LOCATÁRIO pagará à LOCADORA o valor de R$ [Valor] ([Valor por Extenso]), a ser pago da seguinte forma: [Forma de Pagamento].
              {'\n\n'}
              <Text style={styles.contractBold}>CLÁUSULA QUINTA - DAS OBRIGAÇÕES DO LOCATÁRIO</Text>
              {'\n\n'}
              São obrigações do LOCATÁRIO:
              {'\n\n'}
              a) Utilizar a motocicleta exclusivamente para o fim a que se destina;
              {'\n'}
              b) Manter a motocicleta em perfeitas condições de uso e conservação;
              {'\n'}
              c) Arcar com as despesas de combustível, estacionamento, pedágios e multas;
              {'\n'}
              d) Não ceder, emprestar ou sublocar a motocicleta a terceiros;
              {'\n'}
              e) Comunicar imediatamente à LOCADORA qualquer dano, avaria ou acidente;
              {'\n'}
              f) Devolver a motocicleta nas mesmas condições em que a recebeu.
              {'\n\n'}
              <Text style={styles.contractBold}>CLÁUSULA SEXTA - DA RESCISÃO</Text>
              {'\n\n'}
              O presente contrato poderá ser rescindido por qualquer das partes, mediante notificação prévia de 30 (trinta) dias.
              {'\n\n'}
              <Text style={styles.contractBold}>CLÁUSULA SÉTIMA - DO FORO</Text>
              {'\n\n'}
              Fica eleito o foro da Comarca de [Comarca] para dirimir quaisquer dúvidas ou controvérsias oriundas do presente contrato.
              {'\n\n'}
              E, por estarem assim justas e contratadas, as partes assinam o presente instrumento em 2 (duas) vias de igual teor e forma, na presença de 2 (duas) testemunhas.
              {'\n\n'}
              [Cidade], [Data]
              {'\n\n'}
              ________________________________
              {'\n'}
              LOCADORA
              {'\n\n'}
              ________________________________
              {'\n'}
              LOCATÁRIO
              {'\n\n'}
              TESTEMUNHAS:
              {'\n\n'}
              1. ________________________________
              {'\n'}
              Nome:
              {'\n'}
              CPF:
              {'\n\n'}
              2. ________________________________
              {'\n'}
              Nome:
              {'\n'}
              CPF:
            </Text>
          </ScrollView>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.downloadButton}
            onPress={handleDownloadContract}
          >
            <Download size={20} color={colors.primary} />
            <Text style={styles.downloadButtonText}>Baixar Contrato</Text>
          </TouchableOpacity>
          
          <Button
            title={signed ? "Contrato Assinado" : "Assinar Contrato"}
            onPress={handleSignContract}
            loading={loading}
            disabled={signed}
            style={styles.signButton}
            icon={signed ? <Check size={20} color={colors.white} /> : undefined}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: colors.textDark,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(83, 127, 231, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textDark,
    marginLeft: 12,
    flex: 1,
  },
  contractContainer: {
    flex: 1,
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 20,
  },
  contractTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 16,
  },
  contractScroll: {
    flex: 1,
  },
  contractText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 22,
  },
  contractBold: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textDark,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  downloadButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
  },
  signButton: {
    flex: 1,
    marginLeft: 12,
  },
});