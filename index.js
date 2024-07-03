import { NativeModules, Platform } from 'react-native';
import NativeRNMailHarmony from './src/NativeRNMail.harmonys'

export default Platform.OS == 'harmony' ? NativeRNMailHarmony : NativeModules.RNMail;

