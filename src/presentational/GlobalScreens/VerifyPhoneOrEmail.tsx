import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components/native';

import { TextInput, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PlanStackParamList } from '@routes/stacks/PlanStack';

import Background from '@components/Background';
import Header from '@components/Header';
import Button from '@components/Button';
import Title from '@components/Title';
import Subtitle from '@components/Subtitle';

interface HandleTextInputVerifyProps {
  isFirst?: boolean;
  currValueState?: string;
  currSetValueState: (value: string) => void;
  nextInputRef?: RefObject<TextInput>;
  prevInputRef?: RefObject<TextInput>;
}

interface InputVerifyProps {
  isFirst?: boolean;
  currValueState: string;
  currSetValueState: (value: string) => void;
  currRef: RefObject<TextInput>;
  nextInputRef?: RefObject<TextInput>;
  prevInputRef?: RefObject<TextInput>;
}

type NavPropsPlanStack = NativeStackNavigationProp<PlanStackParamList>;

export const VerifyPhoneOrEmail = () => {
  const [valueInputOne, setValueInputOne] = useState('');
  const [valueInputTwo, setValueInputTwo] = useState('');
  const [valueInputThree, setValueInputThree] = useState('');
  const [valueInputFour, setValueInputFour] = useState('');

  const refInputOne = useRef<TextInput>(null);
  const refInputTwo = useRef<TextInput>(null);
  const refInputThree = useRef<TextInput>(null);
  const refInputFour = useRef<TextInput>(null);

  const { height, width } = useWindowDimensions();

  const { goBack } = useNavigation();
  const { navigate: navigateAppStack } = useNavigation<NavPropsPlanStack>();

  const handleNavigateToChosePlans = useCallback(() => {
    navigateAppStack('ChosePlan');
  }, [navigateAppStack]);

  const onSubmit = useCallback(() => {
    if (valueInputFour && valueInputOne && valueInputThree && valueInputTwo) {
      handleNavigateToChosePlans();
    }
  }, [
    handleNavigateToChosePlans,
    valueInputFour,
    valueInputOne,
    valueInputThree,
    valueInputTwo,
  ]);

  const handleTextInputVerify = useCallback(
    ({
      isFirst,
      currValueState,
      currSetValueState,
      nextInputRef,
      prevInputRef,
    }: HandleTextInputVerifyProps) => {
      if (currValueState && currValueState?.length > 1 && isFirst) {
        currValueState[0] && setValueInputOne(currValueState[0]);
        currValueState[1] && setValueInputTwo(currValueState[1]);
        currValueState[2] && setValueInputThree(currValueState[2]);
        currValueState[3] && setValueInputFour(currValueState[3]);

        refInputFour.current?.focus();
      } else {
        if (currValueState) {
          currSetValueState(currValueState[0]);
          nextInputRef?.current?.focus();
        } else {
          currSetValueState('');
          prevInputRef?.current?.focus();
        }
      }
    },

    [],
  );

  useEffect(() => {
    if (
      valueInputOne.length &&
      valueInputTwo.length &&
      valueInputThree.length &&
      valueInputFour.length
    ) {
      onSubmit();
    }
  }, [
    onSubmit,
    valueInputFour.length,
    valueInputOne.length,
    valueInputThree.length,
    valueInputTwo.length,
  ]);

  const renderInputVerify = ({
    isFirst = false,
    currValueState,
    currSetValueState,
    currRef,
    nextInputRef,
    prevInputRef,
  }: InputVerifyProps) => {
    return (
      <StyledTextInput
        style={{ width: width * 0.15 }}
        ref={currRef}
        value={currValueState}
        onChangeText={(value: string) =>
          handleTextInputVerify({
            isFirst,
            currValueState: value,
            currSetValueState,
            nextInputRef,
            prevInputRef,
          })
        }
      />
    );
  };

  return (
    <Background>
      <StyledContent
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          height: height - 24,
        }}
      >
        <Header
          onPress={goBack}
          backgroundColor="BACKGROUND_TRANSPARENT"
          type="justBackButton"
        />
        <Title>Verifique seu número de telefone</Title>
        <Subtitle>
          Enviamos um código para verificar seu número de telefone
        </Subtitle>

        <StyledDescriptionPhone>
          Enviado para +55 11 99999-9999
        </StyledDescriptionPhone>

        <StyledContainerInputsVerify>
          {renderInputVerify({
            isFirst: true,
            currRef: refInputOne,
            currSetValueState: setValueInputOne,
            currValueState: valueInputOne,
            nextInputRef: refInputTwo,
          })}

          {renderInputVerify({
            currRef: refInputTwo,
            currSetValueState: setValueInputTwo,
            currValueState: valueInputTwo,
            nextInputRef: refInputThree,
            prevInputRef: refInputOne,
          })}

          {renderInputVerify({
            currRef: refInputThree,
            currSetValueState: setValueInputThree,
            currValueState: valueInputThree,
            nextInputRef: refInputFour,
            prevInputRef: refInputTwo,
          })}

          {renderInputVerify({
            currRef: refInputFour,
            currSetValueState: setValueInputFour,
            currValueState: valueInputFour,
            prevInputRef: refInputThree,
          })}
        </StyledContainerInputsVerify>

        <StyledContainerNotReceived>
          <StyledTextNotReceived>
            Não recebi nenhum código
          </StyledTextNotReceived>
          <StyledButtonLinkToResend>
            <StyledTextLinkToResend>Reenviar</StyledTextLinkToResend>
          </StyledButtonLinkToResend>
        </StyledContainerNotReceived>

        <Button
          title="Verificar"
          onPress={onSubmit}
          containerStyle={{ marginBottom: 32 }}
        />
      </StyledContent>
    </Background>
  );
};

const StyledContent = styled.ScrollView``;

const StyledDescriptionPhone = styled.Text`
  margin: 0 32px 48px;
`;

const StyledTextInput = styled.TextInput`
  height: 80px;

  border-bottom-width: 3px;
  border-bottom-color: ${({ theme }) => theme.colors.PRIMARY_500};

  margin: 0 12px;

  font-size: ${({ theme }) => theme.sizing.LARGER};
  font-family: ${({ theme }) => theme.fonts.HEEBO_MEDIUM};

  color: ${({ theme }) => theme.colors.PRIMARY_500};

  text-align: center;
`;

const StyledContainerInputsVerify = styled.View`
  flex-direction: row;

  align-self: center;

  margin-bottom: 48px;
`;

const StyledContainerNotReceived = styled.View`
  align-items: center;

  margin-bottom: 48px;
`;

const StyledTextNotReceived = styled(Subtitle)``;

const StyledButtonLinkToResend = styled.TouchableOpacity``;

const StyledTextLinkToResend = styled.Text`
  font-family: ${({ theme }) => theme.fonts.HEEBO_REGULAR};
  font-size: ${({ theme }) => theme.sizing.SMALLEST};

  color: ${({ theme }) => theme.colors.PRIMARY_500};
`;
