import React, { useState } from 'react';
import { TextInput, StyleSheet, Platform, View, TextInputProps } from 'react-native';

interface TextAreaProps extends TextInputProps {
    minHeight?: number;
    onEnterPress?: () => void;
  }
  
  export default function TextArea({
    minHeight = 40,
    style,
    onEnterPress,
    ...props
  }: TextAreaProps) {
    const [inputHeight, setInputHeight] = useState(minHeight);
  
    const handleKeyPress = (
      e: NativeSyntheticEvent<TextInputKeyPressEventData>
    ) => {
      if (e.nativeEvent.key === 'Enter') {
        if (!props.multiline || Platform.OS !== 'ios') {
          e.preventDefault?.(); // Web: previne nova linha
          onEnterPress?.();
        }
      }
  
      props.onKeyPress?.(e);
    };
  
    return (
      <View style={styles.wrapper}>
        <TextInput
          {...props}
          multiline
          blurOnSubmit={false}
          onKeyPress={handleKeyPress}
          onContentSizeChange={(e) => {
            setInputHeight(e.nativeEvent.contentSize.height);
          }}
          style={[
            styles.textArea,
            { minHeight, height: Math.max(minHeight, inputHeight) },
            Platform.OS === 'web' ? styles.webFix : {},
            style,
          ]}
        />
      </View>
    );
  }

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textArea: {
    width: '80%',
    marginVertical: 10, 
    borderWidth: 1, 
    borderColor: '#fff', 
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    color: '#fff',
  },
  webFix: {
    resize: 'none',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
  },
});
