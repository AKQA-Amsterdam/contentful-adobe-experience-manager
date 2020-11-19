import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Asset,
  HelpText,
  Icon,
  Button,
  EmptyState,
} from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { css } from 'emotion';
import { AppInstallationParameters } from './ConfigScreen';
import aemLogo from '../img/aem-logo.png';
import { IframeActions } from './Dialog';

const assetStyles = css`
  div {
    width: auto;
  }
  img {
    height: 50px;
    width: auto;
  }
`;

const roundButtonStyles = css`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  right: -5px;
  border-radius: 100%;

  cursor: pointer;
  border: 1px solid #ccc;
  background: #eee;
  transition: background 0.3s ease;

  span {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
  }

  svg {
    width: 12px;
  }

  &:hover {
    background: #fff;
  }
`;

interface FieldProps {
  sdk: FieldExtensionSDK;
}

const Field: React.FC<FieldProps> = ({ sdk }: FieldProps) => {
  const [assets, setAssets] = useState(sdk.field.getValue());

  const { configDomain } = sdk.parameters
    .installation as AppInstallationParameters;

  // Update the persistent value whenever the assets selected change
  useEffect(() => {
    const updateFieldValue = async (): Promise<void> => {
      await sdk.field.setValue(assets);
    };
    updateFieldValue();
  }, [assets, sdk]);

  const clearAssets = useCallback(() => {
    setAssets(null);
  }, []);

  const openDialog = useCallback(async (): Promise<void> => {
    const dialogData = await sdk.dialogs.openCurrentApp({
      title: 'Import from Adobe Experience Manager',
      minHeight: 430,
      allowHeightOverflow: true,
    });
    if (dialogData && dialogData.action === IframeActions.success) {
      setAssets(dialogData.data);
    }
  }, [sdk]);

  if (!configDomain) {
    return (
      <EmptyState
        descriptionProps={{
          text:
            'Please set the AEM Asset Selector domain in the App settings before using this field view',
        }}
        headingProps={{
          text: 'App Configuration incomplete',
        }}
      />
    );
  }

  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/
  return (
    <div
      className={css`
        display: flex;
        height: 100%;
      `}
    >
      {assets?.length && (
        <div
          className={css`
            position: relative;
            display: inline-block;
            padding-top: 5px;
          `}
        >
          <Card
            className={css`
              height: 50px;
              display: inline-block;
              padding: 2px;
            `}
          >
            <Asset
              src={assets[0].img || assets[0].url}
              title=""
              className={assetStyles}
            />
          </Card>
          <div>
            {assets.length > 1 && (
              <HelpText>+ {assets.length - 1} more assets</HelpText>
            )}
            <button
              onClick={clearAssets}
              className={roundButtonStyles}
              title="Clear Assets"
            >
              <span>
                <Icon icon="Close" size="small" />
              </span>
            </button>
          </div>
        </div>
      )}
      {!assets && (
        <div
          className={css`
            display: flex;
            flex: 1;
            flex-direction: column;
            padding: 30px;
          `}
        >
          <Button
            onClick={openDialog}
            buttonType="muted"
            className={css`
              & > span > span {
                display: flex;
                align-items: center;
                justify-content: center;
              }
            `}
          >
            <img
              className={css`
                height: 35px;
                margin-right: 10px;
              `}
              src={aemLogo}
              alt="Adobe Experience Manager"
            />
            <span>Import Asset from AEM</span>
          </Button>
          <HelpText style={{ marginTop: '0.5rem' }}>
            Please make sure you are logged in to AEM before you click on the
            button above
          </HelpText>
        </div>
      )}
    </div>
  );
};

export default Field;
