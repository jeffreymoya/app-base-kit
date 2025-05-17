import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
// Attempt to import from @core to demonstrate linkage
// import { logger } from '@core/index'; // Adjust path if index.ts is not directly in src

interface HelloAIProps {
  name?: string;
}

const HelloAI: React.FC<HelloAIProps> = ({ name = 'AI User' }) => {
  // Example of using the logger if successfully imported
  // React.useEffect(() => {
  //   logger.info('HelloAI component mounted for: ' + name);
  // }, [name]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, {name}! Welcome to the AI SDK.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default HelloAI;
