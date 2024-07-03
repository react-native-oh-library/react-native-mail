
import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';

interface options {
  subject?: string,
  recipients?: string[],
  ccRecipients?: string[],
  bccRecipients?: string[],
  body?: string,
  customChooserTitle?: string,
  isHTML?: boolean,
  attachments?: {
    path?: string; // Specify either 'path' or 'uri'
    uri?: string;
    type?: string; // Specify either 'type' or 'mimeType'
    mimeType?: string;
    name?: string;
  }[],
}

export interface Spec extends TurboModule {
  mail(option: options, callback: (error: string, event?: string) => void): void,
}

export default TurboModuleRegistry.get<Spec>('RNMail')!;
