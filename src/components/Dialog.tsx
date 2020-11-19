import React, { useMemo, useEffect, useCallback } from 'react';
import { Spinner, HelpText } from '@contentful/forma-36-react-components';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import { css } from 'emotion';
import {
  AppInstallationParameters,
  AppInstanceParameters,
} from './ConfigScreen';
import getValidURL from '../utils/getValidUrl';

export enum IframeActions {
  success,
  cancel,
}

interface DialogProps {
  sdk: DialogExtensionSDK;
}

const iframeWrapperStyles = css`
  height: 350px;
  border: 1px solid #c3cfd5;
  overflow: hidden;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const iframeStyles = css`
  width: 100%;
  border: 0;
  height: 350px;

  position: absolute;
  top: 0;
  left: 0;
`;

const Dialog: React.FC<DialogProps> = ({ sdk }: DialogProps) => {
  const { configDomain } = sdk.parameters
    .installation as AppInstallationParameters;

  const { mode } = sdk.parameters.instance as AppInstanceParameters;

  const iframeUrl = useMemo(
    () =>
      `${getValidURL(configDomain || '')}/aem/assetpicker.html?mode=${mode}`,
    [configDomain, mode]
  );

  const listenForMessage = useCallback(
    (event: MessageEvent): void => {
      const res = JSON.parse(event.data);
      if (res.config.action === 'close') {
        sdk.close({ action: IframeActions.cancel, data: {} });
      } else {
        sdk.close({ action: IframeActions.success, data: res.data });
      }
    },
    [sdk]
  );

  useEffect(() => {
    window?.addEventListener('message', listenForMessage);
    return (): void => {
      window?.removeEventListener('message', listenForMessage);
    };
  }, [listenForMessage]);

  return (
    <div
      className={css`
        padding: 20px;
      `}
    >
      <div className={iframeWrapperStyles}>
        <Spinner />
        <iframe
          className={iframeStyles}
          title="Adobe Experience Manager"
          src={iframeUrl}
        />
      </div>
      <HelpText style={{ marginTop: '0.5rem' }}>
        If the AEM window is not loading above, please login to it on a new tab
        and refresh this page.
      </HelpText>
    </div>
  );
};

export default Dialog;
