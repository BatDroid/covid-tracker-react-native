import { Text } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

import { colors, fontStyles } from '@theme';

import { BigButton, IButtonPress } from './BigButton';
import { FieldWrapper } from './Screen';

interface SelectorButtonProps {
  onPress?: IButtonPress;
  text: string;
}

export const SelectorButton: React.FC<SelectorButtonProps> = (props) => (
  <FieldWrapper style={styles.fieldWrapper}>
    <BigButton onPress={props.onPress}>
      <Text style={[fontStyles.bodyLight, styles.buttonText]}>{props.text}</Text>
    </BigButton>
  </FieldWrapper>
);

const styles = StyleSheet.create({
  fieldWrapper: {
    marginVertical: 16,
  },

  buttonText: {
    color: colors.primary,
  },
});
