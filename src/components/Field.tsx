import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Asset,
  HelpText,
  Icon,
  Tooltip,
  Button,
} from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { css } from 'emotion';
import aemLogo from '../img/aem-logo.png';

const assetStyles = css`
  div {
    width: auto;
  }
  img {
    height: 100px;
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
    if (dialogData) {
      console.log(dialogData);
    }
  }, [sdk]);

  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/
  return (
    <div
      className={css`
        display: flex;
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
              height: 100px;
              display: inline-block;
              padding: 2px;
            `}
          >
            <Asset src={assets[0].url} title="" className={assetStyles} />
          </Card>
          <div>
            {assets.length > 1 && (
              <HelpText>+ {assets.length - 1} more assets</HelpText>
            )}
            <button onClick={clearAssets} className={roundButtonStyles}>
              <Tooltip content="Clear Assets" isVisible={false} place="right">
                <Icon icon="Close" size="small" />
              </Tooltip>
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
          <HelpText>
            Please make sure you are logged in to AEM before you click on the
            button above
          </HelpText>
        </div>
      )}
    </div>
  );
};

export default Field;
