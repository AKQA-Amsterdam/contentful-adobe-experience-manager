import {
  AppExtensionSDK,
  FieldExtensionSDK,
  DialogExtensionSDK,
} from 'contentful-ui-extensions-sdk';

export enum AssetSelectorMode {
  single = 'single',
  multiple = 'multiple',
}

export interface AppInstallationParameters {
  configDomain: string;
  rootPath: string;
}

export interface AppInstanceParameters {
  mode: AssetSelectorMode;
}

export interface ConfigProps {
  sdk: AppExtensionSDK;
}

export interface ConfigState {
  parameters: AppInstallationParameters;
  validConfigDomain: boolean;
  validPath: boolean;
}

export interface FieldProps {
  sdk: FieldExtensionSDK;
}

export enum IframeActions {
  success,
  cancel,
}

export interface DialogProps {
  sdk: DialogExtensionSDK;
}
