import React, { useMemo } from 'react';
import {
  EditorToolbar,
  Button,
  Spinner,
} from '@contentful/forma-36-react-components';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import { css } from 'emotion';
import { AppInstallationParameters, AssetSelectorMode } from './ConfigScreen';

interface DialogProps {
  sdk: DialogExtensionSDK;
}

const iframeWrapperStyles = css`
  height: 300px;
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
  height: 300px;

  position: absolute;
  top: 0;
  left: 0;
`;

const Dialog: React.FC<DialogProps> = ({ sdk }: DialogProps) => {
  const { configUrl, mode } = sdk.parameters
    .installation as AppInstallationParameters;
  const iframeUrl = useMemo(
    () => `https://${configUrl}/aem/assetpicker.html?mode=${mode}`,
    [configUrl, mode]
  );

  const closeDialog = (): void => {
    sdk.close({ url: iframeUrl });
  };

  return (
    <div
      className={css`
        padding: 20px;
      `}
    >
      <EditorToolbar
        className={css`
          justify-content: flex-end;
        `}
      >
        <Button
          onClick={closeDialog}
          size="small"
          buttonType="muted"
          className={css`
            margin-right: 10px;
          `}
        >
          Cancel
        </Button>
        <Button onClick={closeDialog} size="small">
          {mode === AssetSelectorMode.multiple
            ? 'Select Assets'
            : 'Select Asset'}
        </Button>
      </EditorToolbar>
      <div className={iframeWrapperStyles}>
        <Spinner />
        <iframe
          className={iframeStyles}
          title="Adobe Experience Manager"
          src={iframeUrl}
        />
      </div>
    </div>
  );
};

export default Dialog;
