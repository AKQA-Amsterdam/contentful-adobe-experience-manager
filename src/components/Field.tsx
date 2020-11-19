import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Asset,
  HelpText,
  Icon,
  Button,
  EmptyState,
  ValidationMessage,
} from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { css } from 'emotion';
import {
  AppInstallationParameters,
  AppInstanceParameters,
} from './ConfigScreen';
import aemLogo from '../img/aem-logo.png';
import { IframeActions } from './Dialog';

export type AEMAsset = {
  url: string;
  type: string;
  img?: string;
};

const assetStyles = css`
  width: 50px;
  height: 50px;
`;

const warningStyles = css`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 15px;
  height: 15px;
  border-radius: 100%;
  overflow: hidden;
  display: flex;

  align-items: center;
  justify-content: center;
  svg {
    fill: #bf3045;
    width: 15px;
    height: 15px;
    path:first-child {
      fill: white;
    }
  }
`;

const roundButtonStyles = css`
  width: 20px;
  height: 20px;
  position: absolute;
  top: -5px;
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
  const [hasInvalidAssets, setHasInvalidAssets] = useState(false);

  const { configDomain } = sdk.parameters
    .installation as AppInstallationParameters;
  const { mode } = sdk.parameters.instance as AppInstanceParameters;

  // Update the persistent value whenever the assets selected change
  useEffect(() => {
    const updateFieldValue = async (): Promise<void> => {
      await sdk.field.setValue(assets);
    };
    updateFieldValue();
  }, [assets, sdk]);

  const removeAsset = useCallback(
    (url: string) => {
      const filteeredAssets = assets.filter(
        (asset: AEMAsset) => asset.url !== url
      );
      if (filteeredAssets.length) {
        setAssets(filteeredAssets);
      } else {
        setAssets(null);
      }
    },
    [assets]
  );

  const updateAssets = useCallback(
    (newAssets: AEMAsset[]) => {
      if (mode === 'multiple' && assets?.length) {
        setAssets([...assets, ...newAssets]);
      } else {
        setAssets(newAssets);
      }
    },
    [mode, assets]
  );

  // Check if any assets don't come from AEM
  useEffect(() => {
    setHasInvalidAssets(assets && assets.some((a: AEMAsset) => !a.img));
  }, [assets]);

  const openDialog = useCallback(async (): Promise<void> => {
    const dialogData = await sdk.dialogs.openCurrentApp({
      title: 'Import from Adobe Experience Manager',
      minHeight: 430,
      allowHeightOverflow: true,
      parameters: {
        mode,
      },
    });
    if (dialogData && dialogData.action === IframeActions.success) {
      updateAssets(dialogData.data);
    }
  }, [sdk, updateAssets, mode]);

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
        min-height: 150px;
        display: flex;
        justify-content: space-between;

        flex-direction: column;
      `}
    >
      <div
        className={css`
          display: flex;
          flex-direction: row;
        `}
      >
        {assets?.map((a: AEMAsset) => (
          <div
            key={a.url}
            className={css`
              position: relative;
              margin: 5px;
            `}
          >
            <Card
              className={css`
                height: 50px;
                display: inline-block;
                padding: 2px;
              `}
            >
              <Asset src={a.img || a.url} title="" className={assetStyles} />
            </Card>
            <div>
              <button
                onClick={() => removeAsset(a.url)}
                className={roundButtonStyles}
                title="Clear Assets"
              >
                <span>
                  <Icon icon="Close" size="small" />
                </span>
              </button>
            </div>
            {!a.img && (
              <span
                title="This asset is not coming from AEM"
                className={warningStyles}
              >
                <Icon icon="ErrorCircle" size="small" />
              </span>
            )}
          </div>
        ))}
      </div>
      {hasInvalidAssets && (
        <ValidationMessage>
          Some of the selected assets are not coming from AEM. Please update
          theem before launching your application.
        </ValidationMessage>
      )}
      {(!assets || mode === 'multiple') && (
        <Button
          onClick={openDialog}
          buttonType="muted"
          className={css`
            width: 192px;
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
          <span>Import from AEM</span>
        </Button>
      )}
      <HelpText style={{ marginTop: '0.5rem' }}>
        Please make sure you are logged in to AEM to add assets and see
        thumbnails.
      </HelpText>
    </div>
  );
};

export default Field;
